import axios from "axios";
import type { ImageGenerationOptions } from "@/lib/types";

/**
 * Gemini Imagen API for image generation
 * Uses Google's Imagen model via Gemini API
 */
export async function generateImage(
  options: ImageGenerationOptions
): Promise<string> {
  const apiKey = process.env.GOOGLE_GEN_AI_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_GEN_AI_API_KEY must be set for image generation");
  }

  // Map size to Imagen supported sizes
  const sizeMap: Record<string, string> = {
    "256x256": "256x256",
    "512x512": "512x512",
    "1024x1024": "1024x1024",
  };
  
  const imageSize = sizeMap[options.size || "1024x1024"] || "1024x1024";

  try {
    // Use Gemini's Imagen model for image generation
    // Note: The exact endpoint may vary - this uses the Imagen API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict`,
      {
        instances: [
          {
            prompt: options.prompt,
          },
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1", // Square images
          outputOptions: {
            mimeType: "image/png",
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
      }
    );

    // Extract image data URL or URL from response
    const imageData = response.data?.predictions?.[0]?.bytesBase64Encoded;
    
    if (imageData) {
      // Return as data URL
      return `data:image/png;base64,${imageData}`;
    }

    // Alternative: Check for URL
    const imageUrl = response.data?.predictions?.[0]?.imageUrl;
    if (imageUrl) {
      return imageUrl;
    }

    throw new Error("No image data returned from Gemini Imagen API");
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    
    // Try alternative Imagen endpoint format
    try {
      // Alternative endpoint format
      const altResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3:generateImages`,
        {
          prompt: options.prompt,
          number: 1,
          aspectRatio: "1:1",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
          },
        }
      );

      const imageUrl = altResponse.data?.generatedImages?.[0]?.imageUrl;
      if (imageUrl) {
        return imageUrl;
      }
    } catch (altError) {
      // Fall through to error
    }

    throw new Error(
      `Failed to generate image with Gemini: ${error.response?.data?.error?.message || error.message}`
    );
  }
}

