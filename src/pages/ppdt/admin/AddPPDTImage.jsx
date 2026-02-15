import Header from "@/components/Header";
import { useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { useAddPPDTImage } from "@/hooks/usePPDTAdmin";

const AddPPDTImage = () => {
  const [form, setForm] = useState({
    imageContext: "",
    guide: "",
    isSample: false,
    action: "",
    sampleStory: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const [alert, setAlert] = useState({
    type: "", // "success" | "error"
    message: "",
  });

  const addMutation = useAddPPDTImage();

  const closeAlert = () => {
    setAlert({ type: "", message: "" });
  };

  const handleSubmit = () => {
    // frontend validation
    if (
      !imageFile ||
      !form.imageContext ||
      !form.guide ||
      !form.action ||
      !form.sampleStory
    ) {
      setAlert({
        type: "error",
        message: "All fields are required ❌",
      });
      setTimeout(closeAlert, 3000);
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("imageContext", form.imageContext);
    formData.append("guide", form.guide);
    formData.append("isSample", form.isSample);
    formData.append("action", form.action);
    formData.append("sampleStory", form.sampleStory);

    addMutation.mutate(formData, {
      onSuccess: () => {
        setAlert({
          type: "success",
          message: "PPDT Image added successfully ✅",
        });

        setForm({
          imageContext: "",
          guide: "",
          isSample: false,
          action: "",
          sampleStory: "",
        });
        setImageFile(null);

        setTimeout(closeAlert, 3000);
      },
      onError: (error) => {
        if (error.response?.status === 409) {
          setAlert({
            type: "error",
            message: "Image URL already exists ❌",
          });
        } else {
          setAlert({
            type: "error",
            message: "Something went wrong ❌",
          });
        }

        setTimeout(closeAlert, 3000);
      },
    });
  };

  return (
    <section className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <Header />

      {/* CENTER ALERT */}
      {alert.message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className={`relative px-6 py-4 rounded-xl shadow-xl text-white text-lg font-semibold min-w-[320px]
              ${alert.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={closeAlert}
              className="absolute top-2 right-2 text-white hover:text-gray-200 text-xl font-bold"
            >
              ×
            </button>

            {alert.message}
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto px-4">
        {/* CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          {/* CARD HEADER */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <ImagePlus className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Add PPDT Image
              </h1>
              <p className="text-sm text-gray-500">
                Admin panel – create new PPDT practice image
              </p>
            </div>
          </div>

          {/* IMAGE FILE */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <div className="border p-2 rounded-lg flex items-center gap-3 bg-gray-50/50">
              <Upload size={18} className="text-gray-500" />
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
          </div>

          {/* IMAGE CONTEXT */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Context
            </label>
            <textarea
              rows={3}
              placeholder="Describe the situation shown in the image"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.imageContext}
              onChange={(e) =>
                setForm({ ...form, imageContext: e.target.value })
              }
            />
          </div>

          {/* GUIDE */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guide / Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Key points admin wants candidates to focus on"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.guide}
              onChange={(e) => setForm({ ...form, guide: e.target.value })}
            />
          </div>

          {/* IS SAMPLE CHECKBOX */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="isSample"
              checked={form.isSample}
              onChange={(e) =>
                setForm({ ...form, isSample: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isSample"
              className="text-sm font-medium text-gray-700 select-none cursor-pointer"
            >
              Is this a Sample (Solved) Image?
            </label>
          </div>

          {/* ACTION */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <input
              type="text"
              placeholder="e.g. Rescuing the drowning person"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.action}
              onChange={(e) => setForm({ ...form, action: e.target.value })}
            />
          </div>

          {/* SAMPLE STORY */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sample Story
            </label>
            <textarea
              rows={5}
              placeholder="Write the full sample story here..."
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.sampleStory}
              onChange={(e) =>
                setForm({ ...form, sampleStory: e.target.value })
              }
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={addMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
          >
            {addMutation.isPending ? "Adding Image..." : "Add Image"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AddPPDTImage;
