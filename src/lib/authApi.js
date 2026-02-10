import { supabase } from "@/lib/supabaseClient";

const REDIRECT_URI = window.location.origin + "/auth/callback";

/* 🔐 LOGIN (PKCE secure redirect) */
export const login = async () => {
  localStorage.setItem(
    "return_url",
    window.location.pathname + window.location.search,
  );

  await supabase.auth.signInWithOAuth({
    provider: "google", // or "email" later
    options: {
      redirectTo: REDIRECT_URI,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
};

/* 🆕 SIGNUP (same flow) */
export const signup = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: REDIRECT_URI,
    },
  });
};

/* 🔁 CALLBACK HANDLER */
export const handleAuthCallback = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;

  const returnUrl = localStorage.getItem("return_url") || "/";
  localStorage.removeItem("return_url");

  window.location.href = returnUrl;
};

/* 🔑 ACCESS TOKEN */
export const getAccessToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
};

/* 🔓 LOGOUT */
export const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
};
