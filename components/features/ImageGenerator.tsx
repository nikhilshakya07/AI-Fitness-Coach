"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";

interface ImageGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string;
  type: "exercise" | "meal";
}

export function ImageGenerator({
  open,
  onOpenChange,
  prompt,
  type,
}: ImageGeneratorProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate image when dialog opens and prompt changes
  useEffect(() => {
    if (!open || !prompt) {
      // Reset when dialog closes
      setImageUrl(null);
      setError(null);
      return;
    }

    const generateImage = async () => {
      setLoading(true);
      setError(null);
      setImageUrl(null);

      try {
        // Create enhanced prompt based on type
        let enhancedPrompt = "";
        if (type === "exercise") {
          enhancedPrompt = `A person performing ${prompt} exercise, fitness demonstration, gym setting, clear background, professional photography`;
        } else {
          enhancedPrompt = `${prompt} meal, healthy food, appetizing, professional food photography, clear background, high quality`;
        }

        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: enhancedPrompt,
            size: "1024x1024",
            style: "realistic",
          }),
        });

        if (!response.ok) {
          let errorMessage = "Failed to generate image";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.details || errorMessage;
            if (errorData.details) {
              errorMessage += `: ${errorData.details}`;
            }
          } catch (e) {
            // If response is not JSON, get text
            const text = await response.text();
            errorMessage = text || `Server returned ${response.status}`;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setImageUrl(data.imageUrl);
        setImageLoading(true); // Start loading the image itself
      } catch (err: any) {
        console.error("Image generation error:", err);
        setError(err.message || "Failed to generate image. Please try again.");
        setLoading(false);
      } finally {
        // Don't set loading to false here - wait for image to load
      }
    };

    generateImage();
  }, [open, prompt, type]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {type === "exercise" ? "Exercise" : "Meal"}: {prompt}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center min-h-[400px] bg-muted rounded-lg p-4 relative">
          {loading && !imageUrl && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm font-medium text-muted-foreground">
                Generating image...
              </p>
              <p className="text-xs text-muted-foreground/70">
                This may take a few seconds
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-3 p-6 max-w-md">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm text-center text-muted-foreground">
                {error}
              </p>
            </div>
          )}

          {imageUrl && !error && (
            <div className="w-full flex items-center justify-center relative">
              {imageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 bg-muted/80 rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Loading image...</p>
                </div>
              )}
              <img
                src={imageUrl}
                alt={`${prompt} ${type}`}
                className="w-full h-auto rounded-lg object-contain max-w-full max-h-[450px] shadow-lg transition-opacity duration-300"
                style={{ opacity: imageLoading ? 0.3 : 1 }}
                onLoad={() => {
                  console.log("Image loaded successfully");
                  setImageLoading(false);
                  setLoading(false);
                }}
                onError={() => {
                  setError("Failed to load image");
                  setImageUrl(null);
                  setLoading(false);
                  setImageLoading(false);
                }}
              />
            </div>
          )}

          {!loading && !imageLoading && !error && !imageUrl && (
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <ImageIcon className="h-12 w-12" />
              <p className="text-sm">Click to generate image</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

