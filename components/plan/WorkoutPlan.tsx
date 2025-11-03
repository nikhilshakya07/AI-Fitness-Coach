"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { WorkoutPlan } from "@/lib/types";
import { Dumbbell, Clock, Repeat, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { SimpleVoicePlayer } from "@/components/features/SimpleVoicePlayer";
import { ImageGenerator } from "@/components/features/ImageGenerator";
import { formatWorkoutPlanText } from "@/lib/utils/text-formatters";
import { formatDayWorkoutText } from "@/lib/utils/workout-formatters";

interface WorkoutPlanProps {
  plan: WorkoutPlan;
}

export function WorkoutPlanDisplay({ plan }: WorkoutPlanProps) {
  const [selectedExercise, setSelectedExercise] = useState<{
    name: string;
    open: boolean;
  }>({ name: "", open: false });

  const hasData = plan.dailyRoutines && plan.dailyRoutines.length > 0;

  if (!hasData) {
    return (
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Workout Plan</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No workout plan generated yet. Please regenerate your plan.
          </p>
        </CardContent>
      </Card>
    );
  }

  const fullWorkoutText = formatWorkoutPlanText(plan);

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Workout Plan</CardTitle>
          </div>
          <SimpleVoicePlayer text={fullWorkoutText} label="Read All" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {plan.weeklyOverview && (
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">{plan.weeklyOverview}</p>
          </div>
        )}

        <div className="space-y-4">
          {plan.dailyRoutines.map((routine, index) => {
            const dayText = formatDayWorkoutText(plan, index);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 rounded-lg border-2 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{routine.day}</h3>
                  <SimpleVoicePlayer text={dayText} label={routine.day} />
                </div>
              <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {routine.duration} min
                </div>
                <div className="flex items-center gap-1">
                  <span className="capitalize">{routine.difficulty}</span>
                </div>
              </div>

              <div className="space-y-3">
                {routine.exercises && routine.exercises.length > 0 ? (
                  routine.exercises.map((exercise, exIndex) => (
                    exercise && (
                      <motion.div
                        key={exIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: exIndex * 0.05 }}
                        className="p-3 rounded-md bg-card border border-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            <h4 className="font-medium">
                              {exercise.name || "Exercise"}
                            </h4>
                            {exercise.name && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedExercise({ name: exercise.name, open: true })
                                }
                                className="h-7 px-2"
                              >
                                <ImageIcon className="h-3 w-3 mr-1" />
                                Image
                              </Button>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {exercise.sets && exercise.reps && (
                              <span className="flex items-center gap-1">
                                <Repeat className="h-3 w-3" />
                                {exercise.sets} × {exercise.reps}
                              </span>
                            )}
                            {exercise.restTime && (
                              <span className="text-xs">Rest: {exercise.restTime}s</span>
                            )}
                          </div>
                        </div>
                        {exercise.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {exercise.description}
                          </p>
                        )}
                      </motion.div>
                    )
                  )).filter(Boolean)
                ) : (
                  <p className="text-sm text-muted-foreground">No exercises for this day.</p>
                )}
              </div>
            </motion.div>
            );
          })}
        </div>

        {plan.tips && plan.tips.length > 0 && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold mb-2">Tips</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {plan.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <ImageGenerator
        open={selectedExercise.open}
        onOpenChange={(open) =>
          setSelectedExercise({ name: selectedExercise.name, open })
        }
        prompt={selectedExercise.name}
        type="exercise"
      />
    </Card>
  );
}

