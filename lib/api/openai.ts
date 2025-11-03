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

  // Retry logic for failed requests
  const maxRetries = 2;
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retrying API call (attempt ${attempt + 1}/${maxRetries + 1})...`);
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }

      const response = await client.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "You are an expert fitness coach and nutritionist. Provide detailed, accurate, and personalized advice. Always return valid JSON only, no additional text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 3000, // Adjusted for free models
      });

      const content = response.choices[0]?.message?.content || "";
      
      if (!content || content.trim().length === 0) {
        console.error("Empty response from API. Model:", model);
        console.error("Response object:", JSON.stringify(response, null, 2));
        
        if (attempt < maxRetries) {
          lastError = new Error("API returned empty response. Retrying...");
          continue; // Retry
        }
        
        throw new Error("API returned empty response after retries. Check your API key and model configuration.");
      }

      return content;
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on certain errors (authentication, etc.)
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error("Authentication error - not retrying");
        throw new Error("API authentication failed. Please check your API key.");
      }

      if (attempt < maxRetries) {
        console.error(`API call failed (attempt ${attempt + 1}), will retry...`, error.message);
        continue; // Retry
      }
    }
  }

  // If we get here, all retries failed
  console.error("OpenAI API Error after all retries:", lastError);
  console.error("Error details:", lastError?.response?.data || lastError?.message);
  throw new Error(`Failed to generate text after ${maxRetries + 1} attempts: ${lastError?.message || "Please check your API key and try again."}`);
}

