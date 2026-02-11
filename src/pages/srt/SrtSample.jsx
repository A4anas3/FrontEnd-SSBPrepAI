import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import TestCard from "@/components/TestCard.jsx";
import ConfirmAlert from "@/components/ConfirmAlert";
import { useSrtTestNames } from "@/hooks/srt/useSrt";
import { useSrtAdmin } from "@/hooks/srt/useSrtAdmin";
import srtImage from "@/assets/card-srt.jpg";
import { BookOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";

const SrtSample = () => {
  const { user } = useAuth();
  // ✅ compute admin ONCE
  const isUserAdmin = isAdmin(user);

  const { data, isLoading, error } = useSrtTestNames();
  const { deleteSrt } = useSrtAdmin();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  /* ================= HANDLERS ================= */

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowAlert(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    await deleteSrt(selectedId);
    setShowAlert(false);
    setSelectedId(null);
  };

  const handleCancelDelete = () => {
    setShowAlert(false);
    setSelectedId(null);
  };

  const handleEdit = (id) => {
    navigate(`/admin/srt/edit/${id}`);
  };

  /* ================= STATES ================= */

  if (isLoading) {
    return (
      <section className="py-16 pt-24 bg-background">
        <Header />
        <p className="text-center mt-20 text-muted-foreground">
          Loading SRT tests...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 pt-24 bg-background">
        <Header />
        <p className="text-center mt-20 text-red-500">Error loading tests</p>
      </section>
    );
  }

  /* ================= UI ================= */

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4">
        {/* ✅ Heading + Admin Button */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
          <SectionTitle
            title="Sample SRT Tests"
            subtitle="Explore sample Situation Reaction Tests with guidance and ideal responses."
          />

          {/* ✅ Admin-only Add button */}
          {isUserAdmin && (
            <button
              onClick={() => navigate("/admin/srt/add")}
              className="mt-4 lg:mt-0 inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              <Plus size={18} />
              Add SRT Test
            </button>
          )}
        </div>

        {/* ✅ Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((test, index) => (
            <TestCard
              key={test.id}
              title={`Sample ${index + 1}`}
              description="✅ Tip: Focus on practical, responsible, and realistic actions in this sample test."
              image={srtImage}
              icon={BookOpen}
              href={`/srt/sample/${test.id}`}
              size="small"
              /* ✅ Admin-only actions */
              showDelete={isUserAdmin}
              onDelete={() => handleDeleteClick(test.id)}
              showEdit={isUserAdmin}
              onEdit={() => handleEdit(test.id)}
            />
          ))}
        </div>
      </div>

      {/* ✅ Confirm Delete Alert */}
      <ConfirmAlert
        show={showAlert}
        title="Delete SRT Test"
        message="Are you sure you want to delete this SRT test? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </section>
  );
};

export default SrtSample;
