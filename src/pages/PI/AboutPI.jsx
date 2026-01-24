import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";

const AboutPI = () => {
  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-5xl">
        <SectionTitle
          title="About Personal Interview (PI)"
          subtitle="Complete guide to crack SSB Personal Interview."
          centered
        />

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          {/* 1️⃣ What is PI */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              1. What is Personal Interview (PI) in SSB?
            </h2>
            <p>
              The Personal Interview (PI) is one of the most important stages of
              the SSB interview. In this round, the Interviewing Officer (IO)
              interacts with you one-to-one to understand your personality,
              mindset, background, motivation, and leadership qualities.
            </p>
            <p className="mt-2">
              The interview usually lasts between <b>30 minutes to 1 hour</b>.
            </p>
          </div>

          {/* 2️⃣ What IO Evaluates */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              2. What Does the Interviewing Officer Evaluate?
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Confidence and communication skills</li>
              <li>Honesty and integrity</li>
              <li>Leadership and responsibility</li>
              <li>Logical thinking and clarity</li>
              <li>Motivation to join Armed Forces</li>
              <li>Social adaptability and teamwork</li>
              <li>OLQs (Officer Like Qualities)</li>
            </ul>
          </div>

          {/* 3️⃣ Types of Questions */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              3. Types of Questions in PI
            </h2>

            <h3 className="font-semibold text-primary mt-3">
              🔹 Personal Life
            </h3>
            <ul className="list-disc pl-6">
              <li>Tell me about yourself.</li>
              <li>Family background?</li>
              <li>Your strengths and weaknesses?</li>
            </ul>

            <h3 className="font-semibold text-primary mt-3">🔹 Academics</h3>
            <ul className="list-disc pl-6">
              <li>Why did you choose your course?</li>
              <li>Your favorite subject?</li>
              <li>Explain any topic from your syllabus.</li>
            </ul>

            <h3 className="font-semibold text-primary mt-3">
              🔹 Current Affairs
            </h3>
            <ul className="list-disc pl-6">
              <li>Latest defence news?</li>
              <li>India’s geopolitical challenges?</li>
            </ul>

            <h3 className="font-semibold text-primary mt-3">
              🔹 Psychology & GTO
            </h3>
            <ul className="list-disc pl-6">
              <li>Why did you write this story in PPDT?</li>
              <li>Your role in GTO tasks?</li>
            </ul>

            <h3 className="font-semibold text-primary mt-3">🔹 Situational</h3>
            <ul className="list-disc pl-6">
              <li>What will you do if your team fails?</li>
              <li>How do you handle conflict?</li>
            </ul>
          </div>

          {/* 4️⃣ How to Prepare */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              4. How to Prepare for PI (Step-by-Step)
            </h2>

            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <b>Know Yourself:</b> Be clear about your life, goals,
                strengths, weaknesses.
              </li>
              <li>
                <b>Prepare PIQ Form:</b> Every answer must match your PIQ form.
              </li>
              <li>
                <b>Improve Communication:</b> Practice speaking clearly and
                confidently.
              </li>
              <li>
                <b>Study Current Affairs:</b> Especially defence and national
                issues.
              </li>
              <li>
                <b>Revise Academics:</b> Core subjects from your field.
              </li>
              <li>
                <b>Be Honest:</b> Never fake answers.
              </li>
            </ol>
          </div>

          {/* 5️⃣ Daily Preparation Plan */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              5. Daily Preparation Plan (SSB Level)
            </h2>

            <ul className="list-disc pl-6 space-y-1">
              <li>🕐 15 min – Self-introduction practice</li>
              <li>🕐 20 min – Current affairs</li>
              <li>🕐 20 min – Academic revision</li>
              <li>🕐 15 min – Rapid fire questions</li>
              <li>🕐 10 min – Personality analysis</li>
            </ul>
          </div>

          {/* 6️⃣ Common Mistakes */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              6. Common Mistakes in PI
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Lying or exaggerating facts</li>
              <li>Overconfidence or arrogance</li>
              <li>Contradicting your PIQ form</li>
              <li>Lack of clarity in answers</li>
              <li>Fear and nervousness</li>
            </ul>
          </div>

          {/* 7️⃣ Pro Tips */}
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-2">
              7. Pro Tips to Crack PI 💡
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Be natural, not artificial.</li>
              <li>Think like an officer, not a student.</li>
              <li>Answer logically, not emotionally.</li>
              <li>Show leadership and responsibility.</li>
              <li>Be positive and optimistic.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPI;
