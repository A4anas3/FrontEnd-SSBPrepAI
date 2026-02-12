import { useAuth } from "@/lib/AuthContext";

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  // if not logged in → show nothing OR custom UI
  if (!isAuthenticated) {
    return <p>Please login to continue</p>;
    // OR return <Auth /> if you want modal
    // OR navigate("/auth")
  }

  return children;
};

export default RequireAuth;
