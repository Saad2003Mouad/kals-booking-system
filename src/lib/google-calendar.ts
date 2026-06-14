import { google, calendar_v3 } from "googleapis";
import { prisma } from "@/lib/prisma";

export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
}

async function getAuthenticatedClient() {
  const client = getOAuth2Client();

  const refreshTokenSetting = await prisma.setting.findUnique({
    where: { key: "google_calendar_refresh_token" }
  });

  const accessTokenSetting = await prisma.setting.findUnique({
    where: { key: "google_calendar_access_token" }
  });

  if (!refreshTokenSetting?.value) {
    console.warn("Google Calendar OAuth: No refresh token found. User must connect account.");
    return null;
  }

  client.setCredentials({
    refresh_token: refreshTokenSetting.value,
    access_token: accessTokenSetting?.value || undefined
  });

  // Automatically listen for token refreshes and save the new access token
  client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await prisma.setting.upsert({
        where: { key: "google_calendar_access_token" },
        update: { value: tokens.access_token },
        create: { key: "google_calendar_access_token", value: tokens.access_token }
      });
    }
    // Very rarely a new refresh token might be issued
    if (tokens.refresh_token) {
      await prisma.setting.upsert({
        where: { key: "google_calendar_refresh_token" },
        update: { value: tokens.refresh_token },
        create: { key: "google_calendar_refresh_token", value: tokens.refresh_token }
      });
    }
  });

  return google.calendar({ version: "v3", auth: client });
}

export const googleCalendarService = {
  
  async createBookingEvent(booking: any) {
    const client = await getAuthenticatedClient();
    if (!client) return null;

    try {
      const eventDate = new Date(booking.eventDate);
      const [hours, minutes] = (booking.startTime || "12:00").split(":");
      
      const startDateTime = new Date(eventDate);
      startDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + (booking.durationMins || 60));

      const eventBody: calendar_v3.Schema$Event = {
        summary: `Boston Legend Ice Cream Truck - ${booking.customer.firstName} ${booking.customer.lastName}`,
        location: `${booking.address}, ${booking.city}, MA ${booking.zip}`,
        description: `Internal Booking ID: ${booking.bookingNumber || booking.id}\nCustomer: ${booking.customer.firstName} ${booking.customer.lastName}\nPhone: ${booking.customer.phone}\nEmail: ${booking.customer.email}\nPackage: ${booking.package?.name || "Custom"}\nEvent Type: ${booking.eventType || "N/A"}\nGuest Count: ${booking.guests || 0}\nCustomer Notes: ${booking.notes || "None"}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "America/New_York",
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "America/New_York",
        },
      };

      const res = await client.events.insert({
        calendarId: 'primary',
        requestBody: eventBody,
      });

      if (res.data && res.data.id) {
        // Save the Google Event ID on the booking
        await prisma.booking.update({
          where: { id: booking.id },
          data: { googleEventId: res.data.id }
        });
        return res.data.id;
      }
    } catch (error) {
      console.error("Error creating Google Calendar event:", error);
    }
    return null;
  },

  async updateBookingEvent(booking: any) {
    if (!booking.googleEventId) {
      // If it doesn't exist but we are updating, maybe we should create it
      if (booking.status === "CONFIRMED") {
         return await this.createBookingEvent(booking);
      }
      return null;
    }

    const client = await getAuthenticatedClient();
    if (!client) return null;

    try {
      const eventDate = new Date(booking.eventDate);
      const [hours, minutes] = (booking.startTime || "12:00").split(":");
      
      const startDateTime = new Date(eventDate);
      startDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + (booking.durationMins || 60));

      const eventBody: calendar_v3.Schema$Event = {
        summary: `Boston Legend Ice Cream Truck - ${booking.customer.firstName} ${booking.customer.lastName}`,
        location: `${booking.address}, ${booking.city}, MA ${booking.zip}`,
        description: `Internal Booking ID: ${booking.bookingNumber || booking.id}\nCustomer: ${booking.customer.firstName} ${booking.customer.lastName}\nPhone: ${booking.customer.phone}\nEmail: ${booking.customer.email}\nPackage: ${booking.package?.name || "Custom"}\nEvent Type: ${booking.eventType || "N/A"}\nGuest Count: ${booking.guests || 0}\nCustomer Notes: ${booking.notes || "None"}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "America/New_York",
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "America/New_York",
        },
      };

      await client.events.update({
        calendarId: 'primary',
        eventId: booking.googleEventId,
        requestBody: eventBody,
      });

      return booking.googleEventId;
    } catch (error: any) {
      // If the event was manually deleted from Google Calendar, it might return a 404
      if (error.code === 404) {
         console.warn(`Google Event ${booking.googleEventId} not found for updating. Will recreate if confirmed.`);
         if (booking.status === "CONFIRMED") {
            return await this.createBookingEvent(booking);
         }
      }
      console.error("Error updating Google Calendar event:", error);
      return null;
    }
  },

  async deleteBookingEvent(googleEventId?: string | null) {
    if (!googleEventId) return false;

    const client = await getAuthenticatedClient();
    if (!client) return false;

    try {
      await client.events.delete({
        calendarId: 'primary',
        eventId: googleEventId,
      });
      return true;
    } catch (error: any) {
      if (error.code === 404) {
        // Already deleted or not found
        return true;
      }
      console.error("Error deleting Google Calendar event:", error);
      return false;
    }
  }
};
