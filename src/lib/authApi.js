import { supabase } from "@/lib/supabaseClient";

const REDIRECT_URI = window.location.origin + "/auth/callback";

/* 🔐 LOGIN WITH OAUTH */
export const login = async (provider = "google") => {
  localStorage.setItem(
    "return_url",
    window.location.pathname + window.location.search
  );

  await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: REDIRECT_URI },
  });
};

/* 🔐 LOGIN WITH PASSWORD */
export const loginWithPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

/* 🆕 SIGNUP WITH PASSWORD */
export const signupWithPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: REDIRECT_URI,
    },
  });
  if (error) throw error;
  return data;
};

/* 🔄 RESET PASSWORD */
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  });
  if (error) throw error;
  return data;
};

/* 🆕 SIGNUP (same flow as login for OAuth) */
export const signup = async () => {
  await login();
};

/* 🔓 LOGOUT */
export const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
};


