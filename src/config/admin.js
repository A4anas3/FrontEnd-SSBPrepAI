/**
 * Check ADMIN role
 * @param {Object} user - Supabase user object
 */
export const isAdmin = (user) => {
  if (!user) return false;
  // Only trust app_metadata — user_metadata is editable by the user
  return user.app_metadata?.role === "ADMIN";
};

/**
 * Get all roles
 * @param {Object} user - Supabase user object
 */
export const getUserRoles = (user) => {
  if (!user) return [];
  // Only trust app_metadata — user_metadata is editable by the user
  return user.app_metadata?.roles || [];
};

/**
 * Get single role string
 * @param {Object} user - Supabase user object
 */
export const getUserRole = (user) => {
  if (!user) return null;
  // Only trust app_metadata — user_metadata is editable by the user
  return user.app_metadata?.role || null;
};
