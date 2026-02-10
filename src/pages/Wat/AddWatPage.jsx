import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWatAdmin } from "@/hooks/wat/useWatAdmin";

const AddWatPage = () => {
  const navigate = useNavigate();
  const { createWat, isCreating } = useWatAdmin();

  const [testName, setTestName] = useState("WAT Test 1");

  // ✅ create 60 empty words
  const [words, setWords] = useState(
    Array.from({ length: 60 }, (_, i) => ({
      wordNo: i + 1,
      word: "",
      sentence: "",
    })),
  );

  const handleChange = (index, field, value) => {
    const updated = [...words];
    updated[index] = { ...updated[index], [field]: value };
    setWords(updated);
  };

  const handleSubmit = async () => {
    try {
      await createWat({
        testName,
        words,
      });

      alert("WAT Test Created Successfully ✅");
      navigate("/wat/sample");
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error(err);
      }
      alert("Failed to create test ❌");
    }
  };

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTitle
          title="Add WAT Test"
          subtitle="Create a new Word Association Test with 60 words."
          centered
        />

        {/* ✅ Test Name */}
        <div className="bg-card border border-sky-border rounded-xl p-6 mb-6">
          <label className="block text-sm font-semibold mb-2">Test Name</label>
          <input
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* ✅ Words Form */}
        <div className="space-y-4 max-h-125 overflow-y-auto pr-2">
          {words.map((w, index) => (
            <div
              key={w.wordNo}
              className="bg-white border border-sky-border rounded-xl p-4 shadow-sm"
            >
              <h3 className="font-semibold text-primary mb-2">
                Word {w.wordNo}
              </h3>

              <input
                type="text"
                placeholder="Word"
                value={w.word}
                onChange={(e) => handleChange(index, "word", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
              />

              <textarea
                placeholder="Sample sentence"
                value={w.sentence}
                onChange={(e) =>
                  handleChange(index, "sentence", e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
                rows={2}
              />
            </div>
          ))}
        </div>

        {/* ✅ Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => navigate("/wat/sample")}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isCreating}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            {isCreating ? "Saving..." : "Create Test"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AddWatPage;
