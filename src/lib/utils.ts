
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type FormatDateOptions = {
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  year?: "numeric" | "2-digit";
  day?: "numeric" | "2-digit";
};

export function formatDate(date: Date, options: FormatDateOptions = {}) {
  const defaultOptions: FormatDateOptions = {
    month: "short",
    year: "numeric"
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    return new Intl.DateTimeFormat("en-US", mergedOptions).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}
