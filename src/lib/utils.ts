import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a more readable format (hydration-safe)
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
    
    // For hydration safety, use a consistent format that doesn't depend on locale
    if (typeof window === 'undefined') {
      // Server-side: use consistent format
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    }
    
    // Client-side: use Intl for better formatting
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

/**
 * Format a date string to a simple readable format (always consistent)
 * @param dateString ISO date string
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatDateSafe(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
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
