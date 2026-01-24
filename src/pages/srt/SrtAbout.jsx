import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";

const SrtAbout = () => {
  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-5xl">
        <SectionTitle
          title="About Situation Reaction Test (SRT)"
          subtitle="Complete guide to understand, attempt, and excel in SRT during SSB."
          centered
        />

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          {/* 1️⃣ What is SRT */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              1. What is Situation Reaction Test (SRT)?
            </h2>
            <p>
              The Situation Reaction Test (SRT) is a psychological test
              conducted during the SSB interview to evaluate a candidate’s
              personality, decision-making ability, maturity, and practical
              approach to life situations.
            </p>
            <p className="mt-2">
              In this test, candidates are given{" "}
              <b>60 everyday life situations</b> and are required to write their
              reactions within a limited time.
            </p>
          </div>

          {/* 2️⃣ What Psychologists Evaluate */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              2. What Does the Psychologist Evaluate in SRT?
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Common sense and practical thinking</li>
              <li>Reasoning and judgment ability</li>
              <li>Maturity and emotional stability</li>
              <li>Sense of responsibility</li>
              <li>Leadership and initiative</li>
              <li>Problem-solving ability</li>
              <li>Officer Like Qualities (OLQs)</li>
            </ul>
          </div>

          {/* 3️⃣ Test Pattern */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              3. SRT Test Pattern
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Total situations: 60</li>
              <li>Total time: 30 minutes</li>
              <li>Average time per situation: ~30 seconds</li>
              <li>Response type: Short, complete action-based sentences</li>
              <li>No negative marking</li>
            </ul>
          </div>

          {/* 4️⃣ How the Test is Conducted */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              4. How is the SRT Conducted?
            </h2>
            <p>
              Candidates are given a booklet containing 60 situations. They must
              write their responses in a separate answer sheet within 30
              minutes.
            </p>
            <p className="mt-2">
              Since the time is limited, candidates usually write the first
              practical response that comes to their mind. This helps
              psychologists understand their natural personality and real-life
              approach.
            </p>
            <p className="mt-2">
              Sometimes similar situations may appear in different forms.
              Therefore, candidates should avoid contradicting their earlier
              responses.
            </p>
          </div>

          {/* 5️⃣ How to Write Responses */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              5. How to Write SRT Responses (Correct Method)
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Write complete action, not just reaction.</li>
              <li>Be realistic, practical, and responsible.</li>
              <li>Keep responses short, clear, and decisive.</li>
              <li>Show leadership, initiative, and teamwork.</li>
              <li>Use positive and solution-oriented thinking.</li>
            </ul>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <b>Example:</b>
              <br />
              Situation: Just before the starting of a doubles match, he found
              his partner missing.
              <br />
              ❌ Weak reaction: He took a substitute player.
              <br />✅ Correct action: He immediately informed the officials,
              arranged a substitute player, motivated the team, and continued
              the match confidently.
            </div>
          </div>

          {/* 6️⃣ Do’s */}
          <div className="bg-card border border-green-500/40 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-2">
              6. Do’s in SRT ✅
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Think logically and practically.</li>
              <li>Take responsibility in situations.</li>
              <li>Show courage and confidence.</li>
              <li>Maintain consistency in answers.</li>
              <li>Write decisive and action-oriented responses.</li>
            </ul>
          </div>

          {/* 7️⃣ Don’ts */}
          <div className="bg-card border border-red-500/40 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              7. Don’ts in SRT ❌
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Avoid unrealistic or heroic actions.</li>
              <li>Don’t write negative or irresponsible responses.</li>
              <li>Don’t contradict your earlier answers.</li>
              <li>Don’t overthink situations.</li>
              <li>Don’t write very long stories.</li>
            </ul>
          </div>

          {/* 8️⃣ Common Mistakes */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              8. Common Mistakes in SRT
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Writing only reactions instead of complete actions</li>
              <li>Ignoring practical constraints of the situation</li>
              <li>Repeating similar ideas in multiple responses</li>
              <li>Contradictory answers in similar situations</li>
              <li>Over-dramatic or unrealistic solutions</li>
            </ul>
          </div>

          {/* 9️⃣ Daily Practice Plan */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              9. Daily Practice Plan for SRT
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>🕐 5 minutes – Practice 10 situations daily.</li>
              <li>🕐 10 minutes – Analyze your responses.</li>
              <li>🕐 10 minutes – Improve weak areas.</li>
              <li>🕐 10 minutes – Revise action-oriented patterns.</li>
            </ul>
          </div>

          {/* 🔟 Pro Tips */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              10. Pro Tips to Crack SRT 💡
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Think like a responsible officer.</li>
              <li>Balance logic, emotion, and practicality.</li>
              <li>Be quick but thoughtful in responses.</li>
              <li>Show maturity and social responsibility.</li>
              <li>Practice with a timer daily.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SrtAbout;
