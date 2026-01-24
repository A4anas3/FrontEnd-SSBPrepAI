import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import { useParams } from "react-router-dom";
import { useSrtTestDetail } from "@/hooks/srt/useSrt";

const SrtSampleDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useSrtTestDetail(id);

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;
  if (error)
    return <p className="text-center mt-20 text-red-500">Error loading test</p>;

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-5xl">
        <SectionTitle
          title={data.testName}
          subtitle="Below are sample situations with example reactions."
          centered
        />

        {/* ✅ Info Boxes */}
        <div className="mb-8 space-y-3">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-blue-700 text-sm">
            ⏱️ <b>Time:</b> In real SSB SRT, you get{" "}
            <b>30 minutes for 60 situations</b>.
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-700 text-sm">
            💡 <b>How to Answer:</b> Write complete action, not just reaction.
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-700 text-sm">
            ⚠️ <b>Important:</b> Responses may differ from person to person.
            There is no single correct answer.
          </div>
        </div>

        {/* ✅ Situations List */}
        <div className="space-y-4">
          {data.situations.map((situation, index) => (
            <div
              key={situation.situationNo}
              className="bg-card border border-sky-border rounded-xl p-4 hover:shadow-sm transition"
            >
              {/* Situation */}
              <div className="text-base font-semibold text-black mb-1">
                {index + 1}. {situation.situation}
              </div>

              {/* Reaction */}
              <div className="text-sm text-red-600">
                👉 {situation.reaction || "Sample reaction will appear here."}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Bottom Tip */}
        <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-700 text-sm">
          💡 Tip: Show maturity, responsibility, leadership, and practical
          thinking in your responses.
        </div>
      </div>
    </section>
  );
};

export default SrtSampleDetail;
