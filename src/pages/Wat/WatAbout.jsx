import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";

const WatAbout = () => {
  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-5xl">
        <SectionTitle
          title="About Word Association Test (WAT)"
          subtitle="Complete guide to understand, attempt, and excel in WAT during SSB."
          centered
        />

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          {/* 1️⃣ What is WAT */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              1. What is Word Association Test (WAT)?
            </h2>
            <p>
              The Word Association Test (WAT) is a psychological test conducted
              during the SSB interview to evaluate a candidate’s personality,
              thinking pattern, attitude, and subconscious mind.
            </p>
            <p className="mt-2">
              In this test, candidates are shown <b>60 words</b>, each for
              <b> 15 seconds</b>, and they must write the first meaningful
              sentence that comes to their mind.
            </p>
          </div>

          {/* 2️⃣ What Psychologists Evaluate */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              2. What Does the Psychologist Evaluate in WAT?
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Positive or negative thinking</li>
              <li>Attitude towards life and challenges</li>
              <li>Emotional stability</li>
              <li>Responsibility and leadership qualities</li>
              <li>Confidence and optimism</li>
              <li>Officer Like Qualities (OLQs)</li>
              <li>Originality of thoughts</li>
            </ul>
          </div>

          {/* 3️⃣ Test Pattern */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              3. WAT Test Pattern
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Total words: 60</li>
              <li>Time per word: 15 seconds</li>
              <li>Total duration: 15 minutes</li>
              <li>Response type: One meaningful sentence per word</li>
              <li>No negative marking</li>
            </ul>
          </div>

          {/* 4️⃣ How to Write Responses */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              4. How to Write WAT Responses (Correct Method)
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Write short, clear, and positive sentences.</li>
              <li>Show responsibility, leadership, and confidence.</li>
              <li>Avoid copying bookish sentences.</li>
              <li>Express natural and spontaneous thoughts.</li>
              <li>Focus on action-oriented and optimistic ideas.</li>
            </ul>
          </div>

          {/* 5️⃣ Do’s */}
          <div className="bg-card border border-green-500/40 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-2">
              5. Do’s in WAT ✅
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Think positive and constructive thoughts.</li>
              <li>Maintain speed and clarity.</li>
              <li>Write grammatically correct sentences.</li>
              <li>Show courage, discipline, and optimism.</li>
              <li>Be honest and natural in your responses.</li>
            </ul>
          </div>

          {/* 6️⃣ Don’ts */}
          <div className="bg-card border border-red-500/40 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              6. Don’ts in WAT ❌
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Avoid negative, fearful, or pessimistic sentences.</li>
              <li>Don’t write long or complex sentences.</li>
              <li>Don’t leave words unanswered.</li>
              <li>Don’t try to fake personality.</li>
              <li>Don’t overthink the word.</li>
            </ul>
          </div>

          {/* 7️⃣ Common Mistakes */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              7. Common Mistakes in WAT
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Writing negative or aggressive sentences</li>
              <li>Repeating the same ideas again and again</li>
              <li>Writing unrealistic or imaginary statements</li>
              <li>Too much focus on perfection instead of spontaneity</li>
              <li>Lack of confidence in thoughts</li>
            </ul>
          </div>

          {/* 8️⃣ Example Responses */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              8. Example of Good WAT Responses
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <b>Leader:</b> A leader inspires and guides the team.
              </li>
              <li>
                <b>Fear:</b> Courage helps in overcoming fear.
              </li>
              <li>
                <b>Success:</b> Hard work leads to success.
              </li>
              <li>
                <b>Failure:</b> Failure teaches valuable lessons.
              </li>
            </ul>
          </div>

          {/* 9️⃣ Daily Practice Plan */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              9. Daily Practice Plan for WAT
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>🕐 10 minutes – Practice 10 words daily.</li>
              <li>🕐 10 minutes – Analyze your responses.</li>
              <li>🕐 10 minutes – Improve weak areas.</li>
              <li>🕐 10 minutes – Revise positive sentence patterns.</li>
            </ul>
          </div>

          {/* 🔟 Pro Tips */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              10. Pro Tips to Crack WAT 💡
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Think like an officer, not a student.</li>
              <li>Be realistic and action-oriented.</li>
              <li>Maintain speed without panic.</li>
              <li>Consistency matters more than perfection.</li>
              <li>Practice daily with a timer.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WatAbout;
