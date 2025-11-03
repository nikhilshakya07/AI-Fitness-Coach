import { NextRequest, NextResponse } from "next/server";
import { generateWithAI } from "@/lib/api/ai-provider";
import { createQuotePrompt } from "@/lib/prompts/quote-prompt";
import { parseAIResponse } from "@/lib/utils/json-parser";
import type { MotivationQuote } from "@/lib/types";

/**
 * API route for generating daily motivation quotes
 */
export async function GET(request: NextRequest) {
  try {
    const response = await generateWithAI(createQuotePrompt());

    const quote = parseAIResponse<MotivationQuote>(
      response,
      {
        quote: "Your body can do it. It's your mind you need to convince.",
        author: "Unknown",
        category: "motivation",
        date: new Date(),
      } as MotivationQuote
    );

    // Ensure date is set
    if (!quote.date) {
      quote.date = new Date();
    }

    return NextResponse.json(quote, { status: 200 });
  } catch (error: any) {
    console.error("Quote generation error:", error);

    // Return fallback quote on error
    const fallbackQuote: MotivationQuote = {
      quote: "Every workout counts. Every meal matters. Every day is a new opportunity.",
      author: "AI Fitness Coach",
      category: "motivation",
      date: new Date(),
    };

    return NextResponse.json(fallbackQuote, { status: 200 });
  }
}

