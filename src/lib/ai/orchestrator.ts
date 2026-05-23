import { createGroq } from "@ai-sdk/groq";
import { generateText, tool } from "ai";
import { z } from "zod";
import { getPackages, estimatePrice, checkAvailability } from "./tools/businessLogic";
import { getRevenueStats, getCustomerStats, getEventAnalytics } from "./tools/analytics";
import { getBookings } from "./tools/bookings";

// Initialize Groq provider with Next.js fetch caching disabled
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || "",
  fetch: (url, init) => {
    return fetch(url, {
      ...init,
      cache: "no-store",
      next: { revalidate: 0 }
    } as any);
  }
});

// ── Tool Registry ─────────────────────────────────────────────────
const CUSTOMER_TOOLS = {
  getPackages: tool({
    description: "Get all available Boston Legend ice cream truck packages, pricing, and descriptions.",
    parameters: z.object({ dummy: z.string().optional() }),
    execute: async (args: any) => getPackages(),
  } as any),
  checkAvailability: tool({
    description: "Check if a given date has available vehicles for an event.",
    parameters: z.object({
      date: z.string().describe("Date in YYYY-MM-DD format"),
    }),
    execute: async (args: any) => {
      const { date } = args || {};
      return checkAvailability(date);
    },
  } as any),
  estimatePrice: tool({
    description: "Estimate the price for a booking given guest count and package ID.",
    parameters: z.object({
      guests: z.number().describe("Number of guests"),
      packageId: z.string().describe("Package ID"),
    }),
    execute: async (args: any) => {
      const { guests, packageId } = args || {};
      return estimatePrice(guests, packageId);
    },
  } as any),
};

const ADMIN_TOOLS = {
  getRevenueStats: tool({
    description: "Get total revenue and confirmed booking count.",
    parameters: z.object({ dummy: z.string().optional() }),
    execute: async (args: any) => {
      const res = await getRevenueStats();
      return JSON.parse(JSON.stringify(res));
    },
  } as any),
  getCustomerStats: tool({
    description: "Get total customer count.",
    parameters: z.object({ dummy: z.string().optional() }),
    execute: async (args: any) => {
      const res = await getCustomerStats();
      return JSON.parse(JSON.stringify(res));
    },
  } as any),
  getBookings: tool({
    description: "Get a list of bookings filtered by status. Use 'ALL' for no filter.",
    parameters: z.object({
      status: z.enum(["ALL", "PENDING_REVIEW", "PENDING_PAYMENT", "CONFIRMED", "COMPLETED", "CANCELLED"]).describe("Booking status filter"),
    }),
    execute: async (args: any) => {
      const { status } = args || {};
      const res = await getBookings(status === "ALL" ? undefined : status);
      return JSON.parse(JSON.stringify(res));
    }
  } as any),
  getEventAnalytics: tool({
    description: "Get a breakdown of bookings grouped by event type.",
    parameters: z.object({ dummy: z.string().optional() }),
    execute: async (args: any) => {
      const res = await getEventAnalytics();
      return JSON.parse(JSON.stringify(res));
    },
  } as any),
  getInquiries: tool({
    description: "Get a list of AI leads and customer inquiries filtered by status. Use 'ALL' for no filter.",
    parameters: z.object({
      status: z.enum(["ALL", "NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"]).describe("Filter inquiries by status"),
    }),
    execute: async (args: any) => {
      const { status } = args || {};
      const { prisma } = await import("@/lib/prisma");
      const res = await prisma.inquiry.findMany({ where: status && status !== "ALL" ? { status } : {}, orderBy: { createdAt: "desc" }, take: 10 });
      return JSON.parse(JSON.stringify(res));
    }
  } as any),
  getTasks: tool({
    description: "Get a list of operational tasks filtered by status. Use 'ALL' for no filter.",
    parameters: z.object({
      status: z.enum(["ALL", "TODO", "IN_PROGRESS", "DONE", "BLOCKED"]).describe("Filter tasks by status"),
    }),
    execute: async (args: any) => {
      const { status } = args || {};
      const { prisma } = await import("@/lib/prisma");
      const res = await prisma.task.findMany({ where: status && status !== "ALL" ? { status } : {}, orderBy: { createdAt: "desc" }, take: 10 });
      return JSON.parse(JSON.stringify(res));
    }
  } as any),
  getTodayBookings: tool({
    description: "Get bookings scheduled for today.",
    parameters: z.object({ dummy: z.string().optional() }),
    execute: async () => {
      const { prisma } = await import("@/lib/prisma");
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const res = await prisma.booking.findMany({
        where: {
          eventDate: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        include: { customer: true },
        orderBy: { startTime: "asc" }
      });
      return JSON.parse(JSON.stringify(res));
    }
  } as any),
  getFleetStatus: tool({
    description: "Get the current list of all vehicles in the fleet and their operational status.",
    parameters: z.object({ dummy: z.string().optional() }),
    execute: async () => {
      const { prisma } = await import("@/lib/prisma");
      const res = await prisma.vehicle.findMany({
        orderBy: { code: "asc" }
      });
      return JSON.parse(JSON.stringify(res));
    }
  } as any),
  getUnpaidBookings: tool({
    description: "Get all bookings that are confirmed or pending but unpaid (PENDING_PAYMENT status).",
    parameters: z.object({ dummy: z.string().optional() }),
    execute: async () => {
      const { prisma } = await import("@/lib/prisma");
      const res = await prisma.booking.findMany({
        where: { status: "PENDING_PAYMENT" },
        include: { customer: true },
        orderBy: { eventDate: "asc" }
      });
      return JSON.parse(JSON.stringify(res));
    }
  } as any),
  getWeeklyRevenue: tool({
    description: "Get revenue stats grouped by day for the last 7 days to analyze weekly revenue.",
    parameters: z.object({ dummy: z.string().optional() }),
    execute: async () => {
      const { prisma } = await import("@/lib/prisma");
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const bookings = await prisma.booking.findMany({
        where: {
          status: "CONFIRMED",
          eventDate: { gte: sevenDaysAgo }
        },
        include: { quote: true }
      });

      const totalRevenue = bookings.reduce((sum, b) => sum + (b.quote?.totalAmount || 0), 0);
      return {
        totalRevenueThisWeek: totalRevenue,
        confirmedCount: bookings.length,
        bookings: bookings.map(b => ({
          bookingNumber: b.bookingNumber,
          amount: b.quote?.totalAmount || 0,
          date: b.eventDate.toISOString().split("T")[0]
        }))
      };
    }
  } as any)
};

// ── System Prompts ────────────────────────────────────────────────
const CUSTOMER_PROMPT = `
You are the elite AI Concierge for Boston Legend Ice Cream Truck — a premium, luxury ice cream catering platform serving Massachusetts and the Greater Boston Area.

BUSINESS CONTEXT:
Boston Legend provides premium ice cream truck catering services for:
- Birthday Parties
- Corporate Events
- Weddings
- Fundraisers
- School Events
- Sports Events
- Marketing Events
- Photo Sessions
- Movie Rentals
- Launch Parties
- Block Parties
- Reunions

RULES:
1. ALWAYS be highly professional, warm, premium, and concise.
2. NEVER guess or hallucinate packages or prices. ALWAYS use the getPackages tool to list options and estimatePrice to calculate costs.
3. If users ask about availability, use the checkAvailability tool.
4. Guide users to [Book Online](/booking) or call 617-999-3803 for complex requests or if they are ready to book.
5. Emphasize the luxury aspect of Boston Legend (e.g. "We provide an unforgettable premium ice cream experience").
6. NEVER return a generic "Sorry I'm having trouble" fallback. Always provide a helpful response.
`;

const ADMIN_PROMPT = `
You are the Operations AI Copilot for Boston Legend Ice Cream Truck.

BUSINESS CONTEXT:
- Project Name: Boston Legend Ice Cream Truck.
- Fleet: 5 Americano trucks and 2 vans.
- Booking Flow: Package -> Event Details -> Contact -> Verify -> Review.
- Booking Statuses: PENDING_REVIEW, PENDING_PAYMENT, CONFIRMED, REJECTED, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED.
- Distance Rule: Distance is calculated from 02151. High distance -> Pending Review.
- Hours Rule: Outside normal working hours -> Pending Review.
- Payment Rule: Do not confirm bookings before payment. After payment, status becomes CONFIRMED.
- Escalation Rule: If a customer requests human help in chat, it creates an Inquiry.

RULES:
1. Be professional, highly analytical, and precise.
2. NEVER guess or hallucinate data — ALWAYS use the provided tools (getBookings, getRevenueStats, getInquiries, getTasks).
3. If there is no data, explicitly state "There are no bookings/tasks/inquiries found for this query."
4. Structure your responses clearly using markdown (bullet points, bold text).
5. If the admin asks to perform a destructive action (delete, approve, reject), remind them to do it via the dashboard UI, as you are a read-only insights copilot.
6. Provide actionable suggestions based on the data you read.
`;

// ── Orchestrator ──────────────────────────────────────────────────
type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function orchestrateAI(role: "customer" | "admin", messages: ChatMessage[]) {
  const tools = role === "customer" ? CUSTOMER_TOOLS : ADMIN_TOOLS;
  const systemPrompt = role === "customer" ? CUSTOMER_PROMPT : ADMIN_PROMPT;
  const model = groq("llama-3.3-70b-versatile");

  try {
    // Step 1: Call generateText with tools — model decides which tool to call
    const step1 = await generateText({
      model,
      system: systemPrompt,
      messages: messages as any,
      tools,
    });

    const firstStep = step1.steps[0];

    // Check if the model requested tool execution
    if (firstStep && firstStep.finishReason === "tool-calls") {
      const generatedMessages = firstStep.response.messages;

      // Extract tool results from the step content
      const toolResults = firstStep.content
        .filter((c: any) => c.type === "tool-result")
        .map((c: any) => ({
          toolName: c.toolName,
          result: c.output?.value ?? c.output ?? {}
        }));

      // Build a data-aware system prompt for Step 2 so the model
      // summarizes REAL DB data instead of hallucinating
      const dataContext = toolResults
        .map(tr => `[${tr.toolName} LIVE DATA]\n${JSON.stringify(tr.result, null, 2)}`)
        .join("\n\n");

      const step2System = `${systemPrompt}

IMPORTANT: You have just retrieved the following LIVE DATA from the Boston Legend database. 
Use ONLY this data to answer the user. Do NOT say you don't have access to data. 
Present the results in a clear, professional markdown format.

${dataContext}`;

      // Clean/format generated messages to comply with strict AI SDK v6 schemas
      const formattedGenerated = generatedMessages.map((m: any) => {
        if (m.role === "tool") {
          return {
            role: "tool",
            content: Array.isArray(m.content)
              ? m.content.map((c: any) => {
                  if (c.type === "tool-result") {
                    const rawVal = c.output?.value ?? c.output ?? c.result ?? {};
                    return {
                      type: "tool-result",
                      toolCallId: c.toolCallId,
                      toolName: c.toolName,
                      output: { type: "json", value: rawVal }
                    };
                  }
                  return c;
                })
              : m.content
          };
        }
        if (m.role === "assistant") {
          return {
            role: "assistant",
            content: Array.isArray(m.content)
              ? m.content.map((c: any) => {
                  if (c.type === "tool-call") {
                    return {
                      type: "tool-call",
                      toolCallId: c.toolCallId,
                      toolName: c.toolName,
                      input: c.input || {},
                    };
                  }
                  return c;
                })
              : m.content
          };
        }
        return m;
      });

      const updatedMessages = [
        ...messages,
        ...formattedGenerated
      ].filter((m: any) => m.role !== "system");

      // Step 2: Synthesize a natural response from the tool results
      const step2 = await generateText({
        model,
        system: step2System,
        messages: updatedMessages as any,
      });

      const toolCalls = firstStep.content.filter((c: any) => c.type === "tool-call") || [];

      return {
        intent: "TOOL_EXECUTION",
        tool_calls: toolCalls,
        data: toolResults,
        final_response: step2.text || "Data retrieved successfully.",
      };
    }

    // No tool was called — direct conversational response
    return {
      intent: "CONVERSATION",
      tool_calls: [],
      data: [],
      final_response: step1.text || "",
    };

  } catch (error) {
    console.error("Groq AI Execution Error:", error);
    return {
      intent: "ERROR",
      tool_calls: [],
      data: [],
      final_response: role === "customer"
        ? "I apologize, but I am experiencing a temporary connection issue. Please call 617-999-3803."
        : "Copilot Error: I am having trouble connecting to the database. Please try again.",
    };
  }
}
