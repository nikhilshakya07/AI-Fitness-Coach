import OpenAI from "openai";
import type { AIGenerationOptions } from "@/lib/types";

/**
 * OpenAI client configured for OpenRouter or direct OpenAI API
 * 
 * For OpenRouter usage:
 * - Set OPENROUTER_API_KEY in .env.local
 * - Use baseURL: "https://openrouter.ai/api/v1"
 * - Add header: "HTTP-Referer" (your site URL)
 * 
 * For direct OpenAI usage:
 * - Set OPENAI_API_KEY in .env.local
 * - Use default baseURL (OpenAI)
 */
export function getOpenAIClient() {
  // Support multiple environment variable names
  const apiKey = 
    process.env.AI_API_KEY ||           // User's preferred name
    process.env.OPENROUTER_API_KEY ||   // OpenRouter standard name
    process.env.OPENAI_API_KEY;         // Direct OpenAI name
  
  const isOpenRouter = !!(
    process.env.AI_API_KEY || 
    process.env.OPENROUTER_API_KEY
  );
  
  if (!apiKey) {
    throw new Error("AI_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY must be set");
  }

  const config: {
    apiKey: string;
    baseURL?: string;
    defaultHeaders?: Record<string, string>;
  } = {
    apiKey: apiKey,
  };

  // Configure for OpenRouter
  if (isOpenRouter) {
    config.baseURL = "https://openrouter.ai/api/v1";
    config.defaultHeaders = {
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "AI Fitness Coach",
    };
  }

  return new OpenAI(config);
}

/**
 * Generate text using OpenAI/OpenRouter
 */
export async function generateText(
  prompt: string,
  options?: AIGenerationOptions
): Promise<string> {
  const client = getOpenAIClient();
  
  // Use model from env or options, or default
  const model = 
    options?.model || 
    process.env.AI_MODEL ||              // User's preferred model
    (process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY
      ? "openai/gpt-3.5-turbo"           // Default free model on OpenRouter
      : "gpt-3.5-turbo");

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are an expert fitness coach and nutritionist. Provide detailed, accurate, and personalized advice.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate text. Please check your API key and try again.");
  }
}

