import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthCallback = () => {
  const ranOnce = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (ranOnce.current) return;
    ranOnce.current = true;

    const handleCallback = async () => {
      try {
        // Supabase handles the callback automatically
        // Just get the session and redirect
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const returnUrl = localStorage.getItem("return_url") || "/";
        localStorage.removeItem("return_url");

        if (session) {
          window.location.href = returnUrl;
        } else {
          window.location.href = "/";
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error("[AuthCallback] Authentication failed", error);
        }
        localStorage.removeItem("return_url");
        window.location.href = "/";
      }
    };

    handleCallback();
  }, []);

  return <p>Signing you in securely…</p>;
};

export default AuthCallback;
