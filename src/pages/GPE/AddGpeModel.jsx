import { useState } from "react";
import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import { useGpeAdmin } from "@/hooks/gpe/useGpeAdmin";
import { Plus, Trash2, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddGpeModel = () => {
  const { createGpe, isCreating } = useGpeAdmin();
  const navigate = useNavigate();

  const initialForm = {
    imageUrl: "",
    question: "",
    overview: "", // ✅ matches backend

    sample: true,
    plans: [],
  };

  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);

  // ✅ Add Plan
  const addPlan = () => {
    setForm((prev) => ({
      ...prev,
      plans: [...prev.plans, { heading: "", explanation: [""] }],
    }));
  };

  // ✅ Update Plan Heading
  const updatePlanHeading = (index, value) => {
    const newPlans = [...form.plans];
    newPlans[index].heading = value;
    setForm({ ...form, plans: newPlans });
  };

  // ✅ Add Explanation Point
  const addPoint = (index) => {
    const newPlans = [...form.plans];
    newPlans[index].explanation.push("");
    setForm({ ...form, plans: newPlans });
  };

  // ✅ Update Explanation Point
  const updatePoint = (i, j, value) => {
    const newPlans = [...form.plans];
    newPlans[i].explanation[j] = value;
    setForm({ ...form, plans: newPlans });
  };

  // ✅ Remove Explanation Point
  const removePoint = (i, j) => {
    const newPlans = [...form.plans];
    newPlans[i].explanation.splice(j, 1);
    setForm({ ...form, plans: newPlans });
  };

  // ✅ Remove Plan
  const removePlan = (index) => {
    const newPlans = [...form.plans];
    newPlans.splice(index, 1);
    setForm({ ...form, plans: newPlans });
  };

  // ✅ Submit
  const handleSubmit = async () => {
    try {
      await createGpe({ gpe: form, image: imageFile });
      navigate("/gpe/sample"); // redirect after save
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error creating GPE:", err);
      }
    }
  };

  return (
    <section className="py-16 pt-24 bg-background min-h-screen">
      <Header />

      <div className="container mx-auto px-4 max-w-4xl">
        <SectionTitle
          title="Create New GPE"
          subtitle="Add a new Group Planning Exercise scenario."
          centered
        />

        <div className="bg-card border border-sky-border rounded-xl p-6 shadow-sm space-y-3">
          {/* ✅ Question */}
          <textarea
            placeholder="Full GPE Situation / Question"
            className="w-full border p-2 rounded"
            rows={3}
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
          />
          {/* ✅ Overview */}
          <textarea
            placeholder="Overview (Short Summary)"
            className="w-full border p-2 rounded"
            rows={2}
            value={form.overview}
            onChange={(e) => setForm({ ...form, overview: e.target.value })}
          />

          {/* ✅ Image URL */}
          {/* ✅ Image File */}
          <div className="border p-2 rounded flex items-center gap-3 bg-gray-50/50">
            <Upload size={18} className="text-gray-500" />
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>

          {/* ✅ Sample Toggle */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.sample}
              onChange={(e) => setForm({ ...form, sample: e.target.checked })}
            />
            <span className="text-sm text-muted-foreground">
              Mark as Sample GPE
            </span>
          </div>

          {/* ✅ Plans */}
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
                {/* Plan Heading */}
                <div className="flex gap-2 mb-2">
                  <input
                    placeholder={`Plan ${i + 1} Heading`}
                    className="w-full border p-2 rounded"
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

                {/* Explanation Points */}
                {plan.explanation.map((p, j) => (
                  <div key={j} className="flex gap-2 mb-2">
                    <input
                      placeholder={`Point ${j + 1}`}
                      className="w-full border p-2 rounded"
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

          {/* ✅ Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCreating}
              className={`px-5 py-2 bg-green-600 text-white rounded ${
                isCreating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isCreating ? "Saving..." : "Save GPE"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddGpeModel;
