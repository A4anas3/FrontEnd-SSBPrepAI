import Header from "@/components/Header.jsx";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, Send, CheckCircle, Mic, MicOff } from "lucide-react";
import { useSrtTestDetail, useSrtTestSubmit } from "@/hooks/srt/useSrt";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import SrtAnalysisResult from "@/components/SrtAnalysisResult";

const SITUATION_TIME = 30;

const SrtPracticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSrtTestDetail(id);
  const submitTestMutation = useSrtTestSubmit();

  const situations = data?.situations || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SITUATION_TIME);
  const [isFinished, setIsFinished] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // User Inputs
  const [responses, setResponses] = useState([]);
  const [currentText, setCurrentText] = useState("");

  // Voice Hook
  const {
    isListening,
    transcript,
    interimTranscript,
    startRecording,
    stopRecording,
    resetTranscript,
    error: voiceError
  } = useSpeechRecognition();

  const tickAudio = useRef(null);
  const currentSituation = situations[currentIndex];

  // ✅ Append speech to text when finalized
  useEffect(() => {
    if (transcript) {
      setCurrentText((prev) => {
        // Ensure we don't have double spaces
        const prefix = prev.trim() ? " " : "";
        return prev + prefix + transcript;
      });
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const saveResponse = () => {
    if (!currentSituation) return;

    const newResponse = {
      situationId: currentSituation.id || currentSituation._id,
      situationText: currentSituation.situation,
      textResponse: currentText, // Speech is merged here
      voiceUsed: isListening || currentText.length > 0
    };

    setResponses((prev) => {
      const updated = [...prev];
      updated[currentIndex] = newResponse;
      return updated;
    });

    // Reset inputs for next
    setCurrentText("");
    resetTranscript();
    if (isListening) stopRecording();
  };

  useEffect(() => {
    if (!currentSituation || isFinished) return;

    tickAudio.current?.play().catch(() => { });

    if (timeLeft === 0) {
      saveResponse(); // Save before moving
      if (currentIndex < situations.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setTimeLeft(SITUATION_TIME);
      } else {
        setIsFinished(true);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, currentIndex, currentSituation, isFinished, situations.length]);

  const handleNext = () => {
    saveResponse();
    if (currentIndex < situations.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(SITUATION_TIME);
    } else {
      setIsFinished(true);
    }
  };

  const handleSubmitTest = () => {
    // Map to backend SrtAnswerDto format: { situationNo, reaction }
    const formattedAnswers = responses.map((r, index) => ({
      situationNo: index + 1,
      reaction: r?.textResponse || ""
    }));

    submitTestMutation.mutate({
      testId: id,
      answers: formattedAnswers
    }, {
      onSuccess: (data) => {
        setAnalysisResult(data);
      }
    });
  };



  const toggleRecording = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (isLoading) return <div className="py-32 text-center">Loading...</div>;
  if (!currentSituation && !isFinished)
    return <div className="py-32 text-center">No situations found</div>;

  return (
    <section className="pt-24 py-10 bg-gray-50 min-h-screen">
      <Header />

      {/* tick sound */}
      <audio ref={tickAudio} src="/tick.mp3" preload="auto" />

      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold mb-4">SRT Practice Test</h1>

        {/* ✅ TOP TIPS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm">
            💡 <b>Tip:</b> Think logically and write a complete action.
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
            ⏱️ <b>Time:</b> 30 seconds per situation.
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            ⚠️ Note: Responses may differ from person to person.
          </div>
        </div>

        {/* 🔴 IMPORTANT AI NOTE */}
        <div className="mb-6 bg-red-600/10 border border-red-600/30 rounded-xl p-4 text-red-700 text-sm font-semibold">
          ❗ Speak your answer or type it. Both will be analyzed.
        </div>

        {!isFinished ? (
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* LEFT: Progress & Timer */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white border rounded-xl shadow p-5 flex flex-col justify-center text-center">
                <p className="text-sm text-gray-500 mb-2">Progress</p>
                <p className="text-2xl font-bold text-primary">
                  {currentIndex + 1} / {situations.length}
                </p>
              </div>

              <div className="bg-white border rounded-xl shadow p-5 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className={`w-8 h-8 ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`} />
                  <span className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-600' : 'text-blue-600'}`}>
                    {timeLeft}s
                  </span>
                </div>
                <p className="text-xs text-gray-400">Time Remaining</p>
              </div>
            </div>

            {/* RIGHT: Input Area */}
            <div className="md:col-span-2 space-y-6">
              {/* Situation Card */}
              <div className="bg-white border rounded-xl shadow p-8 min-h-[150px] flex items-center justify-center border-l-4 border-l-primary">
                <div className="text-xl font-semibold text-black text-center leading-relaxed">
                  {currentSituation.situation}
                </div>
              </div>

              {/* COMBINED WRITING & VOICE AREA */}
              <div className="bg-white border rounded-xl shadow p-6 relative">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    ✍️ Your Response
                  </label>
                  {voiceError && <span className="text-xs text-red-500">{voiceError}</span>}
                </div>

                <div className="relative">
                  <textarea
                    className={`w-full p-4 pr-16 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px] text-lg ${isListening ? 'border-red-400 shadow-[0_0_10px_rgba(248,113,113,0.3)]' : ''}`}
                    placeholder="Type here or click the mic to speak..."
                    value={currentText + (isListening && interimTranscript ? " " + interimTranscript : "")}
                    onChange={(e) => setCurrentText(e.target.value)}
                  />

                  {/* Mic Button integrated inside textarea */}
                  <button
                    onClick={toggleRecording}
                    className={`absolute bottom-4 right-4 p-3 rounded-full shadow-md transition-all duration-200 ${isListening
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    title={isListening ? "Stop Recording" : "Start Recording"}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                </div>

                {isListening && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-2 animate-pulse font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-600 block"></span>
                    Listening...
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
                >
                  Skip / Next
                </button>
              </div>
            </div>
          </div>
        ) : analysisResult ? (
          <SrtAnalysisResult
            analysisResult={analysisResult}
            onBack={() => navigate("/srt")}
            backLabel="Back to SRT Tests"
            title="AI Analysis Report"
          />
        ) : (
          /* ✅ SUBMISSION SCREEN */
          <div className="mt-8 bg-white border rounded-xl shadow p-8 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              SRT Test Completed 🎉
            </h2>
            <p className="text-gray-600 mb-8">
              You have completed all {situations.length} situations. Click below to submit your answers for AI analysis.
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
                onClick={() => navigate("/srt")}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancel & Exit (Data will be lost)
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SrtPracticeDetail;
