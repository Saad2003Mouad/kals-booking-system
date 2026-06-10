import { google, calendar_v3 } from "googleapis";
import { prisma } from "@/lib/prisma";

// Format private key (replace escaped newlines if they exist from env variables)
function getPrivateKey() {
  const pk = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || "";
  return pk.replace(/\\n/g, "\n");
}

function getCalendarClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = getPrivateKey();

  if (!email || !privateKey) {
    console.warn("Google Calendar Service Account credentials missing in environment.");
    return null;
  }

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar.events", "https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
}

export const googleCalendarService = {
  
  async createBookingEvent(booking: any) {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const client = getCalendarClient();
    
    if (!client || !calendarId) {
      console.warn("Skipping Calendar Sync: Missing configuration (Calendar ID or Credentials).");
      return null;
    }

    try {
      // Create date strings in ISO format for Google Calendar
      const eventDate = new Date(booking.eventDate);
      const [hours, minutes] = (booking.startTime || "12:00").split(":");
      
      const startDateTime = new Date(eventDate);
      startDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + (booking.durationMins || 60));

      const eventBody: calendar_v3.Schema$Event = {
        summary: `${booking.package?.name || "Booking"} - ${booking.customer.firstName} ${booking.customer.lastName}`,
        location: `${booking.address}, ${booking.city}, MA ${booking.zip}`,
        description: `Booking ID: ${booking.bookingNumber || booking.id}\nCustomer: ${booking.customer.firstName} ${booking.customer.lastName}\nPackage: ${booking.package?.name || "Custom"}\nPhone: ${booking.customer.phone}\nEmail: ${booking.customer.email}\nInternal Notes: ${booking.internalNote || "None"}\nCustomer Notes: ${booking.notes || "None"}`,
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
        calendarId,
        requestBody: eventBody,
      });

      if (res.data && res.data.id) {
        // Save mapping to settings
        await prisma.setting.upsert({
          where: { key: `gcal_event_${booking.id}` },
          update: { value: res.data.id },
          create: { key: `gcal_event_${booking.id}`, value: res.data.id }
        });
        return res.data.id;
      }
    } catch (error) {
      console.error("Error creating Google Calendar event:", error);
    }
    return null;
  },

  async updateBookingEvent(booking: any) {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const client = getCalendarClient();
    
    if (!client || !calendarId) return null;

    try {
      // Find event mapping
      const setting = await prisma.setting.findUnique({
        where: { key: `gcal_event_${booking.id}` }
      });

      if (!setting || !setting.value) {
        // If it doesn't exist but should, create it
        return await this.createBookingEvent(booking);
      }

      const eventId = setting.value;

      const eventDate = new Date(booking.eventDate);
      const [hours, minutes] = (booking.startTime || "12:00").split(":");
      
      const startDateTime = new Date(eventDate);
      startDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + (booking.durationMins || 60));

      const eventBody: calendar_v3.Schema$Event = {
        summary: `${booking.package?.name || "Booking"} - ${booking.customer.firstName} ${booking.customer.lastName}`,
        location: `${booking.address}, ${booking.city}, MA ${booking.zip}`,
        description: `Booking ID: ${booking.bookingNumber || booking.id}\nCustomer: ${booking.customer.firstName} ${booking.customer.lastName}\nPackage: ${booking.package?.name || "Custom"}\nPhone: ${booking.customer.phone}\nEmail: ${booking.customer.email}\nInternal Notes: ${booking.internalNote || "None"}\nCustomer Notes: ${booking.notes || "None"}`,
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
        calendarId,
        eventId,
        requestBody: eventBody,
      });

      return eventId;
    } catch (error) {
      console.error("Error updating Google Calendar event:", error);
      return null;
    }
  },

  async deleteBookingEvent(bookingId: string) {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const client = getCalendarClient();
    
    if (!client || !calendarId) return false;

    try {
      const setting = await prisma.setting.findUnique({
        where: { key: `gcal_event_${bookingId}` }
      });

      if (!setting || !setting.value) return true; // Already gone or never existed

      const eventId = setting.value;

      await client.events.delete({
        calendarId,
        eventId,
      });

      // Cleanup mapping
      await prisma.setting.delete({
        where: { key: `gcal_event_${bookingId}` }
      });

      return true;
    } catch (error) {
      console.error("Error deleting Google Calendar event:", error);
      return false;
    }
  }
};
