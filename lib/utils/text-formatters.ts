import type { WorkoutPlan, DietPlan, AITips } from "@/lib/types";

/**
 * Format workout plan as readable text for TTS
 */
export function formatWorkoutPlanText(plan: WorkoutPlan): string {
  if (!plan.dailyRoutines || plan.dailyRoutines.length === 0) {
    return "";
  }

  let text = "";
  
  if (plan.weeklyOverview) {
    text += `Weekly Overview: ${plan.weeklyOverview}\n\n`;
  }

  plan.dailyRoutines.forEach((routine) => {
    text += `${routine.day}.\n`;
    text += `Duration: ${routine.duration} minutes. Difficulty: ${routine.difficulty}.\n`;
    
    if (routine.exercises && routine.exercises.length > 0) {
      text += "Exercises:\n";
      routine.exercises.forEach((exercise, index) => {
        if (exercise) {
          text += `${index + 1}. ${exercise.name}`;
          if (exercise.sets && exercise.reps) {
            text += `. ${exercise.sets} sets of ${exercise.reps} repetitions`;
          }
          if (exercise.restTime) {
            text += `. Rest for ${exercise.restTime} seconds between sets`;
          }
          if (exercise.description) {
            text += `. ${exercise.description}`;
          }
          text += ".\n";
        }
      });
    }
    text += "\n";
  });

  if (plan.tips && plan.tips.length > 0) {
    text += "Workout Tips:\n";
    plan.tips.forEach((tip) => {
      text += `- ${tip}\n`;
    });
  }

  return text.trim();
}

/**
 * Format diet plan as readable text for TTS
 */
export function formatDietPlanText(plan: DietPlan): string {
  let text = "";

  if (plan.weeklyOverview) {
    text += `Weekly Overview: ${plan.weeklyOverview}\n\n`;
  }

  // New format: Meal options
  if (plan.mealOptions) {
    if (plan.dailyTargets) {
      text += `Daily Target: ${plan.dailyTargets.totalCalories} calories`;
      if (plan.dailyTargets.totalMacros) {
        text += `. Protein: ${plan.dailyTargets.totalMacros.protein} grams, Carbs: ${plan.dailyTargets.totalMacros.carbs} grams, Fats: ${plan.dailyTargets.totalMacros.fats} grams`;
      }
      text += ".\n\n";
    }

    if (plan.mealOptions.breakfast && plan.mealOptions.breakfast.length > 0) {
      text += "Breakfast Options:\n";
      plan.mealOptions.breakfast.forEach((meal, index) => {
        text += `Option ${index + 1}: ${meal.name}. ${meal.calories} calories.`;
        if (meal.macros) {
          text += ` Protein: ${meal.macros.protein} grams, Carbs: ${meal.macros.carbs} grams, Fats: ${meal.macros.fats} grams.`;
        }
        if (meal.ingredients && meal.ingredients.length > 0) {
          text += ` Ingredients: ${meal.ingredients.join(", ")}.`;
        }
        if (meal.instructions) {
          text += ` Instructions: ${meal.instructions}.`;
        }
        text += "\n";
      });
      text += "\n";
    }

    if (plan.mealOptions.lunch && plan.mealOptions.lunch.length > 0) {
      text += "Lunch Options:\n";
      plan.mealOptions.lunch.forEach((meal, index) => {
        text += `Option ${index + 1}: ${meal.name}. ${meal.calories} calories.`;
        if (meal.macros) {
          text += ` Protein: ${meal.macros.protein} grams, Carbs: ${meal.macros.carbs} grams, Fats: ${meal.macros.fats} grams.`;
        }
        if (meal.ingredients && meal.ingredients.length > 0) {
          text += ` Ingredients: ${meal.ingredients.join(", ")}.`;
        }
        text += "\n";
      });
      text += "\n";
    }

    if (plan.mealOptions.dinner && plan.mealOptions.dinner.length > 0) {
      text += "Dinner Options:\n";
      plan.mealOptions.dinner.forEach((meal, index) => {
        text += `Option ${index + 1}: ${meal.name}. ${meal.calories} calories.`;
        if (meal.macros) {
          text += ` Protein: ${meal.macros.protein} grams, Carbs: ${meal.macros.carbs} grams, Fats: ${meal.macros.fats} grams.`;
        }
        if (meal.ingredients && meal.ingredients.length > 0) {
          text += ` Ingredients: ${meal.ingredients.join(", ")}.`;
        }
        text += "\n";
      });
      text += "\n";
    }

    if (plan.mealOptions.snacks && plan.mealOptions.snacks.length > 0) {
      text += "Snack Options:\n";
      plan.mealOptions.snacks.forEach((meal, index) => {
        text += `Option ${index + 1}: ${meal.name}. ${meal.calories} calories.`;
        if (meal.ingredients && meal.ingredients.length > 0) {
          text += ` Ingredients: ${meal.ingredients.join(", ")}.`;
        }
        text += "\n";
      });
    }
  }

  // Old format: Daily meals (backward compatibility)
  if (plan.dailyMeals && plan.dailyMeals.length > 0) {
    plan.dailyMeals.forEach((day) => {
      text += `${day.day}.\n`;
      text += `Total Calories: ${day.totalCalories}`;
      if (day.totalMacros) {
        text += `. Protein: ${day.totalMacros.protein} grams, Carbs: ${day.totalMacros.carbs} grams, Fats: ${day.totalMacros.fats} grams`;
      }
      text += ".\n";
      
      if (day.meals.breakfast) {
        text += `Breakfast: ${day.meals.breakfast.name}. ${day.meals.breakfast.calories} calories.`;
        if (day.meals.breakfast.ingredients && day.meals.breakfast.ingredients.length > 0) {
          text += ` Ingredients: ${day.meals.breakfast.ingredients.join(", ")}.`;
        }
        text += "\n";
      }
      
      if (day.meals.lunch) {
        text += `Lunch: ${day.meals.lunch.name}. ${day.meals.lunch.calories} calories.`;
        if (day.meals.lunch.ingredients && day.meals.lunch.ingredients.length > 0) {
          text += ` Ingredients: ${day.meals.lunch.ingredients.join(", ")}.`;
        }
        text += "\n";
      }
      
      if (day.meals.dinner) {
        text += `Dinner: ${day.meals.dinner.name}. ${day.meals.dinner.calories} calories.`;
        if (day.meals.dinner.ingredients && day.meals.dinner.ingredients.length > 0) {
          text += ` Ingredients: ${day.meals.dinner.ingredients.join(", ")}.`;
        }
        text += "\n";
      }
      
      text += "\n";
    });
  }

  if (plan.tips && plan.tips.length > 0) {
    text += "Nutrition Tips:\n";
    plan.tips.forEach((tip) => {
      text += `- ${tip}\n`;
    });
  }

  return text.trim();
}

/**
 * Format AI tips as readable text for TTS
 */
export function formatAITipsText(tips: AITips): string {
  let text = "";

  if (tips.lifestyleTips && tips.lifestyleTips.length > 0) {
    text += "Lifestyle Tips:\n";
    tips.lifestyleTips.forEach((tip) => {
      text += `- ${tip}\n`;
    });
    text += "\n";
  }

  if (tips.postureTips && tips.postureTips.length > 0) {
    text += "Posture and Form Tips:\n";
    tips.postureTips.forEach((tip) => {
      text += `- ${tip}\n`;
    });
    text += "\n";
  }

  if (tips.motivationalQuotes && tips.motivationalQuotes.length > 0) {
    text += "Motivational Quotes:\n";
    tips.motivationalQuotes.forEach((quote) => {
      text += `${quote}\n`;
    });
  }

  return text.trim();
}

