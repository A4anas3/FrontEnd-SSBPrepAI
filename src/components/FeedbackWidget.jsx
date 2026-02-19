import { useState, useEffect } from "react";
import { MessageSquarePlus, X, Send, Star } from "lucide-react";
import { submitFeedback } from "@/features/feedback/feedbackApi";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

const FeedbackWidget = () => {
    const { isAuthenticated } = useAuth();
    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState("");
    const [improvement, setImprovement] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showLabel, setShowLabel] = useState(false);

    // Animate "Send Feedback" label every 4 seconds
    useEffect(() => {
        if (!isAuthenticated) return;
        const interval = setInterval(() => {
            setShowLabel(true);
            setTimeout(() => setShowLabel(false), 2000);
        }, 4000);
        setShowLabel(true);
        const hideTimeout = setTimeout(() => setShowLabel(false), 2000);
        return () => {
            clearInterval(interval);
            clearTimeout(hideTimeout);
        };
    }, [isAuthenticated]);

    if (!isAuthenticated) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !improvement.trim()) {
            toast.error("Please fill in both fields.");
            return;
        }
        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }

        setLoading(true);
        try {
            await submitFeedback({ subject, improvement, rating });
            toast.success("Thank you for your feedback! 🎉");
            setSubject("");
            setImprovement("");
            setRating(0);
            setOpen(false);
        } catch (err) {
            toast.error("Failed to submit feedback. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 🗨️ Floating Button with animated label */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
                <div
                    className={`bg-gray-800 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow-lg transition-all duration-500 ${showLabel
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2 pointer-events-none"
                        }`}
                >
                    Send Feedback 💬
                    <div className="absolute -bottom-1 right-5 w-2 h-2 bg-gray-800 rotate-45" />
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-xl transition-all hover:scale-110 active:scale-95"
                    title="Send Feedback"
                >
                    <MessageSquarePlus size={24} />
                </button>
            </div>

            {/* 📝 Modal Overlay */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    <form
                        onSubmit={handleSubmit}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 animate-in slide-in-from-bottom-4 duration-300 z-10"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <MessageSquarePlus size={22} className="text-primary" />
                                Send Feedback
                            </h2>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Help us improve! Share your suggestions or report issues.
                        </p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="e.g. Bug in TAT test, Feature request..."
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
                                maxLength={100}
                            />
                        </div>

                        {/* ⭐ Star Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-transform hover:scale-125 active:scale-95"
                                    >
                                        <Star
                                            size={28}
                                            className={`transition-colors ${star <= (hoverRating || rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    </button>
                                ))}
                                {rating > 0 && (
                                    <span className="text-sm text-gray-500 ml-2 self-center">
                                        {rating}/5
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback / Improvement</label>
                            <textarea
                                value={improvement}
                                onChange={(e) => setImprovement(e.target.value)}
                                placeholder="Describe what can be improved, any bugs you found, or features you'd like..."
                                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm min-h-[120px] resize-none focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none"
                                maxLength={1000}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                <>
                                    <Send size={18} /> Submit Feedback
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default FeedbackWidget;
