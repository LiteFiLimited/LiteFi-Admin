import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a more readable format
 * @param dateString ISO date string
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }
): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

/**
 * Format a number as currency
 * @param amount Amount in smallest currency unit (e.g., kobo for NGN)
 * @param currency Currency code (default: NGN)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = "NGN"
): string {
  try {
    // Convert from smallest currency unit to standard unit
    // For NGN, convert from kobo to naira (divide by 100)
    const convertedAmount = currency === "NGN" ? amount / 100 : amount;
    
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${currency} ${amount}`;
  }
}
