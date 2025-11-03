"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { History, Trash2, Calendar, User, Loader2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSavedPlans, deletePlan } from "@/lib/storage/localStorage";
import type { FitnessPlan } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface PlanHistoryProps {
  onLoadPlan?: (plan: FitnessPlan) => void;
}

export function PlanHistory({ onLoadPlan }: PlanHistoryProps) {
  const { toast } = useToast();
  const [plans, setPlans] = useState<FitnessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const loadPlans = () => {
    setLoading(true);
    try {
      const savedPlans = getSavedPlans();
      // Sort by creation date, newest first
      savedPlans.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPlans(savedPlans);
    } catch (error) {
      console.error("Error loading plans:", error);
      toast({
        title: "Error",
        description: "Failed to load saved plans.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadPlans();
    }
  }, [open]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      try {
        deletePlan(id);
        setPlans(plans.filter((p) => p.id !== id));
        toast({
          title: "Plan deleted",
          description: "The plan has been removed from your history.",
        });
      } catch (error) {
        console.error("Error deleting plan:", error);
        toast({
          title: "Error",
          description: "Failed to delete plan.",
          variant: "destructive",
        });
      }
    }
  };

  const handleLoadPlan = (plan: FitnessPlan) => {
    if (onLoadPlan) {
      onLoadPlan(plan);
      setOpen(false);
      toast({
        title: "Plan loaded",
        description: `Loaded plan for ${plan.profile.name}`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Plan History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Saved Plans History
          </DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No saved plans yet. Generate and save a plan to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-primary" />
                            <CardTitle className="text-lg">
                              {plan.profile.name}
                            </CardTitle>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {format(new Date(plan.createdAt), "MMM d, yyyy")}
                              </span>
                            </div>
                            {plan.updatedAt && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs">
                                  Updated: {format(new Date(plan.updatedAt), "MMM d, yyyy")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {onLoadPlan && (
                            <Button
                              size="sm"
                              onClick={() => handleLoadPlan(plan)}
                              className="flex items-center gap-1"
                            >
                              Load
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(plan.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Goal</p>
                          <p className="font-medium capitalize">
                            {plan.profile.fitnessGoal.replace("_", " ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Level</p>
                          <p className="font-medium capitalize">
                            {plan.profile.fitnessLevel}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Location</p>
                          <p className="font-medium capitalize">
                            {plan.profile.workoutLocation}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Diet</p>
                          <p className="font-medium capitalize">
                            {plan.profile.dietaryPreference.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            Workout: {plan.workoutPlan.dailyRoutines.length} days
                          </div>
                          <div>
                            Diet: {plan.dietPlan.mealOptions 
                              ? "Meal options available"
                              : plan.dietPlan.dailyMeals 
                              ? `${plan.dietPlan.dailyMeals.length} days`
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

