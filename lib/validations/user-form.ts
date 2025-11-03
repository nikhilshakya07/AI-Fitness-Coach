import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  age: z.number().min(10, "Age must be at least 10").max(100, "Age must be less than 100"),
  gender: z.enum(["male", "female", "other"] as const, {
    message: "Please select your gender",
  }),
  height: z.number().min(100, "Height must be at least 100 cm").max(250, "Height must be less than 250 cm"),
  weight: z.number().min(30, "Weight must be at least 30 kg").max(300, "Weight must be less than 300 kg"),
  fitnessGoal: z.enum(["weight_loss", "muscle_gain", "endurance", "general_fitness", "strength", "flexibility"] as const, {
    message: "Please select your fitness goal",
  }),
  fitnessLevel: z.enum(["beginner", "intermediate", "advanced"] as const, {
    message: "Please select your fitness level",
  }),
  workoutLocation: z.enum(["home", "gym", "outdoor"] as const, {
    message: "Please select your workout location",
  }),
  dietaryPreference: z.enum(["veg", "non_veg", "vegan", "keto", "paleo", "mediterranean"] as const, {
    message: "Please select your dietary preference",
  }),
  medicalHistory: z.string().optional(),
  stressLevel: z.number().min(1).max(10).optional(),
  allergies: z.array(z.string()).optional(),
  otherNotes: z.string().optional(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

