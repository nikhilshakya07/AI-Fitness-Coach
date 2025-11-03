import type { UserProfile } from "@/lib/types";

/**
 * Generate diet plan prompt for AI
 */
export function createDietPrompt(profile: UserProfile): string {
  // Calculate approximate daily calorie needs (simplified Harris-Benedict equation)
  const bmr = profile.gender === "male"
    ? 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age)
    : 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
  
  const activityMultiplier = {
    beginner: 1.375,
    intermediate: 1.55,
    advanced: 1.725,
  };
  
  const dailyCalories = Math.round(bmr * activityMultiplier[profile.fitnessLevel]);
  
  // Adjust based on goal
  let targetCalories = dailyCalories;
  if (profile.fitnessGoal === "weight_loss") {
    targetCalories = Math.round(dailyCalories * 0.8); // 20% deficit
  } else if (profile.fitnessGoal === "muscle_gain") {
    targetCalories = Math.round(dailyCalories * 1.1); // 10% surplus
  }

  return `You are an expert nutritionist. Create meal options for a personalized diet plan.

**User Profile:**
- Name: ${profile.name}
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height}cm, Weight: ${profile.weight}kg
- Goal: ${profile.fitnessGoal}
- Level: ${profile.fitnessLevel}
- Diet: ${profile.dietaryPreference}
- Target: ~${targetCalories} kcal/day
${profile.allergies && profile.allergies.length > 0 ? `- AVOID: ${profile.allergies.join(", ")}` : ""}

**REQUIREMENTS:**
1. Provide 3 DIFFERENT options for each meal type (breakfast, lunch, dinner, snacks)
2. Each meal: short name (max 20 chars), max 3 ingredients, calories (number), macros (numbers)
3. Breakfast options must include "instructions" field (brief, max 40 chars each)
4. ALL numeric values must be numbers (no null, use 0 if needed)
5. ${profile.dietaryPreference} only - make options varied and interesting
6. Each meal should contribute to daily target of ~${targetCalories} kcal
7. Mix high/low calorie options so user can mix and match

**Output Format:**
Return ONLY valid JSON. No markdown, no code blocks, no explanation.
CRITICAL: ALL property names MUST be in double quotes. ALL string values MUST be in double quotes.
Example of CORRECT format:
{
  "mealOptions": {
    "breakfast": [
      {
        "name": "Option 1",
        "ingredients": ["item1", "item2", "item3"],
        "calories": 400,
        "macros": {"protein": 25, "carbs": 50, "fats": 15},
        "instructions": "Brief instructions"
      },
      {
        "name": "Option 2",
        "ingredients": ["item1", "item2"],
        "calories": 450,
        "macros": {"protein": 30, "carbs": 55, "fats": 18},
        "instructions": "Brief instructions"
      },
      {
        "name": "Option 3",
        "ingredients": ["item1", "item2", "item3"],
        "calories": 380,
        "macros": {"protein": 22, "carbs": 45, "fats": 12},
        "instructions": "Brief instructions"
      }
    ],
    "lunch": [
      {"name": "Option 1", "ingredients": ["item1", "item2"], "calories": 500, "macros": {"protein": 30, "carbs": 60, "fats": 20}},
      {"name": "Option 2", "ingredients": ["item1", "item2"], "calories": 550, "macros": {"protein": 35, "carbs": 65, "fats": 22}},
      {"name": "Option 3", "ingredients": ["item1", "item2"], "calories": 480, "macros": {"protein": 28, "carbs": 58, "fats": 18}}
    ],
    "dinner": [
      {"name": "Option 1", "ingredients": ["item1", "item2"], "calories": 600, "macros": {"protein": 35, "carbs": 70, "fats": 25}},
      {"name": "Option 2", "ingredients": ["item1", "item2"], "calories": 650, "macros": {"protein": 40, "carbs": 75, "fats": 28}},
      {"name": "Option 3", "ingredients": ["item1", "item2"], "calories": 580, "macros": {"protein": 32, "carbs": 68, "fats": 22}}
    ],
    "snacks": [
      {"name": "Option 1", "ingredients": ["item1", "item2"], "calories": 200, "macros": {"protein": 10, "carbs": 25, "fats": 8}},
      {"name": "Option 2", "ingredients": ["item1"], "calories": 150, "macros": {"protein": 8, "carbs": 20, "fats": 5}},
      {"name": "Option 3", "ingredients": ["item1", "item2"], "calories": 180, "macros": {"protein": 12, "carbs": 22, "fats": 6}}
    ]
  },
  "dailyTargets": {
    "totalCalories": ${targetCalories},
    "totalMacros": {"protein": 120, "carbs": 180, "fats": 60}
  },
  "weeklyOverview": "Brief overview",
  "tips": ["Tip1", "Tip2"]
}

CRITICAL RULES:
1. Return ONLY JSON. No text before or after. Start with { and end with }.
2. ALL property names MUST be wrapped in double quotes (e.g., "name": not name:)
3. ALL string values MUST be wrapped in double quotes
4. ALL numbers must be actual numbers (no quotes)
5. Make sure each meal type has EXACTLY 3 different options.
6. Validate your JSON before returning - it must parse correctly.`;
}

