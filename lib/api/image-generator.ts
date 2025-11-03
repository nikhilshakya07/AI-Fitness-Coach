import type { ImageGenerationOptions } from "@/lib/types";

/**
 * Image Generation using FreePik Gemini 2.5 Flash API
 * Uses FreePik's API for image generation
 */
export async function generateImage(
  options: ImageGenerationOptions
): Promise<string> {
  // Support FREEPIK_API_KEY and GOOGLE_GEN_AI_API_KEY (for backwards compatibility)
  const apiKey = process.env.FREEPIK_API_KEY || process.env.GOOGLE_GEN_AI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "FREEPIK_API_KEY or GOOGLE_GEN_AI_API_KEY must be set for image generation"
    );
  }

  try {
    console.log("Starting image generation with FreePik API");
    console.log("Prompt:", options.prompt.substring(0, 50) + "...");
    console.log("API Key present:", !!apiKey);

    // Call FreePik API
    const response = await fetch(
      "https://api.freepik.com/v1/ai/gemini-2-5-flash-image-preview",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-freepik-api-key": apiKey,
        },
        body: JSON.stringify({
          prompt: options.prompt,
          // reference_images is optional, not needed for text-to-image
        }),
      }
    );

    if (!response.ok) {
      // Read response body only once
      const errorText = await response.text();
      let errorMessage = `FreePik API error (${response.status}): ${errorText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        // Extract specific error message if available
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        // If it's not JSON, use the text as-is
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("FreePik API response:", JSON.stringify(data, null, 2));

    // Handle FreePik API response structure
    // Response format: { data: { generated: [urls], task_id: "...", status: "..." } }
    if (!data.data) {
      throw new Error("Invalid response from FreePik API: missing data field");
    }

    const responseData = data.data;

    // Check if images are already generated
    if (responseData.generated && responseData.generated.length > 0) {
      // Images are ready, return the first one
      const imageUrl = responseData.generated[0];
      console.log("Image generated successfully:", imageUrl);
      return imageUrl;
    }

    // If status is CREATED, it means the task is processing
    // We need to poll for completion
    if (responseData.status === "CREATED" || responseData.status === "PROCESSING") {
      const taskId = responseData.task_id;
      if (!taskId) {
        throw new Error("Task ID not found in response");
      }

      console.log("Task created, polling for completion. Task ID:", taskId);
      
      // Poll for image completion (max 30 seconds, check every 2 seconds)
      const maxAttempts = 15;
      const pollInterval = 2000; // 2 seconds
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
        const statusResponse = await fetch(
          `https://api.freepik.com/v1/ai/gemini-2-5-flash-image-preview/${taskId}`,
          {
            method: "GET",
            headers: {
              "x-freepik-api-key": apiKey,
            },
          }
        );

        if (!statusResponse.ok) {
          throw new Error(`Failed to check task status: ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        
        if (statusData.data?.generated && statusData.data.generated.length > 0) {
          const imageUrl = statusData.data.generated[0];
          console.log("Image ready:", imageUrl);
          return imageUrl;
        }

        if (statusData.data?.status === "FAILED" || statusData.data?.status === "ERROR") {
          throw new Error("Image generation task failed");
        }

        console.log(`Polling attempt ${attempt + 1}/${maxAttempts}, status: ${statusData.data?.status}`);
      }

      throw new Error("Image generation timed out. Please try again.");
    }

    throw new Error(`Unexpected status: ${responseData.status}`);
  } catch (error: any) {
    console.error("Image Generation Error:", error);
    console.error("Full error object:", JSON.stringify(error, null, 2));
    
    // Extract actual error message from API response if available
    let errorMessage = error.message || "Failed to generate image";
    
    // Check for API response errors (from REST API fallback)
    if (error.response?.data || error.response?.error) {
      const apiError = error.response.data || error.response.error;
      if (apiError?.error?.message) {
        errorMessage = apiError.error.message;
      } else if (apiError?.message) {
        errorMessage = apiError.message;
      }
    }
    
    // Provide more helpful error messages
    if (errorMessage.includes("API key") || errorMessage.includes("authentication") || errorMessage.includes("unauthorized") || errorMessage.includes("401")) {
      throw new Error(
        "Invalid API key. Please check your FREEPIK_API_KEY in .env.local"
      );
    }
    
    if (errorMessage.includes("quota") || errorMessage.includes("limit") || errorMessage.includes("429") || errorMessage.includes("rate")) {
      throw new Error(
        `API quota/rate limit exceeded: ${errorMessage}. Please check your FreePik API usage limits.`
      );
    }
    
    if (errorMessage.includes("403") || errorMessage.includes("permission") || errorMessage.includes("forbidden")) {
      throw new Error(
        "API access denied. Please check your FreePik API key permissions."
      );
    }

    // Return the actual error message for debugging
    throw new Error(
      errorMessage || "Failed to generate image. Please try again."
    );
  }
}

