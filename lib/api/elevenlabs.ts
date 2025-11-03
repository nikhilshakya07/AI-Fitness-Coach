import axios from "axios";

/**
 * ElevenLabs Text-to-Speech API client
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
}

/**
 * Generate speech audio using ElevenLabs
 */
export async function generateSpeech(options: ElevenLabsOptions): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY must be set in environment variables");
  }

  const voiceId = options.voiceId || "21m00Tcm4TlvDq8ikWAM"; // Default: Rachel
  const modelId = options.modelId || "eleven_monolingual_v1";

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: options.text,
        model_id: modelId,
        voice_settings: {
          stability: options.stability ?? 0.5,
          similarity_boost: options.similarityBoost ?? 0.75,
        },
      },
      {
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        responseType: "arraybuffer",
      }
    );

    return Buffer.from(response.data);
  } catch (error) {
    console.error("ElevenLabs API Error:", error);
    throw new Error("Failed to generate speech. Please check your API key and try again.");
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

