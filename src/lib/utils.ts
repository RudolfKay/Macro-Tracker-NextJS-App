import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Shows a toast notification for API errors in a consistent way.
 * @param toast - The toast function from useToast
 * @param error - The error object (can be string, Error, or API error response)
 * @param fallbackMessage - Optional fallback message
 */
export const showApiErrorToast = (
  toast: (args: { title: string; description?: string; variant?: "default" | "destructive" | null }) => void,
  error: unknown,
  fallbackMessage = "An unexpected error occurred."
) => {
  let message = fallbackMessage;
  if (typeof error === "string") message = error;
  else if (error && typeof error === "object") {
    if ("message" in error && typeof (error as { message: string }).message === "string") {
      message = (error as { message: string }).message;
    } else if ("error" in error && typeof (error as { error: string }).error === "string") {
      message = (error as { error: string }).error;
    }
  }
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};
