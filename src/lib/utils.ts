import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate text color (black or white) based on background color brightness
export function getTextColor(bgColor: string | null | undefined): string {
  if (!bgColor) return "#000000"; // Default to black if no color

  // Remove # if present
  const hex = bgColor.replace("#", "");

  // Handle invalid hex colors
  if (hex.length !== 6) return "#000000";

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance (perceived brightness)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}
