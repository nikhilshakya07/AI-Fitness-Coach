import { NextRequest, NextResponse } from "next/server";
import { generateSpeech } from "@/lib/api/elevenlabs";
import type { ElevenLabsOptions } from "@/lib/api/elevenlabs";

/**
 * API route for text-to-speech using ElevenLabs
 * Falls back to Web Speech API if ElevenLabs fails
 */
export async function POST(request: NextRequest) {
  try {
    const body: ElevenLabsOptions = await request.json();

    if (!body.text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    try {
      const audioBuffer = await generateSpeech(body);

      // Return audio as base64 for client-side playback
      const base64Audio = audioBuffer.toString("base64");

      return NextResponse.json(
        { audioData: base64Audio, mimeType: "audio/mpeg" },
        { status: 200 }
      );
    } catch (speechError: any) {
      // If ElevenLabs fails (especially 401/invalid key), silently fallback to Web Speech API
      // Don't log as error since we have a working fallback
      const isAuthError = 
        speechError.message?.includes("invalid") || 
        speechError.message?.includes("expired") ||
        speechError.message?.includes("API key") ||
        speechError.message?.includes("401") ||
        speechError.message?.includes("Unauthorized");
      
      if (isAuthError) {
        // API key issue - this is expected, fallback will work silently
        return NextResponse.json(
          {
            error: "ElevenLabs API key issue. Using Web Speech API fallback.",
            fallback: true,
          },
          { status: 200 } // Return 200 so client can handle fallback
        );
      }
      
      // Other errors - log as warning but still provide fallback
      console.warn("ElevenLabs generation failed, using fallback:", speechError.message);
      return NextResponse.json(
        {
          error: "ElevenLabs API failed. Using Web Speech API fallback.",
          fallback: true,
        },
        { status: 200 } // Return 200 so client can handle fallback
      );
    }
  } catch (error: any) {
    console.error("Voice generation error:", error);

    if (error.message?.includes("API key")) {
      return NextResponse.json(
        {
          error: "ELEVENLABS_API_KEY not configured. Using Web Speech API fallback.",
          details: error.message,
        },
        { status: 200 } // Return 200 but with fallback message
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate voice",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

