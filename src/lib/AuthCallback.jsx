import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthCallback = () => {
  useEffect(() => {
    const handle = async () => {
      const { data } = await supabase.auth.getSession();

      const returnUrl = localStorage.getItem("return_url") || "/";
      localStorage.removeItem("return_url");

      if (data.session) {
        window.location.href = returnUrl;
      } else {
        window.location.href = "/";
      }
    };

    handle();
  }, []);

  return <p>Signing you in...</p>;
};

export default AuthCallback;
