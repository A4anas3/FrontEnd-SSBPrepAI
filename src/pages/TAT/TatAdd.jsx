import Header from "@/components/Header";
import SectionTitle from "@/components/SectionTitle";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

const MAX_IMAGES = 12;

const emptyImage = {
  imageFile: null, // ✅ Changed from imageUrl
  imageContext: "",
  expectedTheme: "",
  story: "",
};

const TatAdd = () => {
  const navigate = useNavigate();

  const [testName, setTestName] = useState("");
  const [images, setImages] = useState([{ ...emptyImage }]);
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE CONTROLS ================= */

  const addImage = () => {
    if (images.length >= MAX_IMAGES) return;
    setImages((prev) => [...prev, { ...emptyImage }]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImage = (index, field, value) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, [field]: value } : img)),
    );
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!testName.trim()) {
      alert("Test name is required");
      return;
    }

    if (images.length !== MAX_IMAGES) {
      alert("Exactly 12 pictures are required for a TAT test.");
      return;
    }

    // validate all have files
    if (images.some((img) => !img.imageFile)) {
      alert("All 12 pictures must have an image file uploaded.");
      return;
    }

    try {
      setLoading(true);

      // 1. Create Test Shell
      const { data: testData } = await api.post("/api/admin/tat/tests", {
        testName,
      });

      const testId = testData.id;

      // 2. Upload Images sequentially
      for (const img of images) {
        const formData = new FormData();
        formData.append("image", img.imageFile);
        formData.append("imageContext", img.imageContext || "");
        formData.append("expectedTheme", img.expectedTheme || "");
        formData.append("story", img.story || "");

        await api.post(`/api/admin/tat/tests/${testId}/image`, formData);
      }

      navigate("/tat/sample");
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error(err);
      }
      alert("Failed to create TAT test. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="pt-24 bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionTitle
            title="Add New TAT Test Set"
            subtitle="A standard TAT consists of 12 pictures. Add them calmly and thoughtfully — quality matters more than decoration."
          />

          {/* TEST NAME */}
          <div className="bg-background p-6 rounded-xl shadow-sm mb-6">
            <label className="block text-sm font-medium mb-2">Test Name</label>
            <input
              type="text"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g. TAT Practice Set 1"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* IMAGE COUNT INFO */}
          <div className="text-sm text-muted-foreground mb-4 text-center">
            {images.length} / {MAX_IMAGES} pictures added
          </div>

          {/* IMAGES */}
          {images.map((img, index) => (
            <div
              key={index}
              className="bg-background p-6 rounded-xl shadow-sm mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Picture {index + 1}</h3>

                {images.length > 1 && (
                  <button
                    onClick={() => removeImage(index)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="border p-2 rounded-lg flex items-center gap-3 bg-gray-50/50">
                  <Upload size={18} className="text-gray-500" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      updateImage(index, "imageFile", e.target.files[0])
                    }
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                <textarea
                  placeholder="Image Context (optional)"
                  value={img.imageContext}
                  onChange={(e) =>
                    updateImage(index, "imageContext", e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-2"
                />

                <input
                  type="text"
                  placeholder="Expected Theme (optional)"
                  value={img.expectedTheme}
                  onChange={(e) =>
                    updateImage(index, "expectedTheme", e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-2"
                />

                <textarea
                  placeholder="Model Story (optional)"
                  value={img.story}
                  onChange={(e) => updateImage(index, "story", e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 min-h-30"
                />
              </div>
            </div>
          ))}

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 pb-10">
            <button
              onClick={addImage}
              disabled={images.length >= MAX_IMAGES}
              className={`border px-6 py-2 rounded-lg font-medium transition
                ${
                  images.length >= MAX_IMAGES
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-muted"
                }
              `}
            >
              + Add Another Picture
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || images.length !== MAX_IMAGES}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create TAT Test"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default TatAdd;
