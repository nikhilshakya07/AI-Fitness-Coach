"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DietPlan } from "@/lib/types";
import { UtensilsCrossed, Apple, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { SimpleVoicePlayer } from "@/components/features/SimpleVoicePlayer";
import { ImageGenerator } from "@/components/features/ImageGenerator";
import { formatDietPlanText } from "@/lib/utils/text-formatters";
import { formatMealTypeOptions } from "@/lib/utils/diet-formatters";

type DailyMeal = NonNullable<DietPlan["dailyMeals"]>[0];

interface DietPlanProps {
  plan: DietPlan;
}

export function DietPlanDisplay({ plan }: DietPlanProps) {
  const [selectedMeal, setSelectedMeal] = useState<{
    name: string;
    open: boolean;
  }>({ name: "", open: false });

  // Support both old format (dailyMeals) and new format (mealOptions)
  const hasOldFormat = plan.dailyMeals && plan.dailyMeals.length > 0;
  const hasNewFormat = plan.mealOptions && (
    (plan.mealOptions.breakfast && plan.mealOptions.breakfast.length > 0) ||
    (plan.mealOptions.lunch && plan.mealOptions.lunch.length > 0) ||
    (plan.mealOptions.dinner && plan.mealOptions.dinner.length > 0)
  );
  const hasData = hasOldFormat || hasNewFormat;

  if (!hasData) {
    return (
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Diet Plan</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No diet plan generated yet. Please regenerate your plan.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Get daily targets (from new format) or calculate from old format
  const dailyTargets = plan.dailyTargets || 
    (plan.dailyMeals && plan.dailyMeals.length > 0 
      ? { 
          totalCalories: plan.dailyMeals[0].totalCalories, 
          totalMacros: plan.dailyMeals[0].totalMacros 
        }
      : { totalCalories: 0 });

  const fullDietText = formatDietPlanText(plan);

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            <CardTitle className="text-2xl">Diet Plan</CardTitle>
          </div>
          <SimpleVoicePlayer text={fullDietText} label="Read All" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {plan.weeklyOverview && (
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium">{plan.weeklyOverview}</p>
          </div>
        )}

        {/* Daily Targets */}
        {dailyTargets && (
          <div className="p-4 rounded-lg bg-muted border-2">
            <h3 className="font-semibold text-lg mb-3">Daily Targets</h3>
            <div className="flex gap-4 flex-wrap text-sm">
              <span>Total: <strong>{dailyTargets.totalCalories} kcal</strong></span>
              {dailyTargets.totalMacros && (
                <>
                  <span>Protein: <strong>{dailyTargets.totalMacros.protein}g</strong></span>
                  <span>Carbs: <strong>{dailyTargets.totalMacros.carbs}g</strong></span>
                  <span>Fats: <strong>{dailyTargets.totalMacros.fats}g</strong></span>
                </>
              )}
            </div>
          </div>
        )}

        {/* New Format: Meal Options */}
        {hasNewFormat && plan.mealOptions && (
          <div className="space-y-6">
            {/* Breakfast Options */}
            {plan.mealOptions.breakfast && plan.mealOptions.breakfast.length > 0 && (
              <div className="p-4 rounded-lg border-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Apple className="h-5 w-5 text-primary" />
                    Breakfast Options
                  </h3>
                  <SimpleVoicePlayer text={formatMealTypeOptions(plan, "breakfast")} label="Read" />
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                  {plan.mealOptions.breakfast.map((meal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-3 rounded-md bg-card border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">
                          {meal.name}
                        </p>
                        {meal.name && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedMeal({ name: meal.name, open: true })
                            }
                            className="h-7 px-2"
                          >
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Image
                          </Button>
                        )}
                      </div>
                      {meal.calories && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {meal.calories} kcal
                        </p>
                      )}
                      {meal.macros && (
                        <p className="text-xs text-muted-foreground mb-2">
                          P: {meal.macros.protein}g • C: {meal.macros.carbs}g • F: {meal.macros.fats}g
                        </p>
                      )}
                      {meal.ingredients && meal.ingredients.length > 0 && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {meal.ingredients.join(", ")}
                        </p>
                      )}
                      {meal.instructions && (
                        <p className="text-xs italic text-muted-foreground mt-2">
                          {meal.instructions}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Lunch Options */}
            {plan.mealOptions.lunch && plan.mealOptions.lunch.length > 0 && (
              <div className="p-4 rounded-lg border-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Apple className="h-5 w-5 text-primary" />
                    Lunch Options
                  </h3>
                  <SimpleVoicePlayer text={formatMealTypeOptions(plan, "lunch")} label="Read" />
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                  {plan.mealOptions.lunch.map((meal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-3 rounded-md bg-card border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">
                          {meal.name}
                        </p>
                        {meal.name && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedMeal({ name: meal.name, open: true })
                            }
                            className="h-7 px-2"
                          >
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Image
                          </Button>
                        )}
                      </div>
                      {meal.calories && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {meal.calories} kcal
                        </p>
                      )}
                      {meal.macros && (
                        <p className="text-xs text-muted-foreground mb-2">
                          P: {meal.macros.protein}g • C: {meal.macros.carbs}g • F: {meal.macros.fats}g
                        </p>
                      )}
                      {meal.ingredients && meal.ingredients.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {meal.ingredients.join(", ")}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Dinner Options */}
            {plan.mealOptions.dinner && plan.mealOptions.dinner.length > 0 && (
              <div className="p-4 rounded-lg border-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Apple className="h-5 w-5 text-primary" />
                    Dinner Options
                  </h3>
                  <SimpleVoicePlayer text={formatMealTypeOptions(plan, "dinner")} label="Read" />
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                  {plan.mealOptions.dinner.map((meal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-3 rounded-md bg-card border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">
                          {meal.name}
                        </p>
                        {meal.name && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedMeal({ name: meal.name, open: true })
                            }
                            className="h-7 px-2"
                          >
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Image
                          </Button>
                        )}
                      </div>
                      {meal.calories && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {meal.calories} kcal
                        </p>
                      )}
                      {meal.macros && (
                        <p className="text-xs text-muted-foreground mb-2">
                          P: {meal.macros.protein}g • C: {meal.macros.carbs}g • F: {meal.macros.fats}g
                        </p>
                      )}
                      {meal.ingredients && meal.ingredients.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {meal.ingredients.join(", ")}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Snack Options */}
            {plan.mealOptions.snacks && plan.mealOptions.snacks.length > 0 && (
              <div className="p-4 rounded-lg border-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Apple className="h-5 w-5 text-primary" />
                    Snack Options
                  </h3>
                  <SimpleVoicePlayer text={formatMealTypeOptions(plan, "snacks")} label="Read" />
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                  {plan.mealOptions.snacks.map((meal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-3 rounded-md bg-card border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">
                          {meal.name}
                        </p>
                        {meal.name && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedMeal({ name: meal.name, open: true })
                            }
                            className="h-7 px-2"
                          >
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Image
                          </Button>
                        )}
                      </div>
                      {meal.calories && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {meal.calories} kcal
                        </p>
                      )}
                      {meal.macros && (
                        <p className="text-xs text-muted-foreground mb-2">
                          P: {meal.macros.protein}g • C: {meal.macros.carbs}g • F: {meal.macros.fats}g
                        </p>
                      )}
                      {meal.ingredients && meal.ingredients.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {meal.ingredients.join(", ")}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Old Format: Daily Meals (fallback for backward compatibility) */}
        {hasOldFormat && plan.dailyMeals && plan.dailyMeals.length > 0 && (
          <div className="space-y-4">
            {plan.dailyMeals.map((day: DailyMeal, index: number) => (
              <div
                key={index}
                className="p-4 rounded-lg border-2 hover:border-primary/50 transition-colors"
              >
                <h3 className="font-semibold text-lg mb-3">{day.day}</h3>
                
                <div className="mb-4 p-3 rounded-md bg-muted text-sm">
                  <div className="flex gap-4 flex-wrap">
                    <span>Total: <strong>{day.totalCalories} kcal</strong></span>
                    {day.totalMacros && (
                      <>
                        <span>Protein: <strong>{day.totalMacros.protein}g</strong></span>
                        <span>Carbs: <strong>{day.totalMacros.carbs}g</strong></span>
                        <span>Fats: <strong>{day.totalMacros.fats}g</strong></span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {day.meals?.breakfast && (
                    <div className="p-3 rounded-md bg-card border border-border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Apple className="h-4 w-4" />
                        Breakfast
                      </h4>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">
                          {day.meals.breakfast.name || "Breakfast"}
                        </p>
                        {day.meals.breakfast.name && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedMeal({ name: day.meals.breakfast.name, open: true })
                            }
                            className="h-7 px-2"
                          >
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Image
                          </Button>
                        )}
                      </div>
                      {day.meals.breakfast.calories && (
                        <p className="text-sm text-muted-foreground">
                          {day.meals.breakfast.calories} kcal
                        </p>
                      )}
                      {day.meals.breakfast.ingredients && day.meals.breakfast.ingredients.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {day.meals.breakfast.ingredients.join(", ")}
                        </div>
                      )}
                    </div>
                  )}

                  {day.meals?.lunch && (
                    <div className="p-3 rounded-md bg-card border border-border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Apple className="h-4 w-4" />
                        Lunch
                      </h4>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">
                          {day.meals.lunch.name || "Lunch"}
                        </p>
                        {day.meals.lunch.name && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedMeal({ name: day.meals.lunch.name, open: true })
                            }
                            className="h-7 px-2"
                          >
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Image
                          </Button>
                        )}
                      </div>
                      {day.meals.lunch.calories && (
                        <p className="text-sm text-muted-foreground">
                          {day.meals.lunch.calories} kcal
                        </p>
                      )}
                      {day.meals.lunch.ingredients && day.meals.lunch.ingredients.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {day.meals.lunch.ingredients.join(", ")}
                        </div>
                      )}
                    </div>
                  )}

                  {day.meals?.dinner && (
                    <div className="p-3 rounded-md bg-card border border-border">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Apple className="h-4 w-4" />
                        Dinner
                      </h4>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">
                          {day.meals.dinner.name || "Dinner"}
                        </p>
                        {day.meals.dinner.name && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedMeal({ name: day.meals.dinner.name, open: true })
                            }
                            className="h-7 px-2"
                          >
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Image
                          </Button>
                        )}
                      </div>
                      {day.meals.dinner.calories && (
                        <p className="text-sm text-muted-foreground">
                          {day.meals.dinner.calories} kcal
                        </p>
                      )}
                      {day.meals.dinner.ingredients && day.meals.dinner.ingredients.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {day.meals.dinner.ingredients.join(", ")}
                        </div>
                      )}
                    </div>
                  )}

                  {day.meals.snacks && day.meals.snacks.length > 0 && (
                    <div className="p-3 rounded-md bg-card border border-border">
                      <h4 className="font-medium mb-2">Snacks</h4>
                      {day.meals.snacks.map((snack, snackIndex: number) => (
                        <div key={snackIndex} className="mb-2 last:mb-0">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm">
                              {snack.name}
                            </p>
                            {snack.name && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedMeal({ name: snack.name, open: true })
                                }
                                className="h-7 px-2"
                              >
                                <ImageIcon className="h-3 w-3 mr-1" />
                                Image
                              </Button>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {snack.calories} kcal • {snack.ingredients.join(", ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {plan.tips && plan.tips.length > 0 && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <h4 className="font-semibold mb-2">Nutrition Tips</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {plan.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>

      <ImageGenerator
        open={selectedMeal.open}
        onOpenChange={(open) =>
          setSelectedMeal({ name: selectedMeal.name, open })
        }
        prompt={selectedMeal.name}
        type="meal"
      />
    </Card>
  );
}

