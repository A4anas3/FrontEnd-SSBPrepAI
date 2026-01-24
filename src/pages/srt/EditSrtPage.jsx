import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSrtTestDetail } from "@/hooks/srt/useSrt";
import { useSrtAdmin } from "@/hooks/srt/useSrtAdmin";

const EditSrtPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useSrtTestDetail(id);
  const { patchSrt, isUpdating } = useSrtAdmin();

  const [testName, setTestName] = useState("");
  const [situations, setSituations] = useState([]);

  // ✅ Load data into state
  useEffect(() => {
    if (data) {
      setTestName(data.testName);
      setSituations(data.situations || []);
    }
  }, [data]);

  // ✅ Handle change
  const handleChange = (index, field, value) => {
    const updated = [...situations];
    updated[index] = { ...updated[index], [field]: value };
    setSituations(updated);
  };

  // ✅ Save changes (PATCH each situation)
  const handleSave = async () => {
    try {
      await patchSrt({
        id,
        payload: {
          testName,
          situations,
        },
      });

      alert("SRT Test Updated Successfully ✅");
      navigate("/srt/sample");
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTitle
          title="Edit SRT Test"
          subtitle="Update situations and reactions in this SRT test."
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
                value={s.situation}
                onChange={(e) =>
                  handleChange(index, "situation", e.target.value)
                }
              />

              <textarea
                className="w-full border rounded-lg p-3 text-sm"
                rows={2}
                value={s.reaction}
                onChange={(e) =>
                  handleChange(index, "reaction", e.target.value)
                }
              />
            </div>
          ))}
        </div>

        {/* ✅ Save Button */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={() => navigate("/srt/sample")}
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

export default EditSrtPage;
