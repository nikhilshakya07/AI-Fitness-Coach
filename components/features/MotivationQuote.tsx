"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, RefreshCw, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { MotivationQuote } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { SimpleVoicePlayer } from "@/components/features/SimpleVoicePlayer";

const QUOTE_STORAGE_KEY = "daily-motivation-quote";
const QUOTE_DATE_KEY = "quote-date";

/**
 * Get cached quote if it's from today
 */
function getCachedQuote(): MotivationQuote | null {
  if (typeof window === "undefined") return null;

  try {
    const cachedDate = localStorage.getItem(QUOTE_DATE_KEY);
    const today = new Date().toDateString();

    if (cachedDate === today) {
      const cachedQuote = localStorage.getItem(QUOTE_STORAGE_KEY);
      if (cachedQuote) {
        const quote = JSON.parse(cachedQuote) as MotivationQuote;
        return {
          ...quote,
          date: new Date(quote.date),
        };
      }
    }
  } catch (error) {
    console.error("Error reading cached quote:", error);
  }

  return null;
}

/**
 * Cache quote for today
 */
function cacheQuote(quote: MotivationQuote): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(quote));
    localStorage.setItem(QUOTE_DATE_KEY, new Date().toDateString());
  } catch (error) {
    console.error("Error caching quote:", error);
  }
}

export function MotivationQuote() {
  const { toast } = useToast();
  const [quote, setQuote] = useState<MotivationQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQuote = async (skipCache = false) => {
    // Check cache first unless explicitly skipping
    if (!skipCache) {
      const cachedQuote = getCachedQuote();
      if (cachedQuote) {
        setQuote(cachedQuote);
        setLoading(false);
        return;
      }
    }

    setRefreshing(true);
    try {
      const response = await fetch("/api/motivation-quote");
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }

      const data = await response.json();
      const quoteData: MotivationQuote = {
        ...data,
        date: new Date(data.date || new Date()),
      };

      setQuote(quoteData);
      cacheQuote(quoteData);

      if (skipCache) {
        toast({
          title: "Quote refreshed",
          description: "New motivation quote loaded!",
        });
      }
    } catch (error: any) {
      console.error("Error fetching quote:", error);
      toast({
        title: "Error",
        description: "Failed to load motivation quote. Please try again.",
        variant: "destructive",
      });
      
      // Set fallback quote
      setQuote({
        quote: "Every workout counts. Every meal matters. Every day is a new opportunity.",
        author: "AI Fitness Coach",
        category: "motivation",
        date: new Date(),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleRefresh = () => {
    fetchQuote(true);
  };

  if (loading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Daily Motivation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quote) {
    return (
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Daily Motivation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Unable to load motivation quote.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Daily Motivation</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <SimpleVoicePlayer text={quote.quote} label="Listen" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="relative p-6 rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/30" />
            <p className="text-lg font-medium italic text-center pl-8 pr-4">
              "{quote.quote}"
            </p>
            {quote.author && (
              <p className="text-sm text-muted-foreground text-right mt-4 pr-4">
                — {quote.author}
              </p>
            )}
          </div>
          
          {quote.category && (
            <div className="flex items-center justify-center">
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary capitalize">
                {quote.category}
              </span>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
}

