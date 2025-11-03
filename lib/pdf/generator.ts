import jsPDF from "jspdf";
import type { FitnessPlan } from "@/lib/types";
import { format } from "date-fns";

/**
 * Generate a PDF from a fitness plan
 */
export async function generatePlanPDF(plan: FitnessPlan): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Standard font sizes
  const FONT_SIZE_LARGE = 20;
  const FONT_SIZE_HEADER = 14;
  const FONT_SIZE_BODY = 11;
  const FONT_SIZE_SMALL = 10;
  const FONT_SIZE_FOOTER = 8;
  const LINE_HEIGHT = 5;
  const SECTION_SPACING = 15;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin - 15) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with word wrap
  const addText = (
    text: string,
    fontSize: number = FONT_SIZE_BODY,
    isBold: boolean = false,
    color?: [number, number, number],
    indent: number = 0
  ) => {
    if (color) {
      doc.setTextColor(color[0], color[1], color[2]);
    } else {
      doc.setTextColor(0, 0, 0);
    }
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont(undefined, "bold");
    } else {
      doc.setFont(undefined, "normal");
    }

    const lines = doc.splitTextToSize(text, maxWidth - indent * 2);
    lines.forEach((line: string) => {
      checkPageBreak(fontSize + LINE_HEIGHT);
      doc.text(line, margin + indent, yPosition);
      yPosition += fontSize * 0.4 + LINE_HEIGHT;
    });

    // Reset text color and font
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
  };

  // Helper function to add a section header with properly aligned background
  const addSectionHeader = (title: string) => {
    checkPageBreak(SECTION_SPACING + 10);
    if (yPosition > margin + 5) {
      yPosition += SECTION_SPACING; // Add spacing before section
    }
    
    const headerHeight = 14;
    const headerY = yPosition;
    
    // Draw blue background rectangle
    doc.setFillColor(66, 153, 225); // Primary blue color
    doc.roundedRect(margin, headerY, maxWidth, headerHeight, 3, 3, "F");
    
    // Add text centered vertically in the rectangle
    doc.setFontSize(FONT_SIZE_HEADER);
    doc.setFont(undefined, "bold");
    doc.setTextColor(255, 255, 255);
    
    // Calculate text position to center vertically in rectangle
    const textY = headerY + headerHeight / 2 + FONT_SIZE_HEADER / 3;
    doc.text(title, margin + 8, textY);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    
    yPosition = headerY + headerHeight + 8;
  };

  // Title with properly aligned background
  const titleHeight = 28;
  const titleY = yPosition;
  doc.setFillColor(66, 153, 225);
  doc.roundedRect(margin, titleY, maxWidth, titleHeight, 3, 3, "F");
  doc.setFontSize(FONT_SIZE_LARGE);
  doc.setFont(undefined, "bold");
  doc.setTextColor(255, 255, 255);
  // Center text vertically in rectangle
  const titleTextY = titleY + titleHeight / 2 + FONT_SIZE_LARGE / 3;
  doc.text("AI Fitness Coach Plan", margin + 10, titleTextY);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, "normal");
  yPosition = titleY + titleHeight + SECTION_SPACING;

  // User Profile Section
  addSectionHeader("User Profile");
  addText(`Name: ${plan.profile.name}`, FONT_SIZE_BODY);
  addText(`Age: ${plan.profile.age} years`, FONT_SIZE_BODY);
  addText(`Gender: ${plan.profile.gender.charAt(0).toUpperCase() + plan.profile.gender.slice(1)}`, FONT_SIZE_BODY);
  addText(`Height: ${plan.profile.height} cm`, FONT_SIZE_BODY);
  addText(`Weight: ${plan.profile.weight} kg`, FONT_SIZE_BODY);
  addText(`Fitness Goal: ${plan.profile.fitnessGoal.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}`, FONT_SIZE_BODY);
  addText(`Fitness Level: ${plan.profile.fitnessLevel.charAt(0).toUpperCase() + plan.profile.fitnessLevel.slice(1)}`, FONT_SIZE_BODY);
  addText(`Workout Location: ${plan.profile.workoutLocation.charAt(0).toUpperCase() + plan.profile.workoutLocation.slice(1)}`, FONT_SIZE_BODY);
  addText(`Dietary Preference: ${plan.profile.dietaryPreference.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}`, FONT_SIZE_BODY);
  if (plan.profile.stressLevel) {
    addText(`Stress Level: ${plan.profile.stressLevel}/10`, FONT_SIZE_BODY);
  }
  if (plan.profile.allergies && plan.profile.allergies.length > 0) {
    addText(`Allergies: ${plan.profile.allergies.join(", ")}`, FONT_SIZE_BODY);
  }
  yPosition += 3;
  addText(`Generated: ${format(new Date(plan.createdAt), "MMMM d, yyyy 'at' h:mm a")}`, FONT_SIZE_SMALL, false, [128, 128, 128]);
  yPosition += 5;

  // Workout Plan Section
  addSectionHeader("Workout Plan");
  
  if (plan.workoutPlan.weeklyOverview) {
    addText(`Weekly Overview: ${plan.workoutPlan.weeklyOverview}`, FONT_SIZE_BODY);
    yPosition += 5;
  }

  if (plan.workoutPlan.dailyRoutines && plan.workoutPlan.dailyRoutines.length > 0) {
    plan.workoutPlan.dailyRoutines.forEach((routine, index) => {
      checkPageBreak(35);
      addText(`${routine.day}`, FONT_SIZE_BODY, true);
      addText(`Duration: ${routine.duration} minutes | Difficulty: ${routine.difficulty.charAt(0).toUpperCase() + routine.difficulty.slice(1)}`, FONT_SIZE_SMALL);
      yPosition += 2;
      
      if (routine.exercises && routine.exercises.length > 0) {
        routine.exercises.forEach((exercise, exIndex) => {
          let exerciseText = `${exIndex + 1}. ${exercise.name}`;
          if (exercise.sets && exercise.reps) {
            exerciseText += ` - ${exercise.sets} sets × ${exercise.reps} reps`;
          }
          if (exercise.restTime) {
            exerciseText += ` (Rest: ${exercise.restTime}s)`;
          }
          addText(exerciseText, FONT_SIZE_SMALL, false, undefined, 5);
          if (exercise.description) {
            addText(exercise.description, FONT_SIZE_SMALL, false, undefined, 10);
          }
        });
      }
      yPosition += 5;
    });
  }

  if (plan.workoutPlan.tips && plan.workoutPlan.tips.length > 0) {
    yPosition += 3;
    addText("Workout Tips:", FONT_SIZE_BODY, true);
    plan.workoutPlan.tips.forEach((tip) => {
      addText(`• ${tip}`, FONT_SIZE_SMALL, false, undefined, 5);
    });
  }
  yPosition += 5;

  // Diet Plan Section
  addSectionHeader("Diet Plan");

  if (plan.dietPlan.weeklyOverview) {
    addText(`Weekly Overview: ${plan.dietPlan.weeklyOverview}`, FONT_SIZE_BODY);
    yPosition += 5;
  }

  // New format: Meal options
  if (plan.dietPlan.mealOptions) {
    if (plan.dietPlan.dailyTargets) {
      addText("Daily Targets:", FONT_SIZE_BODY, true);
      addText(`Total Calories: ${plan.dietPlan.dailyTargets.totalCalories}`, FONT_SIZE_SMALL);
      if (plan.dietPlan.dailyTargets.totalMacros) {
        addText(
          `Macros: Protein ${plan.dietPlan.dailyTargets.totalMacros.protein}g, ` +
          `Carbs ${plan.dietPlan.dailyTargets.totalMacros.carbs}g, ` +
          `Fats ${plan.dietPlan.dailyTargets.totalMacros.fats}g`,
          FONT_SIZE_SMALL
        );
      }
      yPosition += 5;
    }

    const mealTypes: Array<{ key: keyof typeof plan.dietPlan.mealOptions; label: string }> = [
      { key: "breakfast", label: "Breakfast Options" },
      { key: "lunch", label: "Lunch Options" },
      { key: "dinner", label: "Dinner Options" },
      { key: "snacks", label: "Snack Options" },
    ];

    mealTypes.forEach(({ key, label }) => {
      const meals = plan.dietPlan.mealOptions?.[key];
      if (meals && meals.length > 0) {
        checkPageBreak(30);
        addText(label, FONT_SIZE_BODY, true);
        meals.forEach((meal, index) => {
          let mealText = `Option ${index + 1}: ${meal.name}`;
          if (meal.calories) {
            mealText += ` (${meal.calories} cal)`;
          }
          if (meal.macros) {
            mealText += ` | P: ${meal.macros.protein}g, C: ${meal.macros.carbs}g, F: ${meal.macros.fats}g`;
          }
          addText(mealText, FONT_SIZE_SMALL, false, undefined, 5);
          
          if (meal.ingredients && meal.ingredients.length > 0) {
            addText(`Ingredients: ${meal.ingredients.join(", ")}`, FONT_SIZE_SMALL, false, undefined, 10);
          }
          if (meal.instructions) {
            addText(`Instructions: ${meal.instructions}`, FONT_SIZE_SMALL, false, undefined, 10);
          }
          yPosition += 3;
        });
        yPosition += 3;
      }
    });
  }

  // Old format: Daily meals (backward compatibility)
  if (plan.dietPlan.dailyMeals && plan.dietPlan.dailyMeals.length > 0) {
    plan.dietPlan.dailyMeals.forEach((day) => {
      checkPageBreak(30);
      addText(`${day.day}`, FONT_SIZE_BODY, true);
      addText(`Total: ${day.totalCalories} calories`, FONT_SIZE_SMALL);
      if (day.totalMacros) {
        addText(
          `Macros: P ${day.totalMacros.protein}g, C ${day.totalMacros.carbs}g, F ${day.totalMacros.fats}g`,
          FONT_SIZE_SMALL
        );
      }
      
      if (day.meals.breakfast) {
        addText(`Breakfast: ${day.meals.breakfast.name} (${day.meals.breakfast.calories} cal)`, FONT_SIZE_SMALL);
      }
      if (day.meals.lunch) {
        addText(`Lunch: ${day.meals.lunch.name} (${day.meals.lunch.calories} cal)`, FONT_SIZE_SMALL);
      }
      if (day.meals.dinner) {
        addText(`Dinner: ${day.meals.dinner.name} (${day.meals.dinner.calories} cal)`, FONT_SIZE_SMALL);
      }
      yPosition += 5;
    });
  }

  if (plan.dietPlan.tips && plan.dietPlan.tips.length > 0) {
    yPosition += 3;
    addText("Nutrition Tips:", FONT_SIZE_BODY, true);
    plan.dietPlan.tips.forEach((tip) => {
      addText(`• ${tip}`, FONT_SIZE_SMALL, false, undefined, 5);
    });
  }
  yPosition += 5;

  // AI Tips Section
  addSectionHeader("AI Tips & Motivation");

  if (plan.aiTips.lifestyleTips && plan.aiTips.lifestyleTips.length > 0) {
    addText("Lifestyle Tips:", FONT_SIZE_BODY, true);
    plan.aiTips.lifestyleTips.forEach((tip) => {
      addText(`• ${tip}`, FONT_SIZE_SMALL, false, undefined, 5);
    });
    yPosition += 5;
  }

  if (plan.aiTips.postureTips && plan.aiTips.postureTips.length > 0) {
    addText("Posture & Form Tips:", FONT_SIZE_BODY, true);
    plan.aiTips.postureTips.forEach((tip) => {
      addText(`• ${tip}`, FONT_SIZE_SMALL, false, undefined, 5);
    });
    yPosition += 5;
  }

  if (plan.aiTips.motivationalQuotes && plan.aiTips.motivationalQuotes.length > 0) {
    addText("Motivational Quotes:", FONT_SIZE_BODY, true);
    plan.aiTips.motivationalQuotes.forEach((quote) => {
      addText(`"${quote}"`, FONT_SIZE_SMALL, false, undefined, 5);
    });
  }

  // Footer on all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(FONT_SIZE_FOOTER);
    doc.setFont(undefined, "normal");
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generated by AI Fitness Coach - Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Generate filename
  const filename = `fitness-plan-${plan.profile.name.replace(/\s+/g, "-").toLowerCase()}-${format(
    new Date(plan.createdAt),
    "yyyy-MM-dd"
  )}.pdf`;

  // Save the PDF
  doc.save(filename);
}

