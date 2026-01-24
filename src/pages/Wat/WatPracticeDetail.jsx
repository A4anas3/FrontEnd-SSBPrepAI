import Header from "@/components/Header.jsx";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { useWatTestDetail } from "@/hooks/wat/useWat";

const WORD_TIME = 15;

const WatPracticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useWatTestDetail(id);

  const words = data?.words || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(WORD_TIME);
  const [responses, setResponses] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const tickAudio = useRef(null);
  const currentWord = words[currentIndex];

  // ✅ Timer + Auto Next
  useEffect(() => {
    if (!currentWord || isFinished) return;

    tickAudio.current?.play().catch(() => {});

    if (timeLeft === 0) {
      if (currentIndex < words.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setTimeLeft(WORD_TIME);
      } else {
        setIsFinished(true);
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, currentIndex, currentWord, isFinished, words.length]);

  // ✅ Save response
  const handleChange = (value) => {
    setResponses((prev) => ({
      ...prev,
      [currentWord.wordNo]: value,
    }));
  };

  if (isLoading) return <div className="py-32 text-center">Loading...</div>;
  if (!currentWord)
    return <div className="py-32 text-center">No words found</div>;

  return (
    <section className="pt-24 py-10 bg-gray-50 min-h-screen">
      <Header />

      {/* tick sound */}
      <audio ref={tickAudio} src="/tick.mp3" preload="auto" />

      <div className="container mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold mb-4">WAT Practice Test</h1>

        {/* ✅ TOP TIPS */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm">
            💡 <b>Tip:</b> Write the first positive thought that comes to your
            mind in copy.
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
            ⏱️ <b>Time:</b> 15 seconds per word (SSB standard).
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            ⚠️ Avoid negative or unrealistic sentences.
          </div>
        </div>

        {/* ✅ MAIN TEST UI */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {/* LEFT: Progress */}
          <div className="md:col-span-1 bg-white border rounded-xl shadow p-5 flex flex-col justify-center">
            <p className="text-sm text-gray-500 mb-2">Progress</p>
            <p className="text-2xl font-bold text-primary">
              {currentIndex + 1} / {words.length}
            </p>
          </div>

          {/* RIGHT: Word Box */}
          {/* RIGHT: Word Box */}
          <div className="md:col-span-2 bg-white border rounded-xl shadow p-8 flex flex-col items-center justify-center min-h-62.5">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-red-600">
                {timeLeft}s
              </span>
            </div>

            <div className="text-5xl font-bold text-primary mb-3 tracking-wide">
              {currentWord.word}
            </div>

            <p className="text-sm text-gray-500">
              Think and form your response mentally...
            </p>
          </div>
        </div>

        {/* ✅ EXIT BUTTON AFTER TEST */}
        {isFinished && (
          <div className="mt-8 bg-white border rounded-xl shadow p-6 text-center">
            <h2 className="text-xl font-semibold mb-3">Test Completed 🎉</h2>
            <p className="text-sm text-gray-600 mb-5">
              You have completed all {words.length} words.
            </p>

            <button
              onClick={() => navigate("/wat")}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Exit Test
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WatPracticeDetail;
