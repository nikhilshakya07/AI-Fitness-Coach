"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userProfileSchema, type UserProfileFormData } from "@/lib/validations/user-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FITNESS_GOALS = [
  { value: "weight_loss", label: "Weight Loss" },
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "endurance", label: "Endurance" },
  { value: "general_fitness", label: "General Fitness" },
  { value: "strength", label: "Strength" },
  { value: "flexibility", label: "Flexibility" },
] as const;

const FITNESS_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

const WORKOUT_LOCATIONS = [
  { value: "home", label: "Home" },
  { value: "gym", label: "Gym" },
  { value: "outdoor", label: "Outdoor" },
] as const;

const DIETARY_PREFERENCES = [
  { value: "veg", label: "Vegetarian" },
  { value: "non_veg", label: "Non-Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "keto", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "mediterranean", label: "Mediterranean" },
] as const;

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

export function UserInputForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      stressLevel: 5,
    },
  });

  const stressLevel = watch("stressLevel") || 5;

  const onSubmit = async (data: UserProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Store form data in sessionStorage for now (will be used in Phase 5)
      sessionStorage.setItem("userProfile", JSON.stringify(data));
      // Navigate to dashboard (will be created in Phase 5)
      router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-2">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-2xl">Create Your Fitness Plan</CardTitle>
        </div>
        <CardDescription>
          Tell us about yourself to get a personalized workout and diet plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  {...register("age", { valueAsNumber: true })}
                  className={errors.age ? "border-destructive" : ""}
                />
                {errors.age && (
                  <p className="text-sm text-destructive">{errors.age.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  onValueChange={(value) => setValue("gender", value as UserProfileFormData["gender"])}
                >
                  <SelectTrigger id="gender" className={errors.gender ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  {...register("height", { valueAsNumber: true })}
                  className={errors.height ? "border-destructive" : ""}
                />
                {errors.height && (
                  <p className="text-sm text-destructive">{errors.height.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  {...register("weight", { valueAsNumber: true })}
                  className={errors.weight ? "border-destructive" : ""}
                />
                {errors.weight && (
                  <p className="text-sm text-destructive">{errors.weight.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Fitness Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fitness Preferences</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fitnessGoal">Fitness Goal *</Label>
                <Select
                  onValueChange={(value) => setValue("fitnessGoal", value as UserProfileFormData["fitnessGoal"])}
                >
                  <SelectTrigger id="fitnessGoal" className={errors.fitnessGoal ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {FITNESS_GOALS.map((goal) => (
                      <SelectItem key={goal.value} value={goal.value}>
                        {goal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fitnessGoal && (
                  <p className="text-sm text-destructive">{errors.fitnessGoal.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitnessLevel">Fitness Level *</Label>
                <Select
                  onValueChange={(value) => setValue("fitnessLevel", value as UserProfileFormData["fitnessLevel"])}
                >
                  <SelectTrigger id="fitnessLevel" className={errors.fitnessLevel ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {FITNESS_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fitnessLevel && (
                  <p className="text-sm text-destructive">{errors.fitnessLevel.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="workoutLocation">Workout Location *</Label>
                <Select
                  onValueChange={(value) => setValue("workoutLocation", value as UserProfileFormData["workoutLocation"])}
                >
                  <SelectTrigger id="workoutLocation" className={errors.workoutLocation ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKOUT_LOCATIONS.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.workoutLocation && (
                  <p className="text-sm text-destructive">{errors.workoutLocation.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietaryPreference">Dietary Preference *</Label>
                <Select
                  onValueChange={(value) => setValue("dietaryPreference", value as UserProfileFormData["dietaryPreference"])}
                >
                  <SelectTrigger id="dietaryPreference" className={errors.dietaryPreference ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIETARY_PREFERENCES.map((pref) => (
                      <SelectItem key={pref.value} value={pref.value}>
                        {pref.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.dietaryPreference && (
                  <p className="text-sm text-destructive">{errors.dietaryPreference.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-muted-foreground">Optional Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stressLevel">Stress Level (1-10)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="stressLevel"
                    min={1}
                    max={10}
                    step={1}
                    value={[stressLevel]}
                    onValueChange={(value) => setValue("stressLevel", value[0])}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium min-w-[2rem] text-center">{stressLevel}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  placeholder="Any medical conditions, injuries, or concerns..."
                  rows={3}
                  {...register("medicalHistory")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherNotes">Additional Notes</Label>
                <Textarea
                  id="otherNotes"
                  placeholder="Any other information you'd like to share..."
                  rows={3}
                  {...register("otherNotes")}
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              <>
                Generate My Plan
                <Sparkles className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

