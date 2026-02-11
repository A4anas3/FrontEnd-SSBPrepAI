/**
 * Check ADMIN role
 * @param {Object} user - Supabase user object
 */
export const isAdmin = (user) => {
  if (!user) return false;
  return (
    user.user_metadata?.role === "ADMIN" ||
    user.app_metadata?.role === "ADMIN" ||
    user.role === "ADMIN"
  );
};

/**
 * Get all roles
 * @param {Object} user - Supabase user object
 */
export const getUserRoles = (user) => {
  if (!user) return [];
  return (
    user.user_metadata?.roles ||
    user.app_metadata?.roles ||
    []
  );
};

/**
 * Get single role string
 * @param {Object} user - Supabase user object
 */
export const getUserRole = (user) => {
  if (!user) return null;
  return (
    user.user_metadata?.role ||
    user.app_metadata?.role ||
    null
  );
};
