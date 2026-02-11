import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { login } from "@/lib/authApi";

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      login();
    }
  }, [loading, isAuthenticated]);

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return null;

  return children;
};

export default RequireAuth;
