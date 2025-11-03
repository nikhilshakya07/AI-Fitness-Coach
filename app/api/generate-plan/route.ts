import { NextRequest, NextResponse } from "next/server";
import { generateWithAI } from "@/lib/api/ai-provider";
import { createWorkoutPrompt } from "@/lib/prompts/workout-prompt";
import { createDietPrompt } from "@/lib/prompts/diet-prompt";
import { createTipsPrompt } from "@/lib/prompts/tips-prompt";
import { parseAIResponse } from "@/lib/utils/json-parser";
import type { UserProfile, WorkoutPlan, DietPlan, AITips } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const userProfile: UserProfile = await request.json();

    // Validate required fields
    if (!userProfile.name || !userProfile.age || !userProfile.fitnessGoal) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate all three plans in parallel for better performance
    // Increased maxTokens for diet plan to prevent truncation
    const [workoutResponse, dietResponse, tipsResponse] = await Promise.all([
      generateWithAI(createWorkoutPrompt(userProfile), { maxTokens: 3000 }).catch(err => {
        console.error("Workout plan generation failed:", err);
        return "";
      }),
      generateWithAI(createDietPrompt(userProfile), { maxTokens: 4000 }).catch(err => {
        console.error("Diet plan generation failed:", err);
        return "";
      }),
      generateWithAI(createTipsPrompt(userProfile), { maxTokens: 1500 }).catch(err => {
        console.error("Tips generation failed:", err);
        return "";
      }),
    ]);

    // Log response lengths for debugging
    console.log("Workout response length:", workoutResponse?.length || 0);
    console.log("Diet response length:", dietResponse?.length || 0);
    console.log("Tips response length:", tipsResponse?.length || 0);
    
    // Log diet response preview for debugging
    if (dietResponse) {
      console.log("Diet response preview:", dietResponse.substring(0, 300));
      console.log("Diet response end:", dietResponse.substring(Math.max(0, dietResponse.length - 200)));
    }

    // Parse JSON responses
    let workoutPlan: WorkoutPlan;
    let dietPlan: DietPlan;
    let aiTips: AITips;
    
    try {
      workoutPlan = parseAIResponse<WorkoutPlan>(
        workoutResponse || "",
        { dailyRoutines: [] } as WorkoutPlan
      );
      console.log("Workout plan parsed successfully:", workoutPlan.dailyRoutines?.length || 0, "days");
    } catch (err) {
      console.error("Failed to parse workout plan:", err);
      workoutPlan = { dailyRoutines: [] } as WorkoutPlan;
    }

    try {
      dietPlan = parseAIResponse<DietPlan>(
        dietResponse || "",
        { mealOptions: { breakfast: [], lunch: [], dinner: [], snacks: [] }, dailyTargets: { totalCalories: 0 } } as DietPlan
      );
      console.log("Diet plan parsed successfully");
      
      // Validate diet plan structure
      if (!dietPlan.mealOptions || 
          (!dietPlan.mealOptions.breakfast || dietPlan.mealOptions.breakfast.length === 0) &&
          (!dietPlan.mealOptions.lunch || dietPlan.mealOptions.lunch.length === 0) &&
          (!dietPlan.mealOptions.dinner || dietPlan.mealOptions.dinner.length === 0)) {
        console.warn("Diet plan has no meal options, checking response...");
        if (dietResponse && dietResponse.length > 100) {
          console.warn("Diet response exists but couldn't be parsed properly");
        }
      } else {
        const breakfastCount = dietPlan.mealOptions?.breakfast?.length || 0;
        const lunchCount = dietPlan.mealOptions?.lunch?.length || 0;
        const dinnerCount = dietPlan.mealOptions?.dinner?.length || 0;
        const snackCount = dietPlan.mealOptions?.snacks?.length || 0;
        console.log(`Meal options: Breakfast: ${breakfastCount}, Lunch: ${lunchCount}, Dinner: ${dinnerCount}, Snacks: ${snackCount}`);
      }
    } catch (err) {
      console.error("Failed to parse diet plan:", err);
      dietPlan = { mealOptions: { breakfast: [], lunch: [], dinner: [], snacks: [] }, dailyTargets: { totalCalories: 0 } } as DietPlan;
    }

    try {
      aiTips = parseAIResponse<AITips>(
        tipsResponse || "",
        {
          lifestyleTips: [],
          postureTips: [],
          motivationalQuotes: [],
        } as AITips
      );
    } catch (err) {
      console.error("Failed to parse tips:", err);
      aiTips = {
        lifestyleTips: [],
        postureTips: [],
        motivationalQuotes: [],
      } as AITips;
    }

    // Create complete fitness plan
    const fitnessPlan = {
      id: `plan-${Date.now()}`,
      profile: userProfile,
      workoutPlan,
      dietPlan,
      aiTips,
      createdAt: new Date(),
    };

    return NextResponse.json(fitnessPlan, { status: 200 });
  } catch (error: any) {
    console.error("Plan generation error:", error);

    // Handle specific API errors
    if (error.message?.includes("API key")) {
      return NextResponse.json(
        {
          error: "API key not configured. Please check your .env.local file.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate fitness plan",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

