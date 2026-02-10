import Header from "@/components/Header";
import SectionTitle from "@/components/SectionTitle";
import { Upload } from "lucide-react";
import { toSecureUrl } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/lib/api";

const emptyImage = {
  id: null, // 🔥 IMPORTANT
  imageUrl: "",
  imageFile: null, // For new or replacement images
  imageContext: "",
  expectedTheme: "",
  story: "",
};

const TatEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [testName, setTestName] = useState("");
  const [images, setImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  /* ================= FETCH TEST (FULL ADMIN DATA) ================= */
  useEffect(() => {
    const loadTest = async () => {
      try {
        // 🔥 CHANGE HERE
        const res = await api.get(`/api/tat/tests/sample/${id}`);

        setTestName(res.data.testName);
        setImages(res.data.images || []);
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error(err);
        }
        alert("Failed to load TAT test");
      } finally {
        setPageLoading(false);
      }
    };

    loadTest();
  }, [id]);

  /* ================= IMAGE HELPERS ================= */

  const addImage = () => {
    setImages((prev) => [...prev, { ...emptyImage }]);
  };

  const removeImage = (index) => {
    const img = images[index];
    if (img.id) {
      setDeletedImageIds((prev) => [...prev, img.id]);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImage = (index, field, value) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, [field]: value } : img)),
    );
  };

  /* ================= SAVE (TRUE PATCH) ================= */

  const handleSave = async () => {
    if (!testName.trim()) {
      alert("Test name is required");
      return;
    }

    // Validate: either has id/url OR has a file
    if (images.some((img) => !img.id && !img.imageFile)) {
      alert("New pictures must have a file uploaded.");
      return;
    }

    try {
      setLoading(true);

      // 1. Update Test Name
      await api.patch(`/api/admin/tat/tests/${id}`, {
        testName,
      });

      // 2. Delete Removed Images
      for (const delId of deletedImageIds) {
        await api.delete(`/api/admin/tat/images/${delId}`);
      }

      // 3. Process Images (Update vs Create)
      for (const img of images) {
        const formData = new FormData();
        if (img.imageFile) formData.append("image", img.imageFile);
        formData.append("imageContext", img.imageContext || "");
        formData.append("expectedTheme", img.expectedTheme || "");
        formData.append("story", img.story || "");

        if (img.id) {
          // UPDATE EXISTING
          await api.put(`/api/admin/tat/images/${img.id}`, formData);
        } else {
          // ADD NEW
          await api.post(`/api/admin/tat/tests/${id}/image`, formData);
        }
      }

      navigate("/tat/sample");
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error(err);
      }
      alert("Failed to update TAT test. Check console.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading)
    return <p className="text-center mt-24">Loading TAT test…</p>;

  return (
    <>
      <Header />

      <main className="pt-24 bg-muted/30 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionTitle
            title="Edit TAT Test Set"
            subtitle="Update pictures and reference stories. Candidates will see only the final saved version."
          />

          {/* TEST NAME */}
          <div className="bg-background p-6 rounded-xl shadow-sm mb-6">
            <label className="block text-sm font-medium mb-2">Test Name</label>
            <input
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          {/* IMAGES */}
          {images.map((img, index) => (
            <div
              key={img.id ?? index}
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
                {/* Show current image if available */}
                {img.imageUrl && (
                  <div className="mb-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Current Image:
                    </p>
                    <img
                      src={toSecureUrl(img.imageUrl)}
                      alt="Current"
                      className="h-20 object-contain rounded border"
                    />
                  </div>
                )}

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
                  value={img.imageContext || ""}
                  onChange={(e) =>
                    updateImage(index, "imageContext", e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-2"
                />

                <input
                  placeholder="Expected Theme (optional)"
                  value={img.expectedTheme || ""}
                  onChange={(e) =>
                    updateImage(index, "expectedTheme", e.target.value)
                  }
                  className="w-full border rounded-lg px-4 py-2"
                />

                <textarea
                  placeholder="Model Story (optional)"
                  value={img.story || ""}
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
              className="border px-6 py-2 rounded-lg font-medium hover:bg-muted transition"
            >
              + Add Picture
            </button>

            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default TatEdit;
