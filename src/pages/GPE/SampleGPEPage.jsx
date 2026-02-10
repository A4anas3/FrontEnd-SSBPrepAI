import { useState } from "react";
import { toSecureUrl } from "@/lib/utils";
import SectionTitle from "@/components/SectionTitle.jsx";
import TestCard from "@/components/TestCard.jsx";
import Header from "@/components/Header.jsx";
import { useSampleGpe } from "@/hooks/gpe/useGPE";
import { useGpeAdmin } from "@/hooks/gpe/useGpeAdmin";
import ConfirmAlert from "@/components/ConfirmAlert";
import { isAdmin } from "@/config/admin";

const SampleGPEPage = () => {
  // ✅ compute admin once
  const isUserAdmin = isAdmin();

  const { data: gpeList, isLoading, error } = useSampleGpe();
  const { deleteGpe } = useGpeAdmin();

  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    await deleteGpe(deleteId);
    setDeleteId(null);
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <section className="py-16 pt-24 bg-background">
        <Header />
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading GPE samples...</p>
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
          Failed to load GPE samples.
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
          title="Sample GPE Tests"
          subtitle="Practice real SSB Group Planning Exercise scenarios."
          centered
        />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {gpeList?.map((gpe, index) => (
            <TestCard
              key={gpe.id}
              title={`Test ${index + 1}`}
              description="Click to view full GPE scenario"
              image={toSecureUrl(gpe.imageUrl)}
              href={`/gpe/sample/${gpe.id}`}
              size="normal"
              variant="default"
              // ✅ admin-only delete
              showDelete={isUserAdmin}
              onDelete={() => setDeleteId(gpe.id)}
            />
          ))}
        </div>
      </div>

      {/* ================= CONFIRM DELETE ================= */}
      <ConfirmAlert
        show={!!deleteId}
        title="Delete GPE?"
        message="Are you sure you want to delete this GPE scenario?"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
};

export default SampleGPEPage;
