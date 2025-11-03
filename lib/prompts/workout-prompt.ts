import type { UserProfile } from "@/lib/types";

/**
 * Generate workout plan prompt for AI
 */
export function createWorkoutPrompt(profile: UserProfile): string {
  return `You are an expert fitness coach. Create a personalized 7-day workout plan for the following user profile:

**User Profile:**
- Name: ${profile.name}
- Age: ${profile.age}
- Gender: ${profile.gender}
- Height: ${profile.height} cm
- Weight: ${profile.weight} kg
- Fitness Goal: ${profile.fitnessGoal}
- Current Fitness Level: ${profile.fitnessLevel}
- Workout Location: ${profile.workoutLocation}
${profile.medicalHistory ? `- Medical History: ${profile.medicalHistory}` : ""}
${profile.stressLevel ? `- Stress Level: ${profile.stressLevel}/10` : ""}
${profile.otherNotes ? `- Additional Notes: ${profile.otherNotes}` : ""}

**CRITICAL REQUIREMENTS - RESPONSE MUST BE UNDER 2000 CHARACTERS:**
1. Create a COMPACT 7-day workout plan - MAX 3 exercises per day to stay under token limit
2. Each exercise MUST include:
   - "name": short name (max 20 chars)
   - "sets": number (e.g. 3)
   - "reps": number (e.g. 12) 
   - "restTime": number (e.g. 60)
   - "description": very brief (max 30 chars)
3. Exercises for ${profile.workoutLocation}
4. Goal: ${profile.fitnessLevel} level, ${profile.fitnessGoal}
5. Weekly overview: max 80 characters
6. Tips array: max 2 items only

**Output Format:**
Return ONLY a valid JSON object with this EXACT structure. Do not include any text before or after the JSON.
{
  "dailyRoutines": [
    {
      "day": "Day 1 - Monday",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": 12,
          "restTime": 60,
          "description": "Brief"
        }
      ],
      "duration": 45,
      "difficulty": "${profile.fitnessLevel}"
    }
  ],
  "weeklyOverview": "Brief overview",
  "tips": ["Tip1", "Tip2"]
}

CRITICAL: Return ONLY the JSON object. No markdown, no code blocks, no explanation. Just the raw JSON starting with { and ending with }.
Make sure all values are valid (no null, use 0 for missing numbers, empty strings for missing text).`;
}

