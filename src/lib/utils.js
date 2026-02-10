import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function toSecureUrl(url) {
  if (!url) return null; // ✅ Return null to prevent browser warning
  return url.replace("http://", "https://");
}

/**
 * Map backend error codes to user-friendly messages
 * Prevents exposing sensitive API/backend information
 */
export const getErrorMessage = (error) => {
  if (!error) return "Something went wrong. Please try again.";

  const errorCode = error?.response?.data?.code || error?.code;
  const status = error?.response?.status;

  // Map specific error codes to friendly messages
  const errorMap = {
    DUPLICATE_KEY: "This item already exists. Please use a different value.",
    VALIDATION_ERROR: "Please check your input and try again.",
    UNAUTHORIZED: "You do not have permission to perform this action.",
    FORBIDDEN: "Access denied. Please contact support if you need help.",
    NOT_FOUND: "The requested resource was not found.",
    SERVER_ERROR:
      "Server error. Our team has been notified. Please try again later.",
    NETWORK_ERROR: "Network error. Please check your connection and try again.",
  };

  // Map HTTP status codes
  const statusMap = {
    400: "Invalid request. Please check your input.",
    401: "Your session has expired. Please sign in again.",
    403: "You do not have permission to access this resource.",
    404: "The requested resource was not found.",
    409: "This item already exists. Please use a different value.",
    500: "Server error. Please try again later.",
    503: "Service temporarily unavailable. Please try again later.",
  };

  // Use mapped message or status-based message
  return (
    errorMap[errorCode] ||
    statusMap[status] ||
    "Something went wrong. Please try again."
  );
};
