import Header from "@/components/Header.jsx";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { useSrtTestDetail } from "@/hooks/srt/useSrt";

const SITUATION_TIME = 30;

const SrtPracticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSrtTestDetail(id);

  const situations = data?.situations || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SITUATION_TIME);
  const [isFinished, setIsFinished] = useState(false);

  const tickAudio = useRef(null);
  const currentSituation = situations[currentIndex];

  useEffect(() => {
    if (!currentSituation || isFinished) return;

    tickAudio.current?.play().catch(() => {});

    if (timeLeft === 0) {
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

  if (isLoading) return <div className="py-32 text-center">Loading...</div>;
  if (!currentSituation)
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
            💡 <b>Tip:</b> Think logically and write a complete action, not just
            a reaction.
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm">
            ⏱️ <b>Time:</b> 30 seconds per situation (SSB standard).
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
            ⚠️ Note: Responses may differ from person to person.
          </div>
        </div>

        {/* 🔴 IMPORTANT AI NOTE */}
        <div className="mb-6 bg-red-600/10 border border-red-600/30 rounded-xl p-4 text-red-700 text-sm font-semibold">
          ❗ Important: After completing the test, submit your responses for AI
          analysis.
        </div>

        {/* ✅ MAIN TEST UI */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {/* LEFT: Progress */}
          <div className="md:col-span-1 bg-white border rounded-xl shadow p-5 flex flex-col justify-center">
            <p className="text-sm text-gray-500 mb-2">Progress</p>
            <p className="text-2xl font-bold text-primary">
              {currentIndex + 1} / {situations.length}
            </p>
          </div>

          {/* RIGHT: Situation Box */}
          <div className="md:col-span-2 bg-white border rounded-xl shadow p-8 flex flex-col items-center justify-center min-h-[250px]">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-red-600">
                {timeLeft}s
              </span>
            </div>

            <div className="text-xl font-semibold text-black text-center leading-relaxed mb-4">
              {currentSituation.situation}
            </div>

            <p className="text-sm text-gray-500 text-center">
              Think and form your response mentally...
            </p>
          </div>
        </div>

        {/* ✅ EXIT BUTTON AFTER TEST */}
        {isFinished && (
          <div className="mt-8 bg-white border rounded-xl shadow p-6 text-center">
            <h2 className="text-xl font-semibold mb-3">
              SRT Test Completed 🎉
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              You have completed all {situations.length} situations.
            </p>

            <button
              onClick={() => navigate("/srt")}
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

export default SrtPracticeDetail;
