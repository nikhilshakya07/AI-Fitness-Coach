/**
 * User Input Types
 */
export type Gender = "male" | "female" | "other";

export type FitnessGoal =
  | "weight_loss"
  | "muscle_gain"
  | "endurance"
  | "general_fitness"
  | "strength"
  | "flexibility";

export type FitnessLevel = "beginner" | "intermediate" | "advanced";

export type WorkoutLocation = "home" | "gym" | "outdoor";

export type DietaryPreference = "veg" | "non_veg" | "vegan" | "keto" | "paleo" | "mediterranean";

/**
 * User Profile
 */
export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  fitnessGoal: FitnessGoal;
  fitnessLevel: FitnessLevel;
  workoutLocation: WorkoutLocation;
  dietaryPreference: DietaryPreference;
  medicalHistory?: string;
  stressLevel?: number; // 1-10
  allergies?: string[];
  otherNotes?: string;
}

/**
 * Exercise
 */
export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restTime: number; // in seconds
  description?: string;
  imageUrl?: string;
}

/**
 * Workout Plan
 */
export interface WorkoutPlan {
  dailyRoutines: {
    day: string;
    exercises: Exercise[];
    duration: number; // in minutes
    difficulty: FitnessLevel;
  }[];
  weeklyOverview?: string;
  tips?: string[];
}

/**
 * Meal
 */
export interface Meal {
  name: string;
  ingredients: string[];
  calories: number;
  macros?: {
    protein: number; // grams
    carbs: number; // grams
    fats: number; // grams
  };
  instructions?: string;
  imageUrl?: string;
}

/**
 * Diet Plan
 */
export interface DietPlan {
  // New format: meal options
  mealOptions?: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
  };
  dailyTargets?: {
    totalCalories: number;
    totalMacros?: {
      protein: number;
      carbs: number;
      fats: number;
    };
  };
  // Old format: daily meals (for backward compatibility)
  dailyMeals?: {
    day: string;
    meals: {
      breakfast: Meal;
      lunch: Meal;
      dinner: Meal;
      snacks?: Meal[];
    };
    totalCalories: number;
    totalMacros?: {
      protein: number;
      carbs: number;
      fats: number;
    };
  }[];
  weeklyOverview?: string;
  tips?: string[];
}

/**
 * AI Tips
 */
export interface AITips {
  lifestyleTips?: string[];
  postureTips?: string[];
  motivationalQuotes?: string[];
}

/**
 * Complete Fitness Plan
 */
export interface FitnessPlan {
  id: string;
  userId?: string;
  profile: UserProfile;
  workoutPlan: WorkoutPlan;
  dietPlan: DietPlan;
  aiTips: AITips;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Motivation Quote
 */
export interface MotivationQuote {
  quote: string;
  author?: string;
  category?: string;
  date: Date;
}

/**
 * AI Provider Types
 */
export type AIProvider = "openai" | "gemini" | "claude";

export interface AIGenerationOptions {
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Voice Options
 */
export type VoiceSection = "workout" | "diet" | "tips" | "all";

export interface VoiceOptions {
  section: VoiceSection;
  voiceId?: string; // For ElevenLabs
  speed?: number;
}

/**
 * Image Generation Options
 */
export interface ImageGenerationOptions {
  prompt: string;
  style?: "realistic" | "cartoon" | "illustration";
  size?: "256x256" | "512x512" | "1024x1024";
}

