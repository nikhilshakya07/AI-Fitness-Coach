import type { DietPlan } from "@/lib/types";

/**
 * Format a specific meal option as readable text
 */
export function formatMealOptionText(mealName: string, meal: { name: string; calories?: number; macros?: { protein: number; carbs: number; fats: number }; ingredients?: string[]; instructions?: string }): string {
  let text = `${mealName}: ${meal.name}.`;
  if (meal.calories) {
    text += ` ${meal.calories} calories.`;
  }
  if (meal.macros) {
    text += ` Protein: ${meal.macros.protein} grams, Carbs: ${meal.macros.carbs} grams, Fats: ${meal.macros.fats} grams.`;
  }
  if (meal.ingredients && meal.ingredients.length > 0) {
    text += ` Ingredients: ${meal.ingredients.join(", ")}.`;
  }
  if (meal.instructions) {
    text += ` Instructions: ${meal.instructions}.`;
  }
  return text;
}

/**
 * Format all options for a meal type (breakfast, lunch, dinner, snacks)
 */
export function formatMealTypeOptions(plan: DietPlan, mealType: "breakfast" | "lunch" | "dinner" | "snacks"): string {
  if (!plan.mealOptions || !plan.mealOptions[mealType] || plan.mealOptions[mealType].length === 0) {
    return "";
  }

  const meals = plan.mealOptions[mealType];
  let text = `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Options:\n`;
  
  meals.forEach((meal, index) => {
    text += `Option ${index + 1}: ${formatMealOptionText(meal.name, meal)}\n`;
  });

  return text.trim();
}

