import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
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

// Initialize Google Gemini provider with Next.js fetch caching disabled
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
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
    execute: async (args: any) => {
      const res = await getPackages();
      return JSON.parse(JSON.stringify(res));
    },
  } as any),
  checkAvailability: tool({
    description: "Check if a given date has available vehicles for an event.",
    parameters: z.object({
      date: z.string().describe("Date in YYYY-MM-DD format"),
    }),
    execute: async (args: any) => {
      const { date } = args || {};
      const res = await checkAvailability(date);
      return JSON.parse(JSON.stringify(res));
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
      const res = await estimatePrice(guests, packageId);
      return JSON.parse(JSON.stringify(res));
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
Boston Legend provides premium ice cream truck catering services for all types of events (Birthdays, Corporate Events, Weddings, School Festivals, etc.).
We operate two types of vehicles:
- Luxury Ice Cream Trucks (Americano Truck)
- Premium Sprinter/Dodge Vans

PACKAGE DETAILS:
Our pricing and details are dynamic from the database, but for your general knowledge, we offer:
1. Luxury Trucks (Americano Truck):
   - Patriot: 30 servings, 45 Min duration, base price $250. Extra guests $5/person.
   - Fenway: 50 servings, 45 Min duration, base price $340. Extra guests $5/person.
   - Harbor: 75 servings, 45 Min duration, base price $425. Extra guests $5/person.
   - All-Star: 100 servings, 45 Min duration, base price $495. Extra guests $5/person.
   - Hall of Fame: 150 servings, 60 Min duration, base price $725. Extra guests $5/person.
   - Dynasty: 200 servings, 90 Min duration, base price $950. Extra guests $5/person.

2. Premium Sprinter Vans (Sprinter/Dodge Van):
   - Starter Party: 30 servings, 40 Min duration, base price $190. Extra guests $5/person.
   - Family Event: 50 servings, 40 Min duration, base price $275. Extra guests $5/person.
   - Celebration Pack: 75 servings, 40 Min duration, base price $365. Extra guests $5/person.
   - Silver Special: 100 servings, 40 Min duration, base price $450. Extra guests $5/person.
   - Big Smile: 150 servings, 60 Min duration, base price $695. Extra guests $4/person.
   - School Festival Special: 200 servings, 60 Min duration, base price $825. Extra guests $4/person.

PRICING & OPERATION POLICIES:
- Travel Fee: First 10 miles from our garage in Revere, MA (84 Fernwood Ave) are FREE. Additional miles are calculated dynamically during booking.
- Additional Service Time: Billed at $35 per 30 minutes.
- Multi-Stop Events: We support multi-stop routing! Each additional stop adds a $50 routing/setup fee.
- Additional Vehicle Setup Fee: If the event requires another truck/van for the same package at the same time, each additional vehicle includes a $200 setup and dispatch fee. Package price is charged only once; extra vehicles do not multiply the package price.
- Weekend Event Fee: Saturday and Sunday bookings include an additional $25 weekend event fee (applies once per booking, not per vehicle/location).
- Payment Policy: We collect payment *after* the service is completed (no online checkout or Pay Now). We accept cash, Zelle, Venmo, and credit/debit cards.
- Booking Flow: Fully automated online booking is available at [/booking](/booking). All normal bookings are automatically CONFIRMED, except if the travel distance is greater than 30 miles AND the total package price (excluding travel/stops/extra fees) is less than $500, OR if the request is for the Custom Event Package (200+ guests), in which cases they go to PENDING_REVIEW for manual team approval. No normal booking is automatically rejected.
- Manage Booking: Customers can securely view, modify, or request cancellations for their bookings through the Customer Portal at [/manage-booking](/manage-booking).

RULES:
1. ALWAYS be highly professional, warm, premium, and concise. You can converse in Arabic or English based on the user's language.
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
- Booking Confirmation & Review Rules:
  * All normal bookings are automatically CONFIRMED upon submission.
  * Exception 1: If the travel distance is greater than 30 miles and the total package price (excluding travel/stops/extra fees) is less than $500, the status goes to PENDING_REVIEW.
  * Exception 2: Custom Event Package requests (200+ guests) go to PENDING_REVIEW.
  * No automatic rejections for normal bookings.
  * Payment is collected after the service (no online checkout/payment).
- Distance Rule: Travel distance is calculated from Boston Revere (84 Fernwood Ave). First 10 miles are free.
- Additional Vehicle Setup Fee: $200 per additional vehicle for same-time multi-vehicle events (package price is charged once, not multiplied).
- Weekend Event Fee: $25 for Saturday/Sunday bookings.
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
  
  const useGemini = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const useGroq = !!process.env.GROQ_API_KEY;

  let model: any;
  let providerUsed: "google" | "groq" = "groq";

  if (useGemini) {
    model = google("gemini-2.5-flash");
    providerUsed = "google";
  } else if (useGroq) {
    model = groq("llama-3.3-70b-versatile");
    providerUsed = "groq";
  } else {
    throw new Error("No AI API keys configured in environment.");
  }

  async function executeCall(selectedModel: any) {
    const step1 = await generateText({
      model: selectedModel,
      system: systemPrompt,
      messages: messages as any,
      tools,
    });

    const firstStep = step1.steps[0];

    if (firstStep && firstStep.finishReason === "tool-calls") {
      const generatedMessages = firstStep.response.messages;

      const toolResults = firstStep.content
        .filter((c: any) => c.type === "tool-result")
        .map((c: any) => ({
          toolName: c.toolName,
          result: c.output?.value ?? c.output ?? {}
        }));

      const dataContext = toolResults
        .map(tr => `[${tr.toolName} LIVE DATA]\n${JSON.stringify(tr.result, null, 2)}`)
        .join("\n\n");

      const step2System = `${systemPrompt}

IMPORTANT: You have just retrieved the following LIVE DATA from the Boston Legend database. 
Use ONLY this data to answer the user. Do NOT say you don't have access to data. 
Present the results in a clear, professional markdown format.

${dataContext}`;

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

      const step2 = await generateText({
        model: selectedModel,
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

    return {
      intent: "CONVERSATION",
      tool_calls: [],
      data: [],
      final_response: step1.text || "",
    };
  }

  try {
    try {
      return await executeCall(model);
    } catch (error: any) {
      console.warn(`[AI Orchestrator] Primary provider (${providerUsed}) failed, trying fallback:`, error.message || error);
      
      if (providerUsed === "google" && useGroq) {
        return await executeCall(groq("llama-3.3-70b-versatile"));
      } else if (providerUsed === "groq" && useGemini) {
        return await executeCall(google("gemini-2.5-flash"));
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error("[AI Orchestrator] Execution Error (all providers failed):", error);
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
