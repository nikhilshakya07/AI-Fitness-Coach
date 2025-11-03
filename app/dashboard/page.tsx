"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WorkoutPlanDisplay } from "@/components/plan/WorkoutPlan";
import { DietPlanDisplay } from "@/components/plan/DietPlan";
import { AITipsDisplay } from "@/components/plan/AITips";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, RefreshCw, AlertCircle, Dumbbell, UtensilsCrossed, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { FitnessPlan } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { savePlan } from "@/lib/storage/localStorage";
import { Save } from "lucide-react";
import { PlanHistory } from "@/components/features/PlanHistory";
import { PDFExporter } from "@/components/features/PDFExporter";

type TabType = "workout" | "diet" | "motivation";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("workout");

  useEffect(() => {
    // Get plan from sessionStorage (set by form submission)
    const storedPlan = sessionStorage.getItem("fitnessPlan");
    if (storedPlan) {
      try {
        const parsedPlan = JSON.parse(storedPlan);
        // Convert date strings back to Date objects
        parsedPlan.createdAt = new Date(parsedPlan.createdAt);
        setPlan(parsedPlan);
      } catch (e) {
        console.error("Error parsing plan:", e);
        setError("Failed to load plan. Please generate a new one.");
      }
    } else {
      setError("No plan found. Please generate a plan first.");
    }
    setLoading(false);
  }, []);

  const handleRegenerate = async () => {
    if (!plan) {
      router.push("/generate");
      return;
    }

    setRegenerating(true);
    try {
      // Use the existing profile to regenerate
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plan.profile),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to regenerate plan");
      }

      const newFitnessPlan = await response.json();
      
      // Store new plan in sessionStorage
      sessionStorage.setItem("fitnessPlan", JSON.stringify(newFitnessPlan));
      
      // Update state with new plan
      setPlan(newFitnessPlan);
      
      toast({
        title: "Success",
        description: "Your fitness plan has been regenerated!",
      });
    } catch (error: any) {
      console.error("Error regenerating plan:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate fitness plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your plan...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-2xl font-semibold">No Plan Found</h2>
            <p className="text-muted-foreground">{error || "Please generate a plan first."}</p>
            <Button onClick={() => router.push("/generate")}>
              Generate Plan
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Your Fitness Plan
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {plan.profile.name}! Here's your personalized plan.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <PlanHistory 
            onLoadPlan={(loadedPlan) => {
              // Store loaded plan in sessionStorage
              sessionStorage.setItem("fitnessPlan", JSON.stringify(loadedPlan));
              // Update state
              setPlan(loadedPlan);
              toast({
                title: "Plan loaded",
                description: `Loaded plan for ${loadedPlan.profile.name}`,
              });
            }}
          />
          <Button 
            onClick={() => {
              if (plan) {
                savePlan(plan);
                toast({
                  title: "Plan saved",
                  description: "Your fitness plan has been saved to your history.",
                });
              }
            }}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Plan
          </Button>
          {plan && <PDFExporter plan={plan} />}
          <Button 
            onClick={handleRegenerate} 
            variant="outline"
            disabled={regenerating}
          >
            {regenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-border">
        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={activeTab === "workout" ? "default" : "ghost"}
            onClick={() => setActiveTab("workout")}
            className="rounded-b-none flex items-center gap-2"
          >
            <Dumbbell className="h-4 w-4" />
            Workout Plan
          </Button>
          <Button
            variant={activeTab === "diet" ? "default" : "ghost"}
            onClick={() => setActiveTab("diet")}
            className="rounded-b-none flex items-center gap-2"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Diet Plan
          </Button>
          <Button
            variant={activeTab === "motivation" ? "default" : "ghost"}
            onClick={() => setActiveTab("motivation")}
            className="rounded-b-none flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            Motivation & Tips
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "workout" && (
            <motion.div
              key="workout"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <WorkoutPlanDisplay plan={plan.workoutPlan} />
            </motion.div>
          )}
          
          {activeTab === "diet" && (
            <motion.div
              key="diet"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DietPlanDisplay plan={plan.dietPlan} />
            </motion.div>
          )}
          
          {activeTab === "motivation" && (
            <motion.div
              key="motivation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <AITipsDisplay tips={plan.aiTips} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

