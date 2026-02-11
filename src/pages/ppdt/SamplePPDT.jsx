import { useState } from "react";
import { toSecureUrl } from "@/lib/utils";
import Header from "@/components/Header";
import { useSamplePPDT } from "@/hooks/useSamplePPDT";
import {
  useDeletePPDTImage,
  useToggleSamplePPDTImage,
} from "@/hooks/usePPDTAdmin";
import { Trash2, Star, StarOff, Check, X } from "lucide-react";
import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";

/* ================= LOADING SPINNER ================= */
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-32">
    <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
    <p className="mt-3 text-sm text-gray-600 font-medium">
      Loading sample PPDT...
    </p>
  </div>
);

/* ================= SECTION (PURE UI) ================= */
const Section = ({ title, children, highlight, success }) => {
  let bg = "";
  if (highlight) bg = "bg-yellow-50";
  if (success) bg = "bg-green-50";

  return (
    <div className={`mb-3 p-3 rounded-xl text-sm ${bg}`}>
      <h3 className="font-semibold mb-1 text-gray-900">{title}</h3>
      <div className="text-gray-700 whitespace-pre-line">{children}</div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const SamplePPDT = () => {
  const { user } = useAuth();
  // ✅ compute admin ONCE
  const isUserAdmin = isAdmin(user);

  const { data, isLoading, isError } = useSamplePPDT();
  const deleteMutation = useDeletePPDTImage();
  const toggleMutation = useToggleSamplePPDTImage();

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmToggleId, setConfirmToggleId] = useState(null);

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= STATES ================= */
  if (isLoading) {
    return (
      <section className="pt-24">
        <Header />
        <LoadingSpinner />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="pt-24">
        <Header />
        <div className="text-center py-32 text-red-500 font-medium">
          Failed to load sample PPDT
        </div>
      </section>
    );
  }

  if (!data || data.length === 0) {
    return (
      <section className="pt-24">
        <Header />
        <div className="text-center py-32 text-gray-500 font-medium">
          No sample PPDT stories available.
        </div>
      </section>
    );
  }

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  /* ================= UI ================= */
  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl font-bold text-navy mb-6">
          Sample Stories for PPDT
        </h1>

        {paginatedData.map((ppdt, index) => (
          <div
            key={ppdt.id}
            className="mb-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200 relative"
          >
            {/* ================= ADMIN ICONS ================= */}
            {isUserAdmin && (
              <div className="absolute top-4 right-4 flex gap-2">
                {/* TOGGLE SAMPLE */}
                <button
                  onClick={() =>
                    setConfirmToggleId(
                      confirmToggleId === ppdt.id ? null : ppdt.id,
                    )
                  }
                  className={`p-2 rounded-full border ${ppdt.isSample
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                    }`}
                >
                  {ppdt.isSample ? <StarOff size={16} /> : <Star size={16} />}
                </button>

                {/* DELETE */}
                <button
                  onClick={() =>
                    setConfirmDeleteId(
                      confirmDeleteId === ppdt.id ? null : ppdt.id,
                    )
                  }
                  className="p-2 rounded-full bg-red-100 text-red-600 border"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {/* ================= CONFIRM TOGGLE ================= */}
            {confirmToggleId === ppdt.id && (
              <div className="mb-4 p-3 rounded-lg bg-yellow-50 flex items-center justify-between text-sm">
                <span>
                  {ppdt.isSample
                    ? "Remove this image from samples?"
                    : "Add this image to samples?"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      toggleMutation.mutate({
                        id: ppdt.id,
                        ...(ppdt.isSample
                          ? {}
                          : {
                            action: "sample",
                            sampleStory: ppdt.sampleStory,
                          }),
                      });
                      setConfirmToggleId(null);
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded flex items-center gap-1"
                  >
                    <Check size={14} /> Confirm
                  </button>
                  <button
                    onClick={() => setConfirmToggleId(null)}
                    className="px-3 py-1 bg-gray-200 rounded flex items-center gap-1"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ================= CONFIRM DELETE ================= */}
            {confirmDeleteId === ppdt.id && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 flex items-center justify-between text-sm">
                <span>Delete this PPDT image permanently?</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      deleteMutation.mutate(ppdt.id);
                      setConfirmDeleteId(null);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-1"
                  >
                    <Check size={14} /> Delete
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-3 py-1 bg-gray-200 rounded flex items-center gap-1"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            )}

            <h2 className="text-lg font-semibold mb-4">
              Sample PPDT {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
            </h2>

            <div className="flex justify-center mb-5">
              <img
                src={toSecureUrl(ppdt.imageUrl)}
                alt="PPDT"
                className="w-full max-w-sm rounded-xl"
              />
            </div>

            {ppdt.imageContext && (
              <Section title="Image Context">{ppdt.imageContext}</Section>
            )}
            {ppdt.guide && (
              <Section title="Guide" highlight>
                {ppdt.guide}
              </Section>
            )}
            {ppdt.action && (
              <Section title="Action Taken">{ppdt.action}</Section>
            )}
            {ppdt.sampleStory && (
              <Section title="Sample Story" success>
                {ppdt.sampleStory}
              </Section>
            )}
          </div>
        ))}

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-center mt-10 gap-2 flex-wrap">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${currentPage === i + 1
                ? "bg-green-500 text-white"
                : "bg-gray-50 hover:bg-yellow-500"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SamplePPDT;
