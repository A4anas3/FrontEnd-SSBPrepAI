import { getAccessToken } from "@/lib/authApi";

export const isAdmin = () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Supabase role location
    return (
      payload?.user_metadata?.role === "admin" ||
      payload?.role === "admin"
    );
  } catch (err) {
    console.warn("Failed to check admin role:", err);
    return false;
  }
};

export const getUserRoles = () => {
  const token = getAccessToken();
  if (!token) return [];

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.user_metadata?.roles || [];
  } catch {
    return [];
  }
};
