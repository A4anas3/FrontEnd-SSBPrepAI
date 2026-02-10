import { useEffect, useRef } from "react";
import { exchangeCodeForToken, isValidRedirectUrl } from "@/lib/authApi";

const AuthCallback = () => {
  const ranOnce = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (ranOnce.current) return;
    ranOnce.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    // Get return URL (only used if valid)
    const returnUrl = localStorage.getItem("return_url");

    if (!code) {
      window.location.href = "/";
      return;
    }

    exchangeCodeForToken(code, state)
      .then(() => {
        // 🔄 Validate and get return URL - prevent open redirect
        const isValid = isValidRedirectUrl(returnUrl);
        const finalUrl = isValid ? returnUrl : "/";
        localStorage.removeItem("return_url");
        window.location.href = finalUrl;
      })
      .catch((_err) => {
        // Only redirect to home if we really failed
        // Don't log error details as they may contain sensitive info
        if (import.meta.env.DEV) {
          console.error("[AuthCallback] Authentication failed");
        }
        localStorage.removeItem("return_url");
        window.location.href = "/";
      });
  }, []);

  return <p>Signing you in securely…</p>;
};

export default AuthCallback;
