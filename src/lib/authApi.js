import { supabase } from "@/lib/supabaseClient";

const REDIRECT_URI = window.location.origin + "/auth/callback";

/* 🔐 LOGIN (Google OAuth) */
export const login = async () => {
  localStorage.setItem(
    "return_url",
    window.location.pathname + window.location.search,
  );

  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: REDIRECT_URI,
    },
  });
};

/* 🆕 SIGNUP */
export const signup = async () => {
  await login(); // same flow
};

/* 🔁 CALLBACK HANDLER */
export const handleAuthCallback = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error(error);
    window.location.href = "/";
    return;
  }

  const returnUrl = localStorage.getItem("return_url") || "/";
  localStorage.removeItem("return_url");
  window.location.href = returnUrl;
};

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};


/* 🔓 LOGOUT */
export const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
};

/* 🔴 ADD THIS (important for old imports) */
export const refreshAccessToken = async () => { };
export const isTokenExpiringSoon = () => false;
