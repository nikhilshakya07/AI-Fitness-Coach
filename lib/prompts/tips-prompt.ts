import type { UserProfile } from "@/lib/types";

/**
 * Generate AI tips and motivation prompt
 */
export function createTipsPrompt(profile: UserProfile): string {
  return `You are a motivational fitness and wellness coach. Based on this user profile, provide personalized tips and motivation:

**User Profile:**
- Name: ${profile.name}
- Age: ${profile.age}
- Fitness Goal: ${profile.fitnessGoal}
- Fitness Level: ${profile.fitnessLevel}
- Workout Location: ${profile.workoutLocation}
- Dietary Preference: ${profile.dietaryPreference}
${profile.stressLevel ? `- Stress Level: ${profile.stressLevel}/10` : ""}

**Requirements:**
1. Provide ONLY 3 lifestyle tips specific to their fitness goal (${profile.fitnessGoal})
2. Provide ONLY 2 posture and form tips for their fitness level (${profile.fitnessLevel})
3. Provide ONLY 1 motivational quote personalized for their journey
4. Tips should be practical, actionable, and encouraging
5. Consider their workout location (${profile.workoutLocation}) when giving tips
6. Keep tips concise and to the point

**Output Format:**
Return ONLY a valid JSON object with this EXACT structure. Do not include any text before or after the JSON.
{
  "lifestyleTips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ],
  "postureTips": [
    "Tip 1",
    "Tip 2"
  ],
  "motivationalQuotes": [
    "Quote 1"
  ]
}

CRITICAL: Return ONLY the JSON object. No markdown, no code blocks, no explanation. Just the raw JSON starting with { and ending with }.
Make sure all arrays contain strings, no null values, no incomplete entries.`;
}

