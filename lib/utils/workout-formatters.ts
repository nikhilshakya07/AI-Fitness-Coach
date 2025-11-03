import type { WorkoutPlan } from "@/lib/types";

/**
 * Format a single day's workout routine as readable text
 */
export function formatDayWorkoutText(plan: WorkoutPlan, dayIndex: number): string {
  if (!plan.dailyRoutines || !plan.dailyRoutines[dayIndex]) {
    return "";
  }

  const routine = plan.dailyRoutines[dayIndex];
  let text = `${routine.day}.\n`;
  text += `Duration: ${routine.duration} minutes. Difficulty: ${routine.difficulty}.\n`;
  
  if (routine.exercises && routine.exercises.length > 0) {
    text += "Exercises:\n";
    routine.exercises.forEach((exercise, index) => {
      if (exercise) {
        text += `${index + 1}. ${exercise.name}`;
        if (exercise.sets && exercise.reps) {
          text += `. ${exercise.sets} sets of ${exercise.reps} repetitions`;
        }
        if (exercise.restTime) {
          text += `. Rest for ${exercise.restTime} seconds between sets`;
        }
        if (exercise.description) {
          text += `. ${exercise.description}`;
        }
        text += ".\n";
      }
    });
  }

  return text.trim();
}

