import { useState } from "react";
import { toSecureUrl } from "@/lib/utils";
import SectionTitle from "@/components/SectionTitle.jsx";
import Header from "@/components/Header.jsx";
import TestCard from "@/components/TestCard.jsx";
import { useGpeTest } from "@/hooks/gpe/useGPE";
import { useGpeAdmin } from "@/hooks/gpe/useGpeAdmin";
import { isAdmin } from "@/config/admin";
import { useNavigate } from "react-router-dom";

const GpeTestPage = () => {
  // ✅ compute admin ONCE
  const isUserAdmin = isAdmin();

  const navigate = useNavigate();
  const { data: testList, isLoading, error } = useGpeTest();
  const { deleteGpe, isDeleting } = useGpeAdmin();

  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteGpe(deleteId);
      setDeleteId(null);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Delete failed:", err);
      }
    }
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <section className="py-16 pt-24 bg-background">
        <Header />
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading GPE tests...</p>
        </div>
      </section>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <section className="py-16 pt-24 bg-background">
        <Header />
        <div className="container mx-auto px-4 text-center text-red-500">
          Failed to load GPE tests.
        </div>
      </section>
    );
  }

  /* ================= UI ================= */
  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTitle
          title="GPE Practice Tests"
          subtitle="Attempt real SSB Group Planning Exercise test scenarios."
          centered
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testList?.map((gpe, index) => (
            <TestCard
              key={gpe.id}
              title={`GPE Test ${index + 1}`}
              description={`${gpe.question?.slice(0, 80)}...`}
              image={toSecureUrl(gpe.imageUrl)}
              href={`/gpe/test/${gpe.id}`}
              size="normal"
              // ✅ admin-only actions
              showDelete={isUserAdmin}
              onDelete={() => setDeleteId(gpe.id)}
              showEdit={isUserAdmin}
              onEdit={() => navigate(`/admin/gpe/edit/${gpe.id}`)}
              // ✅ non-admin users see blurred image
              blurImage={!isUserAdmin}
            />
          ))}
        </div>
      </div>

      {/* ================= DELETE CONFIRM ================= */}
      {isUserAdmin && deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-87.5 shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Delete GPE Test?</h2>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete this GPE test?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GpeTestPage;
