import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import TestCard from "@/components/TestCard.jsx";
import { useWatTestNames } from "@/hooks/wat/useWat";
import watImage from "@/assets/card-wat.jpg";
import { Brain, Clock, AlertTriangle } from "lucide-react";

const WatPracticeList = () => {
  const { data, isLoading, error } = useWatTestNames();

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
          title="WAT Practice Tests"
          subtitle="Attempt real Word Association Tests and analyze your responses."
          centered
        />

        {/* ✅ Static Tips Section */}
        <div className="mb-10 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-blue-700 text-sm">
            💡 <b>How to Attempt:</b> Write the first positive and realistic
            thought that comes to your mind for each word.
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-700 text-sm flex items-center gap-2">
            <Clock size={16} />
            <span>
              <b>Time:</b> 15 seconds per word (SSB standard)
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
              description={`Start this test to practice your WAT responses.\n\n✅ Tip: Think fast, stay positive.`}
              image={watImage}
              icon={Brain}
              href={`/wat/practice/${test.id}`}
              size="small"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WatPracticeList;
