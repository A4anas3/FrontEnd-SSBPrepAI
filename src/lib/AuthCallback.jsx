import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handle = async () => {

      const params = new URLSearchParams(window.location.hash.substring(1)); // hash params
      const queryParams = new URLSearchParams(window.location.search); // query params

      const errorDescription = params.get("error_description") || queryParams.get("error_description");
      if (errorDescription) {
        setError(errorDescription);
        setTimeout(() => navigate("/"), 3000);
        return;
      }


     

      await supabase.auth.refreshSession();

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const returnUrl = localStorage.getItem("return_url") || "/";
        localStorage.removeItem("return_url");
        navigate(returnUrl);
      } else {
        // If we got here and no session, something failed
        // Try exchange code if query param exists (for some flows)
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) {
            const returnUrl = localStorage.getItem("return_url") || "/";
            localStorage.removeItem("return_url");
            navigate(returnUrl);
            return;
          }
        }
        navigate("/");
      }
    };

    handle();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-red-500 font-bold">Authentication Error</p>
        <p className="text-muted-foreground">{error}</p>
        <p className="text-sm">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Verifying access...</p>
    </div>
  );
};

export default AuthCallback;
