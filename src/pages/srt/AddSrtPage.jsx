import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSrtAdmin } from "@/hooks/srt/useSrtAdmin";

const TOTAL_SITUATIONS = 60;

const AddSrtPage = () => {
  const navigate = useNavigate();
  const { createSrt, isCreating } = useSrtAdmin();

  const [testName, setTestName] = useState("");

  const [situations, setSituations] = useState(
    Array.from({ length: TOTAL_SITUATIONS }, (_, i) => ({
      situationNo: i + 1,
      situation: "",
      reaction: "",
    })),
  );

  // ✅ Handle change
  const handleChange = (index, field, value) => {
    const updated = [...situations];
    updated[index] = { ...updated[index], [field]: value };
    setSituations(updated);
  };

  // ✅ Submit Test
  const handleSubmit = async () => {
    try {
      const payload = {
        testName,
        situations,
      };

      await createSrt(payload);

      alert("SRT Test Created Successfully ✅");
      navigate("/srt/sample");
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error(err);
      }
      alert("Failed to create SRT Test ❌");
    }
  };

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTitle
          title="Add New SRT Test"
          subtitle="Create a new Situation Reaction Test with situations and reactions."
          centered
        />

        {/* ✅ Test Name */}
        <div className="bg-card border border-sky-border rounded-xl p-6 mb-6">
          <label className="block text-sm font-semibold mb-2">Test Name</label>
          <input
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="SRT Test 1"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* ✅ Situations Form */}
        <div className="space-y-4">
          {situations.map((s, index) => (
            <div
              key={s.situationNo}
              className="bg-white border border-sky-border rounded-xl p-5 shadow-sm"
            >
              <h3 className="font-semibold text-primary mb-2">
                Situation {s.situationNo}
              </h3>

              <textarea
                className="w-full border rounded-lg p-3 mb-3 text-sm"
                rows={2}
                placeholder="Enter situation..."
                value={s.situation}
                onChange={(e) =>
                  handleChange(index, "situation", e.target.value)
                }
              />

              <textarea
                className="w-full border rounded-lg p-3 text-sm"
                rows={2}
                placeholder="Enter ideal reaction..."
                value={s.reaction}
                onChange={(e) =>
                  handleChange(index, "reaction", e.target.value)
                }
              />
            </div>
          ))}
        </div>

        {/* ✅ Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => navigate("/srt/sample")}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isCreating}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            {isCreating ? "Creating..." : "Create SRT Test"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AddSrtPage;
