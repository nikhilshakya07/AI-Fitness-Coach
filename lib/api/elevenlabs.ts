import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

/**
 * ElevenLabs Text-to-Speech API client using official SDK
 * 
 * Note: ElevenLabs offers a free tier with limited characters per month
 * Alternative: You can use Web Speech API (browser-based, free) or 
 * OpenAI TTS (new, good quality, cheaper)
 */
export interface ElevenLabsOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  outputFormat?: string; // Let SDK handle the type
}

/**
 * Default voice IDs for ElevenLabs
 * Available voices: Rachel (JBFqnCBsd6RMkjVDRZzb), Adam, Antoni, Arnold, etc.
 * Note: Using voice ID from ElevenLabs documentation example
 * 
 * FREE TIER OPTIMIZATION:
 * - Using eleven_flash_v2_5 model (4 concurrent requests, 40,000 char limit)
 * - Better than multilingual_v2 for free tier (2 concurrent, 10,000 char limit)
 * - Ultra-low latency (~75ms) and 50% lower cost per character
 */
export const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // Default voice from ElevenLabs docs

/**
 * Generate speech audio using ElevenLabs official SDK
 */
export async function generateSpeech(options: ElevenLabsOptions): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY must be set in environment variables");
  }

  const voiceId = options.voiceId || DEFAULT_VOICE_ID;
  // Use eleven_flash_v2_5 for free tier - best balance: 4 concurrency, 40k chars, ultra-low latency
  // Alternatives: eleven_turbo_v2_5 (4 concurrency, 40k chars) or eleven_multilingual_v2 (2 concurrency, 10k chars)
  const modelId = options.modelId || "eleven_flash_v2_5";

  try {
    // Initialize the ElevenLabs client
    const elevenlabs = new ElevenLabsClient({
      apiKey: apiKey,
    });

    // Generate speech audio stream
    const requestOptions: any = {
      text: options.text,
      modelId: modelId,
      voiceSettings: {
        stability: options.stability ?? 0.5,
        similarityBoost: options.similarityBoost ?? 0.75,
      },
    };

    // Add outputFormat if provided (SDK will validate)
    if (options.outputFormat) {
      requestOptions.outputFormat = options.outputFormat;
    }

    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, requestOptions);

    // Convert the readable stream to Buffer
    const reader = audioStream.getReader();
    const chunks: Uint8Array[] = [];

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        if (value) {
          chunks.push(value);
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Combine all chunks into a single Buffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const buffer = Buffer.alloc(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }

    return buffer;
  } catch (error: any) {
    // Check if it's an authentication error (401) - API key issue
    if (error.status === 401 || error.message?.includes("Unauthorized") || error.message?.includes("Invalid API key")) {
      const errorMessage = "ElevenLabs API key is invalid or expired. Falling back to Web Speech API.";
      console.warn(errorMessage);
      throw new Error(errorMessage);
    }
    
    // Other errors (network, timeout, etc.)
    console.error("ElevenLabs API Error:", error.status || error.message);
    throw new Error(`Failed to generate speech: ${error.message || "Unknown error"}`);
  }
}

/**
 * Free Alternative: Web Speech API (Browser-based)
 * This can be used client-side without API keys
 */
export function useWebSpeechAPI(): {
  speak: (text: string) => void;
  stop: () => void;
} {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    throw new Error("Web Speech API is not available in this browser");
  }

  const synth = window.speechSynthesis;

  return {
    speak: (text: string) => {
      synth.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      synth.speak(utterance);
    },
    stop: () => {
      synth.cancel();
    },
  };
}

