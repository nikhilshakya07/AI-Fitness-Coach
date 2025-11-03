"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AITips as AITipsType } from "@/lib/types";
import { Brain, Heart, Lightbulb, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { SimpleVoicePlayer } from "@/components/features/SimpleVoicePlayer";
import { formatAITipsText } from "@/lib/utils/text-formatters";

interface AITipsProps {
  tips: AITipsType;
}

export function AITipsDisplay({ tips }: AITipsProps) {
  const hasData = 
    (tips.lifestyleTips && tips.lifestyleTips.length > 0) ||
    (tips.postureTips && tips.postureTips.length > 0) ||
    (tips.motivationalQuotes && tips.motivationalQuotes.length > 0);

  if (!hasData) {
    return (
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">AI Tips & Motivation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No tips generated yet. Please regenerate your plan.
          </p>
        </CardContent>
      </Card>
    );
  }

  const fullTipsText = formatAITipsText(tips);

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">AI Tips & Motivation</CardTitle>
          </div>
          <SimpleVoicePlayer text={fullTipsText} label="Read All" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lifestyle Tips */}
        {tips.lifestyleTips && tips.lifestyleTips.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Lifestyle Tips
            </h3>
            <ul className="space-y-2">
              {tips.lifestyleTips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="p-3 rounded-md bg-muted text-sm"
                >
                  {tip}
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Posture Tips */}
        {tips.postureTips && tips.postureTips.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              Posture & Form Tips
            </h3>
            <ul className="space-y-2">
              {tips.postureTips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="p-3 rounded-md bg-muted text-sm"
                >
                  {tip}
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {/* Motivational Quotes */}
        {tips.motivationalQuotes && tips.motivationalQuotes.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Quote className="h-4 w-4 text-primary" />
              Motivational Quotes
            </h3>
            <div className="space-y-2">
              {tips.motivationalQuotes.map((quote, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.15 }}
                  className="p-4 rounded-lg bg-primary/5 border border-primary/20 italic text-sm"
                >
                  "{quote}"
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

