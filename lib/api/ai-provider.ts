import { generateText as openaiGenerateText } from "./openai";
import type { AIProvider, AIGenerationOptions } from "@/lib/types";

/**
 * Unified AI provider interface
 * Routes requests to the appropriate AI provider
 */
/**
 * Generate TEXT (workout/diet plans) using OpenAI/OpenRouter
 * Note: Gemini is used ONLY for image generation, not for text
 */
export async function generateWithAI(
  prompt: string,
  options?: AIGenerationOptions
): Promise<string> {
  // Always use OpenAI/OpenRouter for text generation (workout/diet plans)
  // Gemini is only used for image generation
  let provider = options?.provider || "openai";

  if (provider === "gemini") {
    throw new Error("Gemini is used only for image generation. Use OpenAI/OpenRouter for text generation (workout/diet plans).");
  }

  // Check if OpenAI/OpenRouter API key is available
  if (!process.env.AI_API_KEY && !process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY) {
    throw new Error(
      "No AI provider configured for text generation. Please set AI_API_KEY (OpenRouter) or OPENAI_API_KEY for workout/diet plans."
    );
  }

  switch (provider) {
    case "openai":
      return openaiGenerateText(prompt, options);
    
    case "claude":
      throw new Error("Claude provider not yet implemented. Use OpenAI/OpenRouter for now.");
    
    default:
      throw new Error(`Unknown AI provider: ${provider}. Use 'openai' for text generation.`);
  }
}

