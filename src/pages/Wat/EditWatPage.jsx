import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useWatTestDetail } from "@/hooks/wat/useWat";
import { useWatAdmin } from "@/hooks/wat/useWatAdmin";

const EditWatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useWatTestDetail(id);
  const { patchWat, isUpdating } = useWatAdmin();

  const [testName, setTestName] = useState("");
  const [words, setWords] = useState([]);

  // ✅ Load data
  useEffect(() => {
    if (data) {
      setTestName(data.testName);
      setWords(data.words || []);
    }
  }, [data]);

  const handleChange = (index, field, value) => {
    const updated = [...words];
    updated[index] = { ...updated[index], [field]: value };
    setWords(updated);
  };

  const handleSave = async () => {
    try {
      await patchWat({
        id,
        payload: {
          testName,
          words,
        },
      });

      alert("WAT Test Updated Successfully ✅");
      navigate("/wat/sample");
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error(err);
      }
      alert("Update failed ❌");
    }
  };

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTitle
          title="Edit WAT Test"
          subtitle="Update words and sentences in this WAT test."
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

        {/* ✅ Words Edit */}
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
                value={w.word}
                onChange={(e) => handleChange(index, "word", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-2 text-sm"
              />

              <textarea
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
            onClick={handleSave}
            disabled={isUpdating}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default EditWatPage;
