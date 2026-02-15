import { useState } from "react";
import { PenLine, Scan, Mic, ArrowLeft } from "lucide-react";

/**
 * Reusable component for Test Submission Methods.
 * @param {ReactNode} children - The form content to display in "WRITE" mode.
 * @param {Function} onScanSubmit - Callback for Scan submission.
 * @param {Function} onSpeakSubmit - Callback for Speak submission.
 */
const TestSubmission = ({
    children,
    onScanSubmit,
    onSpeakSubmit,
    enableWrite = true,
    enableScan = true,
    enableSpeak = true
}) => {
    const [submissionType, setSubmissionType] = useState(null); // null | WRITE | SCAN | SPEAK

    if (!submissionType) {
        /* 🔹 SELECTION SCREEN */
        return (
            <div className="space-y-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    How do you want to submit?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* WRITE */}
                    {enableWrite && (
                        <button
                            onClick={() => setSubmissionType("WRITE")}
                            className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
                        >
                            <div className="p-4 bg-blue-100 rounded-full text-blue-600">
                                <PenLine size={32} />
                            </div>
                            <span className="font-semibold text-gray-700">Write Story</span>
                        </button>
                    )}

                    {/* SCAN */}
                    {enableScan && (
                        <button
                            onClick={() => setSubmissionType("SCAN")}
                            className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
                        >
                            <div className="p-4 bg-purple-100 rounded-full text-purple-600">
                                <Scan size={32} />
                            </div>
                            <span className="font-semibold text-gray-700">Scan Image</span>
                        </button>
                    )}

                    {/* SPEAK */}
                    {enableSpeak && (
                        <button
                            onClick={() => setSubmissionType("SPEAK")}
                            className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition"
                        >
                            <div className="p-4 bg-green-100 rounded-full text-green-600">
                                <Mic size={32} />
                            </div>
                            <span className="font-semibold text-gray-700">Speak Story</span>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    /* 🔹 SUBMISSION FORMS */
    return (
        <div className="w-full">
            {/* BACK BUTTON */}
            <button
                onClick={() => setSubmissionType(null)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"
            >
                <ArrowLeft size={20} /> Change Method
            </button>

            {/* ✍️ WRITE MODE */}
            {submissionType === "WRITE" && children}

            {/* 📷 SCAN MODE */}
            {submissionType === "SCAN" && (
                <div className="text-center py-10 fade-in">
                    <div className="flex justify-center mb-4">
                        <Scan size={48} className="text-purple-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">
                        Upload Handwritten Story
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Capture a photo of your paper and upload it here.
                    </p>
                    <input type="file" className="block mx-auto mb-4" />
                    <button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
                        onClick={onScanSubmit}
                    >
                        Submit Scan
                    </button>
                </div>
            )}

            {/* 🎙️ SPEAK MODE */}
            {submissionType === "SPEAK" && (
                <div className="text-center py-10 fade-in">
                    <div className="flex justify-center mb-4">
                        <Mic size={48} className="text-green-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">
                        Record Your Story
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Press the button to start recording.
                    </p>
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
                        onClick={onSpeakSubmit}
                    >
                        Start Recording
                    </button>
                </div>
            )}
        </div>
    );
};

export default TestSubmission;
