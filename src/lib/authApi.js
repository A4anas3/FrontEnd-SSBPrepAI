import axios from "axios";

const KEYCLOAK_URL =
  import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:18080";
const REALM = import.meta.env.VITE_KEYCLOAK_REALM || "ssb-realm";
const CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "ssb-client";

const REDIRECT_URI = window.location.origin + "/auth/callback";
const TOKEN_URL = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

/* 🔐 PKCE Helper Functions */

const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
};

const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64URLEncode(new Uint8Array(hash));
};

const base64URLEncode = (buffer) => {
  return btoa(String.fromCharCode(...buffer))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const generateState = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
};

/* 🔐 VALIDATE REDIRECT - Prevent open redirect vulnerabilities */
export const isValidRedirectUrl = (url) => {
  if (!url) return false;

  try {
    // Only allow relative URLs or same-origin URLs
    if (url.startsWith("/")) {
      // Relative URL - validate it doesn't contain protocol/host
      return !url.includes("://") && !url.includes("//");
    }

    // Absolute URL must match current origin
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin;
  } catch {
    return false;
  }
};

/* 🔐 LOGIN with PKCE */
export const login = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();

  sessionStorage.setItem("pkce_code_verifier", codeVerifier);
  sessionStorage.setItem("oauth_state", state);

  // 🔄 Store current path to return after login (localStorage for reliability)
  localStorage.setItem(
    "return_url",
    window.location.pathname + window.location.search,
  );

  window.location.href =
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth` +
    `?client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&scope=openid profile email offline_access` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256` +
    `&state=${state}`;
};

/* 🆕 SIGNUP with PKCE */
export const signup = async () => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();

  sessionStorage.setItem("pkce_code_verifier", codeVerifier);
  sessionStorage.setItem("oauth_state", state);

  window.location.href =
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/registrations` +
    `?client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&scope=openid profile email offline_access` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256` +
    `&state=${state}`;
};

/* 🔁 CALLBACK - Exchange code for tokens with PKCE (direct to Keycloak) */
export const exchangeCodeForToken = async (code, returnedState) => {
  const codeVerifier = sessionStorage.getItem("pkce_code_verifier");
  const storedState = sessionStorage.getItem("oauth_state");

  // Verify CSRF state
  if (!storedState || storedState !== returnedState) {
    sessionStorage.removeItem("pkce_code_verifier");
    sessionStorage.removeItem("oauth_state");
    throw new Error("Invalid state parameter. Possible CSRF attack.");
  }

  if (!codeVerifier) {
    throw new Error("PKCE code verifier not found. Please login again.");
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const res = await axios.post(TOKEN_URL, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  // Store tokens in localStorage
  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("id_token", res.data.id_token);

  if (res.data.refresh_token) {
    localStorage.setItem("refresh_token", res.data.refresh_token);
  }

  if (res.data.expires_in) {
    const expiresAt = Date.now() + res.data.expires_in * 1000;
    localStorage.setItem("token_expires_at", expiresAt.toString());
  }

  // Clean up PKCE
  sessionStorage.removeItem("pkce_code_verifier");
  sessionStorage.removeItem("oauth_state");

  return res.data;
};

/* 🔄 REFRESH TOKEN */
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  try {
    const res = await axios.post(TOKEN_URL, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    localStorage.setItem("access_token", res.data.access_token);

    if (res.data.id_token) {
      localStorage.setItem("id_token", res.data.id_token);
    }

    if (res.data.refresh_token) {
      localStorage.setItem("refresh_token", res.data.refresh_token);
    }

    if (res.data.expires_in) {
      const expiresAt = Date.now() + res.data.expires_in * 1000;
      localStorage.setItem("token_expires_at", expiresAt.toString());
    }

    return res.data.access_token;
  } catch (error) {
    clearAuthTokens();
    throw error;
  }
};

/* 🧹 Clear only auth tokens (preserve return_url) */
const clearAuthTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("id_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_expires_at");
};

/* ⏰ Check if token needs refresh (5 min buffer) */
export const isTokenExpiringSoon = () => {
  const token = localStorage.getItem("access_token");
  const expiresAt = localStorage.getItem("token_expires_at");

  if (!token || !expiresAt) return false;

  const bufferMs = 5 * 60 * 1000; // 5 minutes
  return Date.now() > parseInt(expiresAt) - bufferMs;
};

/* 🔓 LOGOUT */
export const logout = () => {
  const idToken = localStorage.getItem("id_token");

  clearAuthTokens();

  window.location.href =
    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout` +
    `?client_id=${CLIENT_ID}` +
    `&post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}` +
    (idToken ? `&id_token_hint=${idToken}` : "");
};

export const getAccessToken = () => localStorage.getItem("access_token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");
