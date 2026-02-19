import { useState } from "react";
import { useLecturetteAdmin } from "@/hooks/lecturette/useLecturetteAdmin";
import { X, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchLecturetteCategories } from "@/features/gto/lecturetteapi";

const defaultCategories = ["Defence", "Social", "Education", "Technology", "Science", "Current Affairs", "Sports", "Economy"];

const AddLecturetteModal = ({ open, onClose }) => {
  const { createLecturette } = useLecturetteAdmin();

  // Fetch existing categories from backend
  const { data: backendCategories } = useQuery({
    queryKey: ["lecturette-categories"],
    queryFn: fetchLecturetteCategories,
    enabled: open,
  });

  // Merge backend + default, deduplicate
  const allCategories = [...new Set([
    ...(backendCategories || []),
    ...defaultCategories,
  ])].sort();

  const initialForm = {
    title: "",
    introduction: "",
    conclusion: "",
    category: "",
    subHeadings: [],
  };

  const [form, setForm] = useState(initialForm);

  // ✅ Add Image State
  const [image, setImage] = useState(null);

  // ✅ Add SubHeading
  const addSubHeading = () => {
    setForm((prev) => ({
      ...prev,
      subHeadings: [...prev.subHeadings, { heading: "", explanations: [""] }],
    }));
  };

  // ✅ Update SubHeading Title
  const updateSubHeading = (index, value) => {
    const newSubs = [...form.subHeadings];
    newSubs[index].heading = value;
    setForm({ ...form, subHeadings: newSubs });
  };

  // ✅ Add Point
  const addPoint = (index) => {
    const newSubs = [...form.subHeadings];
    newSubs[index].explanations.push("");
    setForm({ ...form, subHeadings: newSubs });
  };

  // ✅ Update Point
  const updatePoint = (i, j, value) => {
    const newSubs = [...form.subHeadings];
    newSubs[i].explanations[j] = value;
    setForm({ ...form, subHeadings: newSubs });
  };

  // ✅ Remove Point
  const removePoint = (i, j) => {
    const newSubs = [...form.subHeadings];
    newSubs[i].explanations.splice(j, 1);
    setForm({ ...form, subHeadings: newSubs });
  };

  // ✅ Remove SubHeading
  const removeSubHeading = (index) => {
    const newSubs = [...form.subHeadings];
    newSubs.splice(index, 1);
    setForm({ ...form, subHeadings: newSubs });
  };

  // ✅ Submit Form + Reset State
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append(
        "lecturette",
        new Blob([JSON.stringify(form)], { type: "application/json" }),
      );
      if (image) {
        formData.append("image", image);
      }

      await createLecturette.mutateAsync(formData);

      // ✅ Reset form after submit
      setForm(initialForm);
      setImage(null);

      onClose();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error creating lecturette", err);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-187.5 max-h-[90vh] overflow-y-auto shadow-xl relative">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-5">➕ Add Lecturette</h2>

        {/* ✅ Image Upload */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 border rounded hover:bg-gray-100">
            <span className="text-gray-600 font-medium">Add Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />
            {image ? (
              <span className="text-green-600 text-sm ml-2">
                {image.name.slice(0, 15)}...
              </span>
            ) : (
              <span className="text-gray-400 text-sm ml-2">No file chosen</span>
            )}
          </label>
        </div>

        {/* ✅ Title */}
        <input
          placeholder="Lecturette Title"
          className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        {/* ✅ Category Dropdown */}
        <select
          className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* ✅ Introduction */}
        <textarea
          placeholder="Introduction"
          className="w-full border p-2 mb-3 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          rows={3}
          value={form.introduction}
          onChange={(e) => setForm({ ...form, introduction: e.target.value })}
        />

        {/* ================= SUBHEADINGS ================= */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-lg">SubHeadings</h3>
            <button
              onClick={addSubHeading}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus size={16} /> Add SubHeading
            </button>
          </div>

          {form.subHeadings.map((sub, i) => (
            <div key={i} className="border rounded-lg p-3 mb-3 bg-gray-50">
              {/* SubHeading Title */}
              <div className="flex gap-2 mb-2">
                <input
                  placeholder={`SubHeading ${i + 1}`}
                  className="w-full border p-2 rounded"
                  value={sub.heading}
                  onChange={(e) => updateSubHeading(i, e.target.value)}
                />
                <button
                  onClick={() => removeSubHeading(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Points */}
              {sub.explanations.map((p, j) => (
                <div key={j} className="flex gap-2 mb-2">
                  <input
                    placeholder={`Point ${j + 1}`}
                    className="w-full border p-2 rounded"
                    value={p}
                    onChange={(e) => updatePoint(i, j, e.target.value)}
                  />
                  <button
                    onClick={() => removePoint(i, j)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button
                onClick={() => addPoint(i)}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add Point
              </button>
            </div>
          ))}
        </div>

        {/* ✅ Conclusion */}
        <textarea
          placeholder="Conclusion"
          className="w-full border p-2 mb-4 rounded focus:ring-2 focus:ring-blue-400 outline-none"
          rows={3}
          value={form.conclusion}
          onChange={(e) => setForm({ ...form, conclusion: e.target.value })}
        />

        {/* ✅ Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save Lecturette
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLecturetteModal;
