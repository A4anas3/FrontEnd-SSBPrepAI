import Header from "@/components/Header";
import { toSecureUrl } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Trash2, Eye } from "lucide-react";
import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";
import {
  useDeletePPDTImage,
  useToggleSamplePPDTImage,
} from "@/hooks/usePPDTAdmin";
import { usePPDTTestImages } from "@/hooks/usePPDTTest";
import AdminSampleToggleForm from "@/pages/ppdt/admin/AdminSampleToggleForm";
import { useState } from "react";

const PPDTImageSelect = () => {
  const { user } = useAuth();
  // ✅ compute admin ONCE
  const isUserAdmin = isAdmin(user);

  const { data: images = [], isLoading } = usePPDTTestImages();
  const navigate = useNavigate();

  const deleteMutation = useDeletePPDTImage();
  const toggleMutation = useToggleSamplePPDTImage();

  const [activeToggleId, setActiveToggleId] = useState(null);

  if (isLoading) {
    return <div className="py-32 text-center">Loading images...</div>;
  }

  return (
    <section className="pt-24 py-10 bg-gray-50 min-h-screen">
      <Header />

      <div className="container mx-auto max-w-5xl px-4">
        <h1 className="text-3xl font-bold mb-3">PPDT – Image Selection</h1>

        {/* TIPS */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Images are intentionally blurred during the test</li>
            <li>Click image to start PPDT test</li>
            <li>Image visible for 30 seconds only</li>
            <li>Sample image is for reference only</li>
          </ul>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, index) => {
            const canUserOpenTest = !isUserAdmin;

            return (
              <div
                key={img.id}
                className={`relative bg-white rounded-xl shadow transition ${canUserOpenTest
                  ? "cursor-pointer hover:shadow-lg"
                  : "cursor-default"
                  }`}
                onClick={() => {
                  if (canUserOpenTest) {
                    navigate(`/practice/ppdt/test/${img.id}`);
                  }
                }}
              >
                {/* DELETE (ADMIN ONLY) */}
                {isUserAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(img.id);
                    }}
                    className="absolute top-2 left-2 z-20 bg-white p-1 rounded shadow text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                {/* IMAGE */}
                <img
                  src={toSecureUrl(img.imageUrl)}
                  alt="PPDT"
                  className="w-full h-36 object-cover rounded-t-xl"
                />

                {/* BODY */}
                <div className="p-3">
                  <p className="text-sm font-semibold text-center mb-3">
                    Test {index + 1}
                  </p>

                  {/* ✅ User Start Button */}
                  {!isUserAdmin && (
                    <div className="flex justify-center mb-1">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-lg text-xs font-bold shadow-md bg-yellow-400 text-black hover:bg-yellow-500 transition-colors">
                        Start Test
                      </span>
                    </div>
                  )}

                  {/* ADMIN CONTROLS */}
                  {isUserAdmin && (
                    <div className="flex justify-center gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveToggleId(
                            activeToggleId === img.id ? null : img.id,
                          );
                        }}
                        className="px-3 py-1 text-xs rounded bg-gray-100"
                      >
                        Add Sample
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/practice/ppdt/test/${img.id}`);
                        }}
                        className="px-2 py-1 text-xs border rounded"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  )}

                  {/* TOGGLE FORM */}
                  {isUserAdmin && activeToggleId === img.id && (
                    <div className="mt-4">
                      <AdminSampleToggleForm
                        onClose={() => setActiveToggleId(null)}
                        onSubmit={({ action, sampleStory }) =>
                          toggleMutation.mutate(
                            {
                              id: img.id,
                              action,
                              sampleStory,
                            },
                            {
                              onSuccess: () => setActiveToggleId(null),
                            },
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PPDTImageSelect;
