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
1. Provide 5 lifestyle tips specific to their fitness goal (${profile.fitnessGoal})
2. Provide 5 posture and form tips for their fitness level (${profile.fitnessLevel})
3. Provide 3 motivational quotes personalized for their journey
4. Tips should be practical, actionable, and encouraging
5. Consider their workout location (${profile.workoutLocation}) when giving tips

**Output Format:**
Return a valid JSON object with this structure:
{
  "lifestyleTips": [
    "Tip 1",
    "Tip 2",
    "Tip 3",
    "Tip 4",
    "Tip 5"
  ],
  "postureTips": [
    "Tip 1",
    "Tip 2",
    "Tip 3",
    "Tip 4",
    "Tip 5"
  ],
  "motivationalQuotes": [
    "Quote 1",
    "Quote 2",
    "Quote 3"
  ]
}

Make sure the response is valid JSON only, no additional text.`;

