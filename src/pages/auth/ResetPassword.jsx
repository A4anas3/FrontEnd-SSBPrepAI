import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle, Home } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleUpdate = async () => {
        if (!password) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please enter a new password",
            });
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            password: password,
        });
        setLoading(false);

        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        } else {
            setSuccess(true);
            toast({
                title: "Success",
                description: "Password updated successfully",
            });
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-2xl text-center">
                    {/* Creating a nice glowing effect behind the icon */}
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                        <CheckCircle className="relative w-16 h-16 text-green-500 mx-auto" />
                    </div>

                    <h1 className="text-3xl font-bold text-foreground mb-3 font-display">
                        Password Updated!
                    </h1>

                    <p className="text-muted-foreground mb-8 text-lg">
                        Your password has been successfully updated. <br />
                        You can now log in with your new password.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-secondary/50 hover:bg-secondary text-secondary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <Home size={18} />
                            Go to Website
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-2xl text-center">
                {/* Creating a nice glowing effect behind the icon */}
                <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                    <Lock className="relative w-16 h-16 text-primary mx-auto" />
                </div>

                <h2 className="text-3xl font-bold text-foreground mb-3 font-display">
                    Set New Password
                </h2>

                <p className="text-muted-foreground mb-8 text-lg">
                    Enter your new password below.
                </p>

                <div className="space-y-4 text-left">
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-xl bg-background border border-input focus:border-primary outline-none transition-all"
                    />

                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </div>
        </div>
    );
}
