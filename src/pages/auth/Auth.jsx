import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

/**
 * Auth Modal - Handles Login, Signup, and Forgot Password
 */
const Auth = ({ initialMode = "login", onClose }) => {
  const [mode, setMode] = useState(initialMode); // login, signup, forgot-password

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Welcome Back";
      case "signup":
        return "Create Account";
      case "forgot-password":
        return "Reset Password";
      default:
        return "Welcome";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "login":
        return "Login to continue your preparation";
      case "signup":
        return "Join us and start your SSB journey";
      case "forgot-password":
        return "Enter your email to reset your password";
      default:
        return "";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md p-8 bg-white rounded-2xl 
        shadow-xl border border-yellow-200 space-y-6"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-yellow-600 mb-1">
            SSB Preparation Platform
          </p>

          <h2 className="text-3xl font-semibold text-gray-900">
            {getTitle()}
          </h2>

          <div className="mt-2 h-1 w-12 mx-auto bg-yellow-400 rounded-full"></div>

          <p className="text-sm text-gray-600 mt-3">{getSubtitle()}</p>
        </div>

        {/* Content */}
        <div className="mt-6">
          {mode === "login" && (
            <LoginForm
              onForgotPassword={() => setMode("forgot-password")}
              onSuccess={onClose}
            />
          )}
          {mode === "signup" && <SignupForm onSuccess={onClose} />}
          {mode === "forgot-password" && (
            <ForgotPasswordForm onBack={() => setMode("login")} />
          )}
        </div>

        {/* Toggle Mode Footer */}
        {mode !== "forgot-password" && (
          <p className="text-sm text-center text-gray-600 mt-4">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-yellow-600 font-medium hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-yellow-600 font-medium hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
