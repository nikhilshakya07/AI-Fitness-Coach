"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, VolumeX, Loader2, Play, Pause, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { VoiceSection } from "@/lib/types";

interface VoicePlayerProps {
  workoutText?: string;
  dietText?: string;
  tipsText?: string;
  className?: string;
}

export function VoicePlayer({ workoutText = "", dietText = "", tipsText = "", className = "" }: VoicePlayerProps) {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<VoiceSection>("all");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const getTextForSection = (section: VoiceSection): string => {
    switch (section) {
      case "workout":
        return workoutText || "";
      case "diet":
        return dietText || "";
      case "tips":
        return tipsText || "";
      case "all":
        return [workoutText, dietText, tipsText].filter(Boolean).join("\n\n") || "";
      default:
        return "";
    }
  };

  const generateAudio = async () => {
    const text = getTextForSection(currentSection);
    
    if (!text || text.trim().length === 0) {
      toast({
        title: "No content",
        description: `No ${currentSection === "all" ? "content" : currentSection} available to read.`,
        variant: "destructive",
      });
      return;
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate voice");
      }

      const data = await response.json();
      
      if (data.error || data.fallback) {
        // Fallback to Web Speech API
        setIsLoading(false);
        useWebSpeechAPI(text);
        return;
      }

      // Convert base64 to blob
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
      
      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        toast({
          title: "Playback error",
          description: "Failed to play audio. Try again.",
          variant: "destructive",
        });
      };
      
      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Voice generation error:", error);
      setIsLoading(false);
      
      // Fallback to Web Speech API
      useWebSpeechAPI(text);
    }
  };

  const useWebSpeechAPI = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast({
        title: "Not supported",
        description: "Text-to-speech is not available in this browser.",
        variant: "destructive",
      });
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel(); // Cancel any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
      toast({
        title: "Speech error",
        description: "Failed to read text. Please try again.",
        variant: "destructive",
      });
    };
    
    synth.speak(utterance);
  };

  const handlePlay = async () => {
    if (isPlaying) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Stop Web Speech API
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          setIsPlaying(false);
        }
      }
    } else {
      // Play
      if (audioUrl && audioRef.current) {
        // Resume existing audio
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        // Generate new audio
        await generateAudio();
      }
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
    
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    
    // Cleanup
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    audioRef.current = null;
  };

  const hasContent = workoutText || dietText || tipsText;

  if (!hasContent) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Select value={currentSection} onValueChange={(value) => {
        setCurrentSection(value as VoiceSection);
        handleStop(); // Stop current playback when switching sections
      }}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select section" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sections</SelectItem>
          {workoutText && <SelectItem value="workout">Workout</SelectItem>}
          {dietText && <SelectItem value="diet">Diet</SelectItem>}
          {tipsText && <SelectItem value="tips">Tips</SelectItem>}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Button
          onClick={handlePlay}
          disabled={isLoading || !getTextForSection(currentSection)}
          size="sm"
          variant="outline"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : isPlaying ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Play
            </>
          )}
        </Button>

        <Button
          onClick={handleStop}
          disabled={!isPlaying && !isLoading}
          size="sm"
          variant="outline"
        >
          <Square className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

