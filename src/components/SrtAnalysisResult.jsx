import { useState } from "react";
import { CheckCircle, Star, TrendingUp, BookOpen, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

// Helper for grade badge color
const getGradeColor = (grade) => {
    if (!grade) return "bg-gray-100 text-gray-600";
    const g = grade.toLowerCase().trim();
    if (g.includes("excellent")) return "bg-green-100 text-green-700 border-green-300";
    if (g.includes("good")) return "bg-blue-100 text-blue-700 border-blue-300";
    if (g.includes("average")) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    if (g.includes("poor") || g.includes("bad")) return "bg-red-100 text-red-700 border-red-300";
    if (g === "a") return "bg-green-100 text-green-700 border-green-300";
    if (g === "b") return "bg-blue-100 text-blue-700 border-blue-300";
    if (g === "c") return "bg-yellow-100 text-yellow-700 border-yellow-300";
    if (g === "d" || g === "f") return "bg-red-100 text-red-700 border-red-300";
    return "bg-purple-100 text-purple-700 border-purple-300";
};

/**
 * Generic AI Analysis Result display component with collapsible items.
 *
 * Props:
 *   - analysisResult  : { overall: string, items: object[] }
 *   - onBack          : () => void
 *   - backLabel       : string (default "Back")
 *   - title           : string (default "AI Analysis Report")
 *   - breakdownTitle  : string (default "Situation-wise Breakdown")
 *
 *   Field mapping (customize for SRT / WAT / TAT etc.):
 *   - itemNumber      : key for item number,     default "situationNo"
 *   - itemLabel       : key for header label,     default "situation"
 *   - itemFallback    : fallback prefix,          default "Situation"
 *   - responseKey     : key for user response,    default "reaction"
 *   - responseLabel   : display label,            default "Your Reaction"
 *   - idealKey        : key for ideal answer,     default "possibleAnswer"
 *   - idealLabel      : display label,            default "Ideal Response"
 *   - imageKey        : key for image URL,         default null (no image)
 */
const SrtAnalysisResult = ({
    analysisResult,
    onBack,
    backLabel = "Back",
    title = "AI Analysis Report",
    breakdownTitle = "Situation-wise Breakdown",
    // Field mapping with defaults (SRT)
    itemNumber = "situationNo",
    itemLabel = "situation",
    itemFallback = "Situation",
    responseKey = "reaction",
    responseLabel = "Your Reaction",
    idealKey = "possibleAnswer",
    idealLabel = "Ideal Response",
    imageKey = null,
}) => {
    const [openIndex, setOpenIndex] = useState(null);

    if (!analysisResult) return null;

    const toggleItem = (idx) => {
        setOpenIndex((prev) => (prev === idx ? null : idx));
    };

    return (
        <div className="mt-4 space-y-6 max-w-4xl mx-auto">
            {/* Overall Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                    <Star className="w-8 h-8 text-yellow-300" />
                    <h2 className="text-2xl font-bold">{title}</h2>
                </div>
                <p className="text-blue-100 text-lg leading-relaxed">
                    {analysisResult.overall || "Analysis complete."}
                </p>
            </div>

            {/* Per-item Analysis */}
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <BookOpen size={22} /> {breakdownTitle}
            </h3>

            {analysisResult.items?.map((item, idx) => {
                const isOpen = openIndex === idx;
                const num = item[itemNumber] || idx + 1;
                const label = item[itemLabel] || `${itemFallback} ${idx + 1}`;
                const response = item[responseKey];
                const ideal = item[idealKey];
                const imageUrl = imageKey ? item[imageKey] : null;

                return (
                    <div key={idx} className="bg-white border rounded-xl shadow-sm overflow-hidden">
                        {/* Collapsible Header */}
                        <button
                            onClick={() => toggleItem(idx)}
                            className="w-full bg-gray-50 px-6 py-4 flex items-center justify-between border-b cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                            <span className="font-semibold text-gray-800 text-left">
                                #{num} — {label}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 text-sm font-bold rounded-full border ${getGradeColor(item.grade)}`}>
                                    {item.grade || "N/A"}
                                </span>
                                {isOpen ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
                            </div>
                        </button>

                        {/* Collapsible Body */}
                        <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
                        >
                            <div className="p-6 space-y-4">
                                {/* Image (TAT etc.) */}
                                {imageUrl && (
                                    <div className="flex justify-center">
                                        <img
                                            src={imageUrl}
                                            alt={`Picture ${num}`}
                                            className="max-h-60 rounded-xl border shadow-sm object-contain"
                                        />
                                    </div>
                                )}
                                {/* User Response */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{responseLabel}</p>
                                    <p className="text-gray-700 bg-gray-50 rounded-lg p-3 border text-sm italic">
                                        {response || <span className="text-gray-400">No response given</span>}
                                    </p>
                                </div>

                                {/* Improvement */}
                                {item.improvement && (
                                    <div>
                                        <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                                            <TrendingUp size={14} /> Improvement Suggestion
                                        </p>
                                        <p className="text-gray-700 bg-amber-50 rounded-lg p-3 border border-amber-200 text-sm">
                                            {item.improvement}
                                        </p>
                                    </div>
                                )}

                                {/* Ideal Answer */}
                                {ideal && (
                                    <div>
                                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                                            <CheckCircle size={14} /> {idealLabel}
                                        </p>
                                        <p className="text-gray-700 bg-green-50 rounded-lg p-3 border border-green-200 text-sm">
                                            {ideal}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Back button */}
            {onBack && (
                <div className="flex justify-center pt-4 pb-8">
                    <button
                        onClick={onBack}
                        className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
                    >
                        <ArrowLeft size={18} /> {backLabel}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SrtAnalysisResult;
