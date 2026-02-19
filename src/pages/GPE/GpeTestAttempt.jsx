import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useGpeDetail } from "@/hooks/gpe/useGPE";
import { toSecureUrl } from "@/lib/utils";
import useTextToSpeech from "@/hooks/useTextToSpeech";
import { Volume2, Pause, Play, Square } from "lucide-react";

const GpeTestAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: gpe, isLoading } = useGpeDetail(id);
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported, progress } =
    useTextToSpeech();

  const handleNarrate = () => {
    if (isSpeaking && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      speak(gpe?.question || "");
    }
  };

  if (isLoading) {
    return (
      <section className="pt-24">
        <Header />
        <p className="text-center text-muted-foreground">Loading GPE test...</p>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-24 bg-background min-h-screen">
      <Header />

      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          ← Back to GPE Tests
        </button>

        {/* 💡 TOP TIPS */}
        <div className="bg-linear-to-br from-yellow-50 to-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="text-base font-semibold text-amber-800 mb-2">
            💡 Tips Before You Start
          </h3>
          <ul className="list-disc pl-5 text-sm text-amber-800/90 space-y-1">
            <li>First understand the situation, don't rush to solutions.</li>
            <li>Prioritise life-threatening problems first.</li>
            <li>Use only realistic and available resources.</li>
            <li>Estimate time and distance logically.</li>
            <li>Do not ignore any problem, even minor ones.</li>
          </ul>
        </div>

        {/* 🖼 GPE Image */}
        <div className="border rounded-xl overflow-hidden bg-white">
          <img
            src={toSecureUrl(gpe.imageUrl)}
            alt="GPE Model"
            className="w-full object-contain"
          />
        </div>

        {/* 🔊 Narration Controls */}
        {isSupported && gpe?.question && (
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-4">
              {/* Play / Pause Button */}
              <button
                onClick={handleNarrate}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-white transition-all shadow-md hover:shadow-lg active:scale-95"
                title={isSpeaking && !isPaused ? "Pause" : "Listen to Narrative"}
              >
                {isSpeaking && !isPaused ? (
                  <Pause size={20} />
                ) : (
                  <Play size={20} className="ml-0.5" />
                )}
              </button>

              {/* Info + Progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Volume2
                    size={16}
                    className={`text-amber-400 ${isSpeaking && !isPaused ? "animate-pulse" : ""
                      }`}
                  />
                  <span className="text-sm font-medium text-white truncate">
                    {isSpeaking && !isPaused
                      ? "GTO is narrating..."
                      : isPaused
                        ? "Paused"
                        : "Listen to GPE Narrative"}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${isSpeaking || isPaused ? progress : 0}%` }}
                  />
                </div>
              </div>

              {/* Stop Button */}
              {(isSpeaking || isPaused) && (
                <button
                  onClick={stop}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 hover:bg-red-600 text-white transition-all"
                  title="Stop"
                >
                  <Square size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 📄 GPE Question */}
        <div className="bg-card border border-sky-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary mb-3">
            GPE Narrative
          </h2>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {gpe.question}
          </p>
        </div>
      </div>
    </section>
  );
};

export default GpeTestAttempt;

