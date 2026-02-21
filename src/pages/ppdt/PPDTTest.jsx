import Header from "@/components/Header";
import { toSecureUrl } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { usePPDTTestImages, useSubmitPPDT } from "@/hooks/usePPDTTest";
import TestSubmission from "@/components/TestSubmission";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

const IMAGE_TIME = 3;
const WRITE_TIME = 3; // 4 minutes

const PPDTTest = () => {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { data: images = [], isLoading } = usePPDTTestImages();
  const submitMutation = useSubmitPPDT();
  const { toast } = useToast();

  const image = images.find((img) => img.id === Number(imageId));

  const [phase, setPhase] = useState("IMAGE"); // IMAGE | WRITE | FORM
  const [timeLeft, setTimeLeft] = useState(IMAGE_TIME);

  const [storyText, setStoryText] = useState("");
  const [action, setAction] = useState("");
  const [characterCount, setCharacterCount] = useState("");
  const [mood, setMood] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);

  const tickAudio = useRef(null);

  /* ⏱️ TIMER (STOPS IN FORM PHASE) */
  useEffect(() => {
    if (phase === "FORM") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  /* 🔁 PHASE CONTROL */
  useEffect(() => {
    if (timeLeft > 0) return;

    if (phase === "IMAGE") {
      setPhase("WRITE");
      setTimeLeft(WRITE_TIME);
    } else if (phase === "WRITE") {
      setPhase("FORM");
    }
  }, [timeLeft, phase]);

  if (isLoading) {
    return <div className="py-32 text-center">Loading...</div>;
  }

  if (!image) {
    return <div className="py-32 text-center">Invalid image</div>;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <section className="pt-24 min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto max-w-5xl px-4">
        <h1 className="text-3xl font-bold mb-8">PPDT Test</h1>

        <div className="grid md:grid-cols-12 gap-6">
          {/* ⏱ LEFT – TIMER */}
          {/* ⏱ LEFT – TIMER */}
          {phase !== "FORM" && (
            <aside className="md:col-span-3 bg-white rounded-xl p-6 shadow-sm text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-red-600" />

              <div className="text-4xl font-mono text-red-600 my-4">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </div>

              <p className="text-sm text-muted-foreground">
                {phase === "IMAGE"
                  ? "Observe the picture carefully"
                  : phase === "WRITE"
                    ? "Writing time started"
                    : "Submit your response calmly"}
              </p>
            </aside>
          )}

          {/* 🖼️ / 📝 RIGHT PANEL */}
          <section className={phase === "FORM" ? "md:col-span-12" : "md:col-span-9"}>
            <div className="bg-white rounded-xl shadow-sm p-6 min-h-105 flex items-center justify-center">
              {/* IMAGE PHASE (BLURRED) */}
              {phase === "IMAGE" && (
                <img
                  src={toSecureUrl(image.imageUrl)}
                  alt="PPDT"
                  className="max-h-95 w-auto object-contain 
                             blur-[1.5px] contrast-90 brightness-95"
                />
              )}

              {/* WRITE NOTICE PHASE */}
              {phase === "WRITE" && (
                <div className="w-full h-90 flex flex-col items-center justify-center text-center border-2 border-dashed border-red-300 rounded-xl bg-red-50">
                  <div className="text-6xl mb-4 text-red-600">⏱️</div>

                  <h2 className="text-xl font-semibold text-red-700 mb-2">
                    Writing Time Started
                  </h2>

                  <p className="text-sm text-red-600 max-w-md">
                    Write your PPDT story on paper. Focus on perception,
                    initiative, leadership, and a positive outcome.
                  </p>

                  <p className="mt-4 text-xs text-muted-foreground">
                    Image has been removed intentionally (SSB format).
                  </p>
                </div>
              )}

              {/* FORM PHASE (NO TIMER) */}
              {phase === "FORM" && !showAnalysis && (
                <>
                  {submitMutation.isPending && <LoadingSpinner />}
                  <TestSubmission
                    onScanSubmit={() => setShowAnalysis(true)}
                    onSpeakSubmit={(text) => {
                      setStoryText(text);
                      submitMutation.mutate(
                        {
                          imageId: image.id,
                          storyText: text,
                          action: "Please see story text as action there present as voice is tranlated into text so little 5 10 percent error may be there",
                        },
                        {
                          onSuccess: () => setShowAnalysis(true),
                          onError: (error) => {
                            console.error("Voice submission error:", error);

                            // Extract error message
                            let errorMessage = error?.response?.data?.message || error?.message || "Could not submit your story.";

                            if (errorMessage.includes("Network Error") || errorMessage.includes("Connection refused")) {
                              errorMessage = "Server unreachable. Please ensure the backend is running.";
                            }

                            toast({
                              title: "Submission Failed",
                              description: errorMessage,
                              variant: "destructive", // Keeping variant for icon, but overriding colors
                              className: "bg-gray-900 text-white border-gray-800",
                              duration: 5000,
                            });
                          },
                        },
                      );
                    }}
                  >
                    {/* WRITE FORM CONTENT */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4">
                        Enter your PPDT response
                      </h2>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            No. of Characters
                          </label>
                          <input
                            type="number"
                            min="0"
                            className="w-full border rounded-lg p-3"
                            value={characterCount}
                            onChange={(e) => setCharacterCount(e.target.value)}
                            placeholder="e.g. 3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Mood
                          </label>
                          <select
                            className="w-full border rounded-lg p-3 bg-white"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                          >
                            <option value="">Select Mood</option>
                            <option value="Positive">Positive (+)</option>
                            <option value="Negative">Negative (-)</option>
                            <option value="Neutral">Neutral (0)</option>
                          </select>
                        </div>
                      </div>

                      <label className="block text-sm font-medium mb-1">
                        Action taken by main character
                      </label>
                      <textarea
                        className="w-full border rounded-lg p-3 mb-4"
                        rows={2}
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        placeholder="e.g. Rescuing the drowning person..."
                      />

                      <label className="block text-sm font-medium mb-1">
                        Story
                      </label>
                      <textarea
                        className="w-full border rounded-lg p-3 mb-6"
                        rows={8}
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                        placeholder="Write your story here..."
                      />

                      <button
                        onClick={() =>
                          submitMutation.mutate(
                            {
                              imageId: image.id,
                              storyText,
                              action,
                            },
                            { onSuccess: () => setShowAnalysis(true) },
                          )
                        }
                        disabled={submitMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
                      >
                        {submitMutation.isPending ? "Submitting..." : "Submit Story"}
                      </button>
                    </div>
                  </TestSubmission>
                </>
              )}
              {/* ✅ ANALYSIS / SUCCESS SCREEN */}
              {showAnalysis && (
                submitMutation.data?.status === "invalid" ? (
                  <div className="text-center py-10">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">
                      Story Not Accepted
                    </h2>
                    <p className="text-gray-700 mb-6 max-w-lg mx-auto">
                      {submitMutation.data.improvements || submitMutation.data.message || "Please check your story and try again."}
                    </p>
                    <button
                      onClick={() => {
                        submitMutation.reset();
                        setShowAnalysis(false);
                      }} // Go back to form, clear error
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Edit & Try Again
                    </button>
                  </div>
                ) : (
                  /* ✅ SUCCESS ANALYSIS */
                  <div className="text-center py-10">
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Test Completed!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Your response has been submitted for AI analysis.
                    </p>

                    {/* 📊 ANALYSIS RESULTS */}
                    {submitMutation.data && (
                      <div className="text-left max-w-2xl mx-auto space-y-6">
                        {/* SCORE CARD */}
                        <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              PPDT Score
                            </h3>
                            <p className="text-sm text-gray-500">
                              Based on SSB standards
                            </p>
                          </div>
                          <div className="text-4xl font-bold text-blue-600">
                            {submitMutation.data.finalScore}/10
                          </div>
                        </div>

                        {/* FEEDBACK */}
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                            <h4 className="font-semibold text-green-800 mb-1">
                              Overall Feedback
                            </h4>
                            <p className="text-gray-700 text-sm">
                              {submitMutation.data.overallFeedback}
                            </p>
                          </div>

                          <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                            <h4 className="font-semibold text-orange-800 mb-1">
                              Areas for Improvement
                            </h4>
                            <p className="text-gray-700 text-sm">
                              {submitMutation.data.improvements}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* EXPERT STORY DISPLAY */}
                    {submitMutation.data?.sampleStory && (
                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                          🌟 Expert's Benchmark Story
                        </h3>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {submitMutation.data.sampleStory}
                        </p>
                      </div>
                    )}

                    <div className="mt-8">
                      <button
                        onClick={() => navigate("/practice/ppdt/PPDTImageSelect")}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Take Another Test
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default PPDTTest;
