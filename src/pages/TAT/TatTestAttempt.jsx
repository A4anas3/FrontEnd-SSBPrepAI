import Header from "@/components/Header";
import TestSubmission from "@/components/TestSubmission";
import { useParams, useNavigate } from "react-router-dom";
import { toSecureUrl } from "@/lib/utils";
import { useTatTestDetail } from "@/hooks/tat/useTat";
import { useEffect, useState } from "react";

const IMAGE_TIME = 1; // 30 seconds
const WRITE_TIME = 1; // 4 minutes

const TatTestAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useTatTestDetail(id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState("IMAGE"); // IMAGE | WRITE
  const [timeLeft, setTimeLeft] = useState(IMAGE_TIME);
  const [answers, setAnswers] = useState([]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (phase === "SUBMIT") return;

    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  /* ================= PHASE CONTROL ================= */
  useEffect(() => {
    if (!data || phase === "SUBMIT") return;

    if (timeLeft === 0) {
      if (phase === "IMAGE") {
        setPhase("WRITE");
        setTimeLeft(WRITE_TIME);
      } else {
        // Save placeholder answer (writing is offline / on paper)
        setAnswers((prev) => [
          ...prev,
          { imageId: data.images[currentIndex].imageId },
        ]);

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

          {/* DEBUG INFO (REMOVE LATER) */}
          <div className="text-center text-xs text-gray-400 mb-4">
            Phase: {phase} | Index: {currentIndex} | Time: {timeLeft}
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* ⏱ LEFT SIDE – TIMER (Hide on Submit) */}
            {phase !== "SUBMIT" && (
              <aside className="col-span-12 md:col-span-3 bg-background rounded-xl p-6 shadow-sm text-center">
                <h3 className="font-semibold text-lg mb-2">
                  Picture {currentIndex + 1} / {data.images.length}
                </h3>

                <div className="text-4xl font-mono my-4 text-red-600 animate-pulse">
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
            )}

            {/* 🖼️ / 📝 RIGHT SIDE */}
            <section className={`col-span-12 ${phase === "SUBMIT" ? "md:col-span-12" : "md:col-span-9"}`}>
              <div className="bg-white rounded-xl shadow-sm p-6 min-h-120 flex items-center justify-center">
                {/* IMAGE PHASE */}
                {phase === "IMAGE" && (
                  <img
                    src={toSecureUrl(image.imageUrl)}
                    alt="TAT"
                    className="max-h-105 w-auto object-contain"
                  />
                )}

                {/* WRITE PHASE – NOTE PANEL */}
                {phase === "WRITE" && (
                  <div className="w-full h-95 flex flex-col items-center justify-center text-center border-2 border-dashed border-red-300 rounded-xl bg-red-50">
                    <div className="text-6xl mb-4 text-red-600">⏱️</div>

                    <h2 className="text-xl font-semibold text-red-700 mb-2">
                      Writing Time Started
                    </h2>

                    <p className="text-sm text-red-600 max-w-md">
                      Write your story <strong>quickly and clearly</strong> in
                      your answer sheet. Show responsibility, initiative,
                      planning, and a positive outcome.
                    </p>

                    <p className="mt-4 text-xs text-muted-foreground">
                      Image has been removed intentionally (as in real SSB TAT).
                    </p>
                  </div>
                )}

                {/* 📤 SUBMIT PHASE */}
                {phase === "SUBMIT" && (
                  <TestSubmission
                    enableSpeak={false}
                    onScanSubmit={() => alert("Scan submitted! (Placeholder)")}
                  >
                    <div className="w-full">
                      <h2 className="text-xl font-semibold mb-4 text-center">
                        Submit your TAT Responses
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4 text-center">
                        Please write your stories below or upload a scan of your answer sheet.
                      </p>
                      <textarea
                        className="w-full border rounded-lg p-3 min-h-[300px]"
                        placeholder="Type your stories here (Story 1, Story 2...)"
                      />
                      <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full">
                        Submit All Stories
                      </button>
                    </div>
                  </TestSubmission>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default TatTestAttempt;
