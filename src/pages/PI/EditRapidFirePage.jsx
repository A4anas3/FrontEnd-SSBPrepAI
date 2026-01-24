import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import {
  useRapidFireDetail,
  useRapidFireAdmin,
} from "@/hooks/interview/useRapidFire";
import { Plus, Trash2 } from "lucide-react";

const EditRapidFirePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useRapidFireDetail(id);
  const { patchRapidFire } = useRapidFireAdmin();

  const [form, setForm] = useState(null);

  // ✅ Load existing data into form
  useEffect(() => {
    if (data) {
      setForm({
        sequenceNumber: data.sequenceNumber || 1,
        title: data.title || "",
        description: data.description || "",
        mainQuestion: data.mainQuestion || "",
        questionFlow: data.questionFlow || [],
        pointsToRemember: data.pointsToRemember || [],
        sampleAnswer: data.sampleAnswer || "",
        notes: data.notes || "",
      });
    }
  }, [data]);

  if (isLoading || !form) {
    return <p className="text-center mt-20">Loading sequence...</p>;
  }

  // ✅ Helpers for arrays
  const addFlow = () => {
    setForm((prev) => ({
      ...prev,
      questionFlow: [...prev.questionFlow, ""],
    }));
  };

  const updateFlow = (i, value) => {
    const arr = [...form.questionFlow];
    arr[i] = value;
    setForm({ ...form, questionFlow: arr });
  };

  const removeFlow = (i) => {
    const arr = [...form.questionFlow];
    arr.splice(i, 1);
    setForm({ ...form, questionFlow: arr });
  };

  const addTip = () => {
    setForm((prev) => ({
      ...prev,
      pointsToRemember: [...prev.pointsToRemember, ""],
    }));
  };

  const updateTip = (i, value) => {
    const arr = [...form.pointsToRemember];
    arr[i] = value;
    setForm({ ...form, pointsToRemember: arr });
  };

  const removeTip = (i) => {
    const arr = [...form.pointsToRemember];
    arr.splice(i, 1);
    setForm({ ...form, pointsToRemember: arr });
  };

  // ✅ Submit PATCH
  const handleUpdate = async () => {
    try {
      await patchRapidFire({ id, payload: form });
      navigate("/pi/rapid-fire"); // redirect after update
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <section className="py-16 pt-24 bg-background min-h-screen">
      <Header />

      <div className="container mx-auto px-4 max-w-4xl">
        <SectionTitle
          title="Edit Rapid Fire Sequence"
          subtitle="Update rapid fire interview sequence."
          centered
        />

        <div className="bg-card border border-sky-border rounded-xl p-6 space-y-3">
          {/* Sequence Number */}
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Sequence Number"
            value={form.sequenceNumber}
            onChange={(e) =>
              setForm({ ...form, sequenceNumber: Number(e.target.value) })
            }
          />

          {/* Title */}
          <input
            className="w-full border p-2 rounded"
            placeholder="Title (e.g. Work History)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          {/* Description */}
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Short description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* Main Question */}
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Main Question"
            rows={3}
            value={form.mainQuestion}
            onChange={(e) => setForm({ ...form, mainQuestion: e.target.value })}
          />

          {/* Question Flow */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Question Flow</h3>
              <button
                onClick={addFlow}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded"
              >
                <Plus size={16} /> Add Point
              </button>
            </div>

            {form.questionFlow.map((q, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="w-full border p-2 rounded"
                  placeholder={`Point ${i + 1}`}
                  value={q}
                  onChange={(e) => updateFlow(i, e.target.value)}
                />
                <button onClick={() => removeFlow(i)} className="text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Points to Remember */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Points to Remember</h3>
              <button
                onClick={addTip}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded"
              >
                <Plus size={16} /> Add Tip
              </button>
            </div>

            {form.pointsToRemember.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="w-full border p-2 rounded"
                  placeholder={`Tip ${i + 1}`}
                  value={p}
                  onChange={(e) => updateTip(i, e.target.value)}
                />
                <button onClick={() => removeTip(i)} className="text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Sample Answer */}
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Sample Answer"
            rows={4}
            value={form.sampleAnswer}
            onChange={(e) => setForm({ ...form, sampleAnswer: e.target.value })}
          />

          {/* Notes */}
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Extra Notes"
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-5 py-2 bg-green-600 text-white rounded"
            >
              Update Sequence
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditRapidFirePage;
