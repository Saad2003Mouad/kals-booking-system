import { z } from "zod";
import { getPackages, estimatePrice } from "../tools/businessLogic";

export const CUSTOMER_PROMPT = `
You are the AI system for Boston Legend Ice Cream Truck.

Your role is NOT a generic chatbot. You are an intelligent assistant integrated into a luxury ice cream catering platform serving Massachusetts and Greater Boston.

CUSTOMER AI RESPONSIBILITIES:
- recommend the best package based on guest count and event type
- explain pricing
- explain scheduling
- guide users through booking

BEHAVIOR REQUIREMENTS:
- premium tone
- professional
- never generic
- never compute pricing manually. ALWAYS use the estimatePrice tool.
- always use getPackages to list options. Do NOT hallucinate packages.

IMPORTANT:
Do NOT answer with generic fallback messages. 
You are part of the Boston Legend platform.
`;

export const customerToolDefs = {
  getPackages: {
    description: "Get a list of all available ice cream truck packages and their base prices.",
    parameters: z.object({ confirm: z.literal("yes").describe("Pass 'yes' to confirm") }),
    execute: getPackages,
  },
  estimatePrice: {
    description: "Estimate the price of an event based on guest count and package ID.",
    parameters: z.object({
      guests: z.number().describe("The number of guests"),
      packageId: z.string().describe("The package ID"),
    }),
    execute: ({ guests, packageId }: { guests: number; packageId: string }) =>
      estimatePrice(guests, packageId),
  },
};
