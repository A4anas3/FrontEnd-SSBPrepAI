import Header from "@/components/Header";
import SrtAnalysisResult from "@/components/SrtAnalysisResult";
import { useParams, useNavigate } from "react-router-dom";
import { toSecureUrl } from "@/lib/utils";
import { useTatTestDetail, useTatTestSubmit } from "@/hooks/tat/useTat";
import { useEffect, useState } from "react";
import { Send, CheckCircle, Mic, MicOff } from "lucide-react";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";

const IMAGE_TIME = 1; // 30 seconds to observe
const WRITE_TIME = 1; // 4 minutes to write

const TatTestAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useTatTestDetail(id);
  const submitTestMutation = useTatTestSubmit();
  const {
    isListening,
    transcript,
    interimTranscript,
    startRecording,
    stopRecording,
    resetTranscript,
  } = useSpeechRecognition();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("IMAGE"); // IMAGE | WRITE | SUBMIT | RESULT
  const [timeLeft, setTimeLeft] = useState(IMAGE_TIME);
  const [stories, setStories] = useState({}); // { imageId: "story text" }
  const [currentStory, setCurrentStory] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  /* ================= MERGE SPEECH TRANSCRIPT ================= */
  useEffect(() => {
    if (transcript && phase === "WRITE") {
      setCurrentStory((prev) => prev + transcript);
      resetTranscript();
    }
  }, [transcript, phase]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (phase === "SUBMIT" || phase === "RESULT") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  /* ================= PHASE CONTROL ================= */
  useEffect(() => {
    if (!data || phase === "SUBMIT" || phase === "RESULT") return;

    if (timeLeft === 0) {
      // Stop mic if running
      if (isListening) stopRecording();

      if (phase === "IMAGE") {
        setPhase("WRITE");
        setTimeLeft(WRITE_TIME);
      } else {
        // Save current story
        const image = data.images[currentIndex];
        setStories((prev) => ({
          ...prev,
          [image.imageId]: currentStory,
        }));
        setCurrentStory("");
        resetTranscript();

        if (currentIndex + 1 < data.images.length) {
          setCurrentIndex((i) => i + 1);
          setPhase("IMAGE");
          setTimeLeft(IMAGE_TIME);
        } else {
          setPhase("SUBMIT");
        }
      }
    }
  }, [timeLeft, phase, data, currentIndex]);

  const handleSubmitTest = () => {
    if (!data) return;

    const formattedAnswers = data.images.map((img) => ({
      imageId: img.imageId,
      story: stories[img.imageId] || "",
    }));

    submitTestMutation.mutate(
      { testId: id, answers: formattedAnswers },
      {
        onSuccess: (result) => {
          setAnalysisResult(result);
          setPhase("RESULT");
        },
      }
    );
  };

  if (isLoading) return <p className="text-center mt-20">Loading test...</p>;
  if (error)
    return (
      <p className="text-center mt-20 text-red-500">Failed to load test</p>
    );

  const image = data.images[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      <Header />

      <main className="pt-24 min-h-screen bg-muted/30">
        <div className="container mx-auto px-4">
          {/* 🔰 TOP HEADING */}
          <h1 className="text-center text-2xl font-semibold mb-10">
            TAT Test – Picture Based Story Writing
          </h1>

          {/* IMAGE + WRITE PHASES */}
          {(phase === "IMAGE" || phase === "WRITE") && (
            <div className="grid grid-cols-12 gap-6">
              {/* ⏱ LEFT SIDE – TIMER */}
              <aside className="col-span-12 md:col-span-3 bg-background rounded-xl p-6 shadow-sm text-center">
                <h3 className="font-semibold text-lg mb-2">
                  Picture {currentIndex + 1} / {data.images.length}
                </h3>

                <div className={`text-4xl font-mono my-4 ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-red-600'}`}>
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </div>

                <p className="text-sm text-muted-foreground">
                  {phase === "IMAGE"
                    ? "Observe the picture carefully. Memorize details."
                    : "WRITE NOW. Stay calm and focused."}
                </p>

                <div className="mt-6 text-xs text-muted-foreground leading-relaxed">
                  Remember:
                  <ul className="mt-2 space-y-1">
                    <li>• Identify the situation</li>
                    <li>• Show initiative & action</li>
                    <li>• End positively</li>
                  </ul>
                </div>
              </aside>

              {/* 🖼️ / 📝 RIGHT SIDE */}
              <section className="col-span-12 md:col-span-9">
                <div className="bg-white rounded-xl shadow-sm p-6 min-h-120 flex items-center justify-center">
                  {/* IMAGE PHASE */}
                  {phase === "IMAGE" && (
                    <img
                      src={toSecureUrl(image.imageUrl)}
                      alt="TAT"
                      className="max-h-105 w-auto object-contain"
                    />
                  )}

                  {/* WRITE PHASE – TEXTAREA + MIC */}
                  {phase === "WRITE" && (
                    <div className="w-full">
                      <h2 className="text-xl font-semibold mb-3 text-center text-red-700">
                        ✍️ Write Your Story – Picture {currentIndex + 1}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4 text-center">
                        Type or use the mic 🎤 to dictate your story.
                      </p>

                      {/* Textarea with mic button */}
                      <div className="relative">
                        <textarea
                          className="w-full border-2 border-red-300 rounded-xl p-4 pr-14 min-h-[300px] text-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
                          placeholder="Start writing your story here or tap the mic..."
                          value={currentStory + (interimTranscript || "")}
                          onChange={(e) => setCurrentStory(e.target.value)}
                          autoFocus
                        />

                        {/* 🎤 Mic Toggle Button */}
                        <button
                          type="button"
                          onClick={isListening ? stopRecording : startRecording}
                          className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition-all ${isListening
                              ? "bg-red-500 text-white animate-pulse hover:bg-red-600"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          title={isListening ? "Stop recording" : "Start recording"}
                        >
                          {isListening ? <MicOff size={22} /> : <Mic size={22} />}
                        </button>
                      </div>

                      {/* Listening indicator */}
                      {isListening && (
                        <p className="text-center text-red-500 text-sm mt-2 animate-pulse">
                          🎙️ Listening... Speak your story
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {/* 📤 SUBMIT PHASE */}
          {phase === "SUBMIT" && !analysisResult && (
            <div className="mt-8 bg-white border rounded-xl shadow p-8 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">
                TAT Test Completed 🎉
              </h2>
              <p className="text-gray-600 mb-8">
                You have completed all {data.images.length} pictures. Click below to submit your stories for AI analysis.
              </p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleSubmitTest}
                  disabled={submitTestMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  {submitTestMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing with AI...
                    </span>
                  ) : (
                    <>
                      <Send size={20} /> Submit for Analysis
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/tat")}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cancel & Exit
                </button>
              </div>
            </div>
          )}

          {/* 📊 RESULT PHASE */}
          {phase === "RESULT" && analysisResult && (
            <SrtAnalysisResult
              analysisResult={analysisResult}
              onBack={() => navigate("/tat")}
              backLabel="Back to TAT Tests"
              title="TAT AI Analysis Report"
              breakdownTitle="Picture-wise Breakdown"
              itemNumber="imageId"
              itemLabel="story"
              itemFallback="Picture"
              responseKey="story"
              responseLabel="Your Story"
              idealKey="dbStory"
              idealLabel="Reference Story"
              imageKey="imgurl"
            />
          )}
        </div>
      </main>
    </>
  );
};

export default TatTestAttempt;
