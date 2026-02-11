import { useNavigate } from "react-router-dom";
import { CheckCircle, Home } from "lucide-react";

export default function VerifySuccess() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-2xl text-center">
                {/* Creating a nice glowing effect behind the icon */}
                <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                    <CheckCircle className="relative w-16 h-16 text-green-500 mx-auto" />
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-3 font-display">
                    Email Verified!
                </h1>

                <p className="text-muted-foreground mb-8 text-lg">
                    Your email has been successfully verified. <br />
                    You can now access your account.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-accent/25 flex items-center justify-center gap-2"
                    >
                        Go to Login
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-secondary/50 hover:bg-secondary text-secondary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Home size={18} />
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
