import { format, formatDistanceToNow } from "date-fns";

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "PPp");
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format weight (kg or lbs)
 */
export function formatWeight(weight: number, unit: "kg" | "lbs" = "kg"): string {
  return `${weight} ${unit}`;
}

/**
 * Format height (cm or ft/in)
 */
export function formatHeight(height: number, unit: "cm" | "ft" = "cm"): string {
  if (unit === "cm") {
    return `${height} cm`;
  }
  // Convert cm to ft/in if needed
  const totalInches = height / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

