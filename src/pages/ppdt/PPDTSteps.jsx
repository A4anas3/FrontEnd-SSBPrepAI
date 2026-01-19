import React from "react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";

const PPDTSteps = () => {
  const navigate = useNavigate();

  return (
    <div className=" pt-24 mx-auto px-4 py-10 bg-white">
      {/* Header */}
      <Header />

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-red-900 mb-4 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        PPDT – Complete Steps & Guidelines
      </h1>

      <p className="text-slate-700 mb-8">
        The <strong>Picture Perception and Discussion Test (PPDT)</strong> is a
        psychological screening test conducted in{" "}
        <span className="font-semibold text-slate-900">
          Stage I of the SSB interview
        </span>
        .
      </p>

      {/* What is PPDT */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          What is PPDT?
        </h2>
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <p className="text-slate-800">
            PPDT evaluates a candidate’s{" "}
            <strong>observation, imagination, communication skills</strong>, and
            ability to <strong>work in a group</strong>.
          </p>
        </div>
      </section>

      {/* Objectives */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Objectives of PPDT
        </h2>
        <ul className="list-disc pl-6 text-slate-800 space-y-1">
          <li>
            <strong>Perception & Imagination</strong>
          </li>
          <li>
            <strong>Mental alertness</strong> and clarity of thought
          </li>
          <li>
            <strong>Effective communication</strong>
          </li>
          <li>
            <strong>Leadership</strong> and group behavior
          </li>
        </ul>
      </section>

      {/* Steps */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">
          PPDT Test Structure
        </h2>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded-lg">
            <h3 className="font-semibold text-lg text-slate-900 mb-1">
              Step 1: Picture Perception
            </h3>
            <p className="text-slate-800">
              A blurred picture is shown for{" "}
              <span className="font-semibold text-orange-700">30 seconds</span>.
              Observe carefully and note key details.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 border-l-4 border-green-600 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-lg text-slate-900 mb-1">
              Step 2: Story Writing (4 Minutes)
            </h3>
            <p className="text-slate-800">
              Write a short, logical story approx 100-120 words including:
            </p>
            <ul className="list-disc pl-6 text-slate-800 mt-2">
              <li>
                <strong>Number of characters</strong>
              </li>
              <li>
                <strong>Age, gender, and mood</strong>
              </li>
              <li>
                <strong>Action</strong>
              </li>

              <li>
                <strong>Past – Present – Future</strong>
              </li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="p-4 border-l-4 border-blue-600 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-lg text-slate-900 mb-1">
              Step 3: Story Narration
            </h3>
            <p className="text-slate-800">
              Narrate your story <strong>clearly and confidently</strong> to the
              group.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 border-l-4 border-purple-600 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-lg text-slate-900 mb-1">
              Step 4: Group Discussion
            </h3>
            <p className="text-slate-800">
              Discuss all stories and help the group arrive at a{" "}
              <strong>common conclusion</strong> without aggression.
            </p>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">
          Important Tips
        </h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <ul className="list-disc pl-6 text-slate-800 space-y-1">
            <li>
              Keep your story <strong>positive and realistic</strong>
            </li>
            <li>
              Write <strong>clearly and logically</strong>
            </li>
            <li>
              Speak with <strong>confidence</strong>
            </li>
            <li>
              Show <strong>cooperation</strong> during discussion
            </li>
          </ul>
        </div>
      </section>

      {/* Final Note */}
      <section className="bg-slate-900 text-white p-5 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Final Note</h2>
        <p className="mb-4">
          PPDT is one of the first screening tests in SSB. Candidates are judged
          on <strong>thinking ability, expression, and teamwork</strong> — not
          just the story.
        </p>

        {/* Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/practice/ppdt/sample")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            View Sample PPDT →
          </button>
        </div>
      </section>
    </div>
  );
};

export default PPDTSteps;
