import { getAccessToken } from "@/lib/authApi";

/**
 * Safely decode JWT
 */
const decodeToken = () => {
  const token = getAccessToken();

  if (!token) return null;

  // if token is object like { access_token: "..."}
  const jwt = typeof token === "string" ? token : token?.access_token;

  if (!jwt || typeof jwt !== "string") return null;

  try {
    const payload = JSON.parse(atob(jwt.split(".")[1]));
    return payload;
  } catch (err) {
    console.warn("Token decode failed:", err);
    return null;
  }
};

/**
 * Check admin role
 */
export const isAdmin = () => {
  const payload = decodeToken();
  if (!payload) return false;

  return payload.realm_access?.roles?.includes("ADMIN") || false;
};

/**
 * Get all roles
 */
export const getUserRoles = () => {
  const payload = decodeToken();
  if (!payload) return [];

  return payload.realm_access?.roles || [];
};
