import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/api/image-generator";
import type { ImageGenerationOptions } from "@/lib/types";

/**
 * API route for generating images using Gemini/Imagen
 */
export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationOptions = await request.json();

    if (!body.prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const imageUrl = await generateImage(body);

    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error: any) {
    console.error("Image generation error:", error);
    console.error("Error stack:", error.stack);

    const errorMessage = error.message || "Unknown error";
    
    if (errorMessage.includes("API key") || errorMessage.includes("GEMINI_API_KEY") || errorMessage.includes("GOOGLE_GEN_AI_API_KEY")) {
      return NextResponse.json(
        {
          error: "API key not configured",
          details: "Please set GEMINI_API_KEY or GOOGLE_GEN_AI_API_KEY in your .env.local file",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

