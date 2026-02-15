import { useEffect, useState } from "react";
import { useLecturetteAdmin } from "@/hooks/lecturette/useLecturetteAdmin";

const EditLecturetteModal = ({ open, onClose, lecturette }) => {
  const { patchLecturette } = useLecturetteAdmin();

  const [form, setForm] = useState({
    title: "",
    introduction: "",
    conclusion: "",
    category: "",
    subHeadings: [],
  });

  const [image, setImage] = useState(null);

  // ✅ Load previous data into form
  useEffect(() => {
    if (lecturette) {
      setForm({
        title: lecturette.title || "",
        introduction: lecturette.introduction || "",
        conclusion: lecturette.conclusion || "",
        category: lecturette.category || "",
        subHeadings: lecturette.subHeadings || [],
      });
    }
  }, [lecturette]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append(
      "lecturette",
      new Blob([JSON.stringify(form)], { type: "application/json" }),
    );
    if (image) {
      formData.append("image", image);
    }

    await patchLecturette.mutateAsync({
      id: lecturette.id,
      data: formData,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-187.5 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">✏️ Edit Lecturette</h2>

        {/* ✅ Image Upload */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 border rounded hover:bg-gray-100">
            <span className="text-gray-600 font-medium">Change Image</span>
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

        {/* Title */}
        <input
          className="w-full border p-2 mb-3 rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        {/* Category */}
        <input
          className="w-full border p-2 mb-3 rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        {/* Introduction */}
        <textarea
          className="w-full border p-2 mb-3 rounded"
          value={form.introduction}
          onChange={(e) => setForm({ ...form, introduction: e.target.value })}
        />

        {/* SubHeadings */}
        <div className="mb-4">
          {form.subHeadings.map((sub, i) => (
            <div key={i} className="border p-3 rounded mb-3">
              <input
                className="w-full border p-2 mb-2 rounded"
                value={sub.heading}
                onChange={(e) => {
                  const subs = [...form.subHeadings];
                  subs[i].heading = e.target.value;
                  setForm({ ...form, subHeadings: subs });
                }}
              />

              {sub.explanations.map((p, j) => (
                <input
                  key={j}
                  className="w-full border p-2 mb-2 rounded"
                  value={p}
                  onChange={(e) => {
                    const subs = [...form.subHeadings];
                    subs[i].explanations[j] = e.target.value;
                    setForm({ ...form, subHeadings: subs });
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <textarea
          className="w-full border p-2 mb-3 rounded"
          value={form.conclusion}
          onChange={(e) => setForm({ ...form, conclusion: e.target.value })}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLecturetteModal;
