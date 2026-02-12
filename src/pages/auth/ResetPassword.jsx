import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Lock, CheckCircle, Home } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const { toast } = useToast();

    // 🔥 IMPORTANT for Supabase v2
    useEffect(() => {
        const handleRecovery = async () => {
            const hash = window.location.hash;

            if (hash && hash.includes("access_token")) {
                const { error } = await supabase.auth.exchangeCodeForSession(
                    window.location.href
                );

                if (error) {
                    toast({
                        variant: "destructive",
                        title: "Link expired",
                        description: "Reset link expired. Request again.",
                    });
                }
            }
        };

        handleRecovery();
    }, []);

    const handleUpdate = async () => {
        if (!password) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Enter new password",
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

    // ✅ SUCCESS SCREEN
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="max-w-md w-full bg-card border p-8 rounded-2xl shadow-2xl text-center">

                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
                        <CheckCircle className="relative w-16 h-16 text-green-500 mx-auto" />
                    </div>

                    <h1 className="text-3xl font-bold mb-3">
                        Password Updated!
                    </h1>

                    <p className="mb-8 text-muted-foreground">
                        You can now login with new password
                    </p>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl 
                       shadow-lg shadow-yellow-400/40 hover:shadow-yellow-500/60"
                    >
                        <Home size={18} className="inline mr-2" />
                        Go to Website
                    </button>
                </div>
            </div>
        );
    }

    // 🔐 FORM
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full bg-card border p-8 rounded-2xl shadow-2xl text-center">

                <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full"></div>
                    <Lock className="relative w-16 h-16 text-yellow-400 mx-auto" />
                </div>

                <h2 className="text-3xl font-bold mb-3">
                    Set New Password
                </h2>

                <p className="mb-8 text-muted-foreground">
                    Enter your new password
                </p>

                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-xl border mb-4"
                />

                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 
                     hover:from-yellow-500 hover:to-amber-600 
                     text-black font-bold py-3 rounded-xl
                     shadow-[0_0_25px_rgba(251,191,36,0.5)]
                     hover:shadow-[0_0_35px_rgba(251,191,36,0.7)]
                     transition-all duration-300"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>
            </div>
        </div>
    );
}
