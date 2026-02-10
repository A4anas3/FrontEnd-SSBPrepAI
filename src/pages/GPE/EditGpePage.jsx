import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import { useGpeDetail } from "@/hooks/gpe/useGpe";
import { useGpeAdmin } from "@/hooks/gpe/useGpeAdmin";
import { Plus, Trash2, Upload } from "lucide-react";
import { toSecureUrl } from "@/lib/utils";

const EditGpePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: gpe, isLoading } = useGpeDetail(id);
  const { patchGpe, isUpdating } = useGpeAdmin(); // ✅ correct hook

  const [form, setForm] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // ✅ Load existing data
  useEffect(() => {
    if (gpe) {
      setForm({
        imageUrl: gpe.imageUrl || "",
        question: gpe.question || "",
        overview: gpe.overview || "",
        sample: gpe.sample || false,
        plans: gpe.plans || [],
      });
    }
  }, [gpe]);

  if (isLoading || !form) {
    return <p className="text-center mt-20">Loading GPE...</p>;
  }

  // ✅ Plan handlers
  const addPlan = () => {
    setForm((prev) => ({
      ...prev,
      plans: [...prev.plans, { heading: "", explanation: [""] }],
    }));
  };

  const updatePlanHeading = (index, value) => {
    const plans = [...form.plans];
    plans[index].heading = value;
    setForm({ ...form, plans });
  };

  const addPoint = (index) => {
    const plans = [...form.plans];
    plans[index].explanation.push("");
    setForm({ ...form, plans });
  };

  const updatePoint = (i, j, value) => {
    const plans = [...form.plans];
    plans[i].explanation[j] = value;
    setForm({ ...form, plans });
  };

  const removePoint = (i, j) => {
    const plans = [...form.plans];
    plans[i].explanation.splice(j, 1);
    setForm({ ...form, plans });
  };

  const removePlan = (index) => {
    const plans = [...form.plans];
    plans.splice(index, 1);
    setForm({ ...form, plans });
  };

  // ✅ PATCH UPDATE (CORRECT)
  const handleUpdate = async () => {
    try {
      await patchGpe({
        id,
        gpe: form,
        image: imageFile,
      });

      navigate("/gpe/test");
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Update failed:", err);
      }
    }
  };

  return (
    <section className="py-16 pt-24 bg-background min-h-screen">
      <Header />

      <div className="container mx-auto px-4 max-w-4xl">
        <SectionTitle title="Edit GPE" centered />

        <div className="bg-card border border-sky-border rounded-xl p-6 space-y-3">
          {/* Show existing image URL if available */}
          {form.imageUrl && (
            <div className="mb-2">
              <p className="text-sm text-gray-500 mb-1">Current Image:</p>
              <img
                src={toSecureUrl(form.imageUrl)}
                alt="Current GPE"
                className="h-32 object-cover rounded"
              />
            </div>
          )}

          <div className="border p-2 rounded flex items-center gap-3 bg-gray-50/50">
            <Upload size={18} className="text-gray-500" />
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          <textarea
            className="w-full border p-2 rounded"
            placeholder="Overview"
            rows={2}
            value={form.overview}
            onChange={(e) => setForm({ ...form, overview: e.target.value })}
          />

          <textarea
            className="w-full border p-2 rounded"
            placeholder="GPE Question"
            rows={3}
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.sample}
              onChange={(e) => setForm({ ...form, sample: e.target.checked })}
            />
            <span className="text-sm">Mark as Sample</span>
          </div>

          {/* Plans */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Plans</h3>
              <button
                onClick={addPlan}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded"
              >
                <Plus size={16} /> Add Plan
              </button>
            </div>

            {form.plans.map((plan, i) => (
              <div key={i} className="border rounded-lg p-3 mb-3 bg-gray-50">
                <div className="flex gap-2 mb-2">
                  <input
                    className="w-full border p-2 rounded"
                    placeholder={`Plan ${i + 1}`}
                    value={plan.heading}
                    onChange={(e) => updatePlanHeading(i, e.target.value)}
                  />
                  <button
                    onClick={() => removePlan(i)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {plan.explanation.map((p, j) => (
                  <div key={j} className="flex gap-2 mb-2">
                    <input
                      className="w-full border p-2 rounded"
                      placeholder={`Point ${j + 1}`}
                      value={p}
                      onChange={(e) => updatePoint(i, j, e.target.value)}
                    />
                    <button
                      onClick={() => removePoint(i, j)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addPoint(i)}
                  className="text-sm text-blue-600"
                >
                  + Add Point
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className={`px-5 py-2 bg-green-600 text-white rounded ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isUpdating ? "Updating..." : "Update GPE"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditGpePage;
