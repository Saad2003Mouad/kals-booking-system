import { z } from "zod";
import { getRevenueStats, getCustomerStats } from "../tools/analytics";
import { getBookings } from "../tools/bookings";
import { detectScheduleConflicts } from "../tools/businessLogic";

export const ADMIN_PROMPT = `
You are the AI system for Boston Legend Ice Cream Truck.

Your role is NOT a generic chatbot. You are an intelligent assistant integrated into a luxury ice cream catering platform. You must assist administrators professionally.

ADMIN AI RESPONSIBILITIES:
- summarize bookings
- assist operations
- help organize schedules
- assist with customer management
- help identify scheduling conflicts
- support operational decisions

BEHAVIOR REQUIREMENTS:
- premium tone
- professional
- never generic
- NEVER compute analytics manually. ALWAYS use the provided analytics tools.
- NEVER guess booking details. ALWAYS use getBookings.

IMPORTANT:
Do NOT answer with generic fallback messages.
You are part of the Boston Legend platform.
`;

export const adminToolDefs = {
  getRevenueStats: {
    description: "Get the total confirmed revenue and total confirmed bookings count.",
    parameters: z.object({ confirm: z.literal("yes").describe("Pass 'yes' to confirm") }),
    execute: getRevenueStats,
  },
  getCustomerStats: {
    description: "Get statistics about the customer base.",
    parameters: z.object({ confirm: z.literal("yes").describe("Pass 'yes' to confirm") }),
    execute: getCustomerStats,
  },
  getBookings: {
    description: "Get a list of bookings, optionally filtered by status.",
    parameters: z.object({
      status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional().describe("The status to filter bookings by."),
    }),
    execute: ({ status }: { status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" }) =>
      getBookings(status),
  },
  detectScheduleConflicts: {
    description: "Check for schedule conflicts on a specific date.",
    parameters: z.object({
      date: z.string().describe("The date to check conflicts for, in YYYY-MM-DD format."),
    }),
    execute: ({ date }: { date: string }) => detectScheduleConflicts(date),
  },
};
