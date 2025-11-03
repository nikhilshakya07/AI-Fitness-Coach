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

  return `You are an expert nutritionist. Create a personalized 7-day diet plan for the following user profile:

**User Profile:**
- Name: ${profile.name}
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Fitness Goal: ${profile.fitnessGoal}
- Current Fitness Level: ${profile.fitnessLevel}
- Dietary Preference: ${profile.dietaryPreference}
- Target Daily Calories: ~${targetCalories} kcal
${profile.allergies && profile.allergies.length > 0 ? `- Allergies: ${profile.allergies.join(", ")}` : ""}
${profile.medicalHistory ? `- Medical History: ${profile.medicalHistory}` : ""}
${profile.otherNotes ? `- Additional Notes: ${profile.otherNotes}` : ""}

**Requirements:**
1. Create a detailed 7-day meal plan that strictly follows ${profile.dietaryPreference} dietary preference
2. Each day should include:
   - Breakfast (with ingredients, calories, and macros)
   - Lunch (with ingredients, calories, and macros)
   - Dinner (with ingredients, calories, and macros)
   - 1-2 healthy snacks (optional but recommended)
3. Meals must be:
   - Appropriate for ${profile.dietaryPreference} diet
   - Realistic and easy to prepare
   - Nutritionally balanced
   - Aligned with ${profile.fitnessGoal} goal
4. Calculate total daily calories and macros (protein, carbs, fats)
5. ${profile.allergies && profile.allergies.length > 0 ? `AVOID ALL: ${profile.allergies.join(", ")}. ` : ""}Ensure no allergens are included.
6. Provide brief cooking instructions for complex meals

**Output Format:**
Return a valid JSON object with this structure:
{
  "dailyMeals": [
    {
      "day": "Day 1 - Monday",
      "meals": {
        "breakfast": {
          "name": "Meal Name",
          "ingredients": ["ingredient1", "ingredient2"],
          "calories": 400,
          "macros": {
            "protein": 25,
            "carbs": 50,
            "fats": 15
          },
          "instructions": "Brief cooking instructions"
        },
        "lunch": { ... },
        "dinner": { ... },
        "snacks": [{ ... }]
      },
      "totalCalories": ${targetCalories},
      "totalMacros": {
        "protein": 150,
        "carbs": 200,
        "fats": 65
      }
    }
  ],
  "weeklyOverview": "Brief weekly overview",
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Make sure the response is valid JSON only, no additional text.`;

