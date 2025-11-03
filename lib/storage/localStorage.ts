import type { FitnessPlan } from "@/lib/types";

const STORAGE_KEY = "ai-fitness-coach-plans";

/**
 * Save a fitness plan to localStorage
 */
export function savePlan(plan: FitnessPlan): void {
  if (typeof window === "undefined") return;

  const plans = getSavedPlans();
  const index = plans.findIndex((p) => p.id === plan.id);

  if (index >= 0) {
    plans[index] = { ...plan, updatedAt: new Date() };
  } else {
    plans.push(plan);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

/**
 * Get all saved plans from localStorage
 */
export function getSavedPlans(): FitnessPlan[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const plans = JSON.parse(data) as FitnessPlan[];
    // Convert date strings back to Date objects
    return plans.map((plan) => ({
      ...plan,
      createdAt: new Date(plan.createdAt),
      updatedAt: plan.updatedAt ? new Date(plan.updatedAt) : undefined,
    }));
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}

/**
 * Get a specific plan by ID
 */
export function getPlanById(id: string): FitnessPlan | null {
  const plans = getSavedPlans();
  return plans.find((p) => p.id === id) || null;
}

/**
 * Delete a plan from localStorage
 */
export function deletePlan(id: string): void {
  if (typeof window === "undefined") return;

  const plans = getSavedPlans().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

/**
 * Clear all saved plans
 */
export function clearAllPlans(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

