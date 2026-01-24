import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import TestCard from "@/components/TestCard.jsx";
import { useSrtTestNames } from "@/hooks/srt/useSrt";
import srtImage from "@/assets/card-srt.jpg";
import { Brain, Clock, AlertTriangle, Users } from "lucide-react";

const SrtPracticeList = () => {
  const { data, isLoading, error } = useSrtTestNames();

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;
  if (error)
    return (
      <p className="text-center mt-20 text-red-500">Error loading tests</p>
    );

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* ✅ Heading */}
        <SectionTitle
          title="SRT Practice Tests"
          subtitle="Attempt real Situation Reaction Tests and improve your decision-making skills."
          centered
        />

        {/* ✅ Static Tips Section */}
        <div className="mb-10 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-blue-700 text-sm">
            💡 <b>How to Attempt:</b> Read the situation carefully and write a
            practical, responsible, and realistic action.
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-700 text-sm flex items-center gap-2">
            <Clock size={16} />
            <span>
              <b>Time:</b> 30 seconds per situation (SSB standard)
            </span>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-yellow-700 text-sm flex items-center gap-2">
            <Users size={16} />
            <span>
              <b>Note:</b> Answers may differ from person to person based on
              personality, experience, and thinking style.
            </span>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-700 text-sm flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>
              <b>Important:</b> After completing the test, submit your responses
              for AI analysis.
            </span>
          </div>
        </div>

        {/* ✅ Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((test, index) => (
            <TestCard
              key={test.id}
              title={`Test ${index + 1}`}
              description={`Start this test to practice your SRT responses.\n\n✅ Tip: Act logically and responsibly under pressure.`}
              image={srtImage}
              icon={Brain}
              href={`/srt/practice/${test.id}`}
              size="small"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SrtPracticeList;
