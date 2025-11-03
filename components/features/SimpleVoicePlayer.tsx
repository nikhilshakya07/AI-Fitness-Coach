"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Loader2, Play, Pause, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SimpleVoicePlayerProps {
  text: string;
  label?: string;
  className?: string;
}

export function SimpleVoicePlayer({ text, label = "Read", className = "" }: SimpleVoicePlayerProps) {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cleanup on unmount or when text changes
  useEffect(() => {
    return () => {
      // Stop any ongoing playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      speechSynthesisRef.current = null;
      
      // Cleanup audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl, text]); // Re-run when text changes to stop old playback

  const generateAudio = async () => {
    if (!text || text.trim().length === 0) {
      toast({
        title: "No content",
        description: "No content available to read.",
        variant: "destructive",
      });
      return;
    }

    // Stop any ongoing playback before starting new one
    if (isPlaying) {
      // Stop current playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      speechSynthesisRef.current = null;
      // Small delay for cleanup
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate voice");
      }

      const data = await response.json();
      
      // If error or fallback, use Web Speech API
      if (data.error || data.fallback || !data.audioData) {
        setIsLoading(false);
        useWebSpeechAPI(text);
        return;
      }

      // Convert base64 to blob
      try {
        const audioData = atob(data.audioData);
        const audioArray = new Uint8Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
          audioArray[i] = audioData.charCodeAt(i);
        }
        
        const blob = new Blob([audioArray], { type: data.mimeType || "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        
        // Cleanup old URL
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        
        setAudioUrl(url);
        
        // Create and play audio
        const audio = new Audio(url);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsPlaying(false);
        };
        
        audio.onpause = () => {
          setIsPlaying(false);
        };
        
        audio.onplay = () => {
          setIsPlaying(true);
        };
        
        audio.onerror = (e) => {
          // Only handle real errors, not user interruptions
          const error = audio.error;
          if (error && error.code !== 0 && error.code !== MediaError.MEDIA_ERR_ABORTED) {
            console.error("Audio playback error:", error.code, error.message);
            setIsPlaying(false);
            setIsLoading(false);
            // Fallback to Web Speech API only for actual errors
            if (error.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED || 
                error.code === MediaError.MEDIA_ERR_DECODE || 
                error.code === MediaError.MEDIA_ERR_NETWORK) {
              useWebSpeechAPI(text);
            }
          } else {
            // User aborted or no error - just update state
            setIsPlaying(false);
            setIsLoading(false);
          }
        };
        
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (decodeError) {
        console.error("Audio decode error:", decodeError);
        setIsLoading(false);
        // Fallback to Web Speech API
        useWebSpeechAPI(text);
      }
    } catch (error: any) {
      console.error("Voice generation error:", error);
      setIsLoading(false);
      // Fallback to Web Speech API
      useWebSpeechAPI(text);
    }
  };

  const useWebSpeechAPI = (textToSpeak: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not available in this browser.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const synth = window.speechSynthesis;
    
    // Always cancel any ongoing speech before starting new one
    synth.cancel();
    
    // Reset reference
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current = null;
    }
    
    // Create utterance immediately (no delay needed)
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    speechSynthesisRef.current = utterance;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      speechSynthesisRef.current = null;
    };
    
    utterance.onerror = (e) => {
      // Get error type - may be undefined or empty object
      const errorType = e.error;
      
      // Ignore empty errors, user interruptions, and canceled operations
      const isUserAction = 
        errorType === "interrupted" || 
        errorType === "canceled" ||
        errorType === "audio-busy" ||
        !errorType || // Empty/undefined error
        (typeof errorType === "object" && Object.keys(errorType || {}).length === 0); // Empty object
      
      // Only log real errors (not empty objects or user actions)
      if (!isUserAction && errorType && typeof errorType === "string") {
        console.error("Speech error:", errorType);
        
        // Only show toast for actual synthesis/network errors
        if (errorType !== "synthesis-failed" && errorType !== "not-allowed") {
          toast({
            title: "Speech error",
            description: "Failed to read text. Please try again.",
            variant: "destructive",
          });
        }
      }
      
      // Always update state (even for user actions)
      setIsPlaying(false);
      setIsLoading(false);
      speechSynthesisRef.current = null;
    };
    
    utterance.onpause = () => {
      setIsPlaying(false);
    };
    
    utterance.onresume = () => {
      setIsPlaying(true);
    };
    
    synth.speak(utterance);
  };

  const handlePlay = async () => {
    if (isPlaying) {
      // Pause
      try {
        if (audioRef.current && !audioRef.current.paused) {
          // Pause audio
          audioRef.current.pause();
          setIsPlaying(false);
        } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
          // Pause Web Speech API
          const synth = window.speechSynthesis;
          if (synth.speaking && !synth.paused) {
            try {
              synth.pause();
              setIsPlaying(false);
            } catch (pauseError) {
              // Pause might fail if already paused, ignore
              setIsPlaying(false);
            }
          } else {
            setIsPlaying(false);
          }
        }
      } catch (error) {
        // Silently handle pause errors
        setIsPlaying(false);
      }
    } else {
      // Play/Resume
      try {
        // First check if we have audio element to resume
        if (audioUrl && audioRef.current) {
          if (audioRef.current.paused) {
            // Resume existing audio
            await audioRef.current.play();
            setIsPlaying(true);
            return;
          }
        }
        
        // Check Web Speech API
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const synth = window.speechSynthesis;
          if (synth.paused && speechSynthesisRef.current) {
            // Resume Web Speech API
            try {
              synth.resume();
              setIsPlaying(true);
              return;
            } catch (resumeError) {
              // Resume failed, might need to restart
              console.log("Resume failed, generating new audio");
            }
          }
        }
        
        // Generate new audio (no existing audio to resume)
        await generateAudio();
      } catch (error) {
        console.error("Error playing:", error);
        setIsLoading(false);
        setIsPlaying(false);
      }
    }
  };

  const handleStop = () => {
    try {
      // Stop audio playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      // Stop Web Speech API
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const synth = window.speechSynthesis;
        // Use cancel() to stop, which won't trigger error events
        synth.cancel();
      }
      
      // Reset state
      setIsPlaying(false);
      setIsLoading(false);
      speechSynthesisRef.current = null;
      
      // Cleanup audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      audioRef.current = null;
    } catch (error) {
      // Silently handle stop errors
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  if (!text || text.trim().length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={handlePlay}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="hidden sm:inline">Generating...</span>
          </>
        ) : isPlaying ? (
          <>
            <Pause className="h-4 w-4" />
            <span className="hidden sm:inline">Pause</span>
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </>
        )}
      </Button>

      {isPlaying && (
        <Button
          onClick={handleStop}
          size="sm"
          variant="outline"
        >
          <Square className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

