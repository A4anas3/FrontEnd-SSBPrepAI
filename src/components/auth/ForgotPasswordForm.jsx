import { useState } from "react";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/authApi";
import { toast } from "sonner";

const ForgotPasswordForm = ({ onBack }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await resetPassword(email);
            setSubmitted(true);
            toast.success("Reset link sent!");
        } catch (error) {
            toast.error(error.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center space-y-4 py-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
                <p className="text-sm text-gray-500">
                    We've sent a password reset link to <strong>{email}</strong>
                </p>
                <Button
                    onClick={onBack}
                    variant="outline"
                    className="mt-4 w-full"
                >
                    Back to Login
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
                Enter your email address and we'll send you a link to reset your password.
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder="you@example.com"
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                    disabled={loading}
                >
                    {loading ? "Sending Link..." : "Send Reset Link"}
                </Button>
            </form>
            <button
                type="button"
                onClick={onBack}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-900 mt-2"
            >
                Back to Login
            </button>
        </div>
    );
};

export default ForgotPasswordForm;
