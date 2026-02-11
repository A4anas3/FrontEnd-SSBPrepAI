import { getAccessToken } from "@/lib/authApi";

/**
 * Decode JWT payload safely
 */
const getPayload = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    console.warn("JWT decode failed:", err);
    return null;
  }
};

/**
 * Check ADMIN role (UI only)
 */
export const isAdmin = () => {
  const payload = getPayload();
  if (!payload) return false;

  return (
    payload?.user_metadata?.role === "ADMIN" ||
    payload?.app_metadata?.role === "ADMIN" ||
    payload?.role === "ADMIN"
  );
};

/**
 * Get all roles
 */
export const getUserRoles = () => {
  const payload = getPayload();
  if (!payload) return [];

  return (
    payload?.user_metadata?.roles ||
    payload?.app_metadata?.roles ||
    []
  );
};

/**
 * Get single role string
 */
export const getUserRole = () => {
  const payload = getPayload();
  if (!payload) return null;

  return (
    payload?.user_metadata?.role ||
    payload?.app_metadata?.role ||
    null
  );
};
