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

**Requirements:**
1. Create a detailed 7-day workout plan with exercises suitable for ${profile.fitnessLevel} level
2. Each day should include:
   - Exercise name
   - Number of sets
   - Number of reps (or duration for cardio)
   - Rest time between sets
   - Brief description of proper form
3. Exercises must be appropriate for ${profile.workoutLocation} location
4. Plan should align with the goal: ${profile.fitnessGoal}
5. Include warm-up and cool-down exercises
6. Make the plan progressive and challenging but safe

**Output Format:**
Return a valid JSON object with this structure:
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
          "description": "Brief description"
        }
      ],
      "duration": 45,
      "difficulty": "${profile.fitnessLevel}"
    }
  ],
  "weeklyOverview": "Brief weekly overview",
  "tips": ["Tip 1", "Tip 2", "Tip 3"]
}

Make sure the response is valid JSON only, no additional text.`;

