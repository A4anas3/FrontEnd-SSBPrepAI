import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import TestCard from "@/components/TestCard.jsx";
import ConfirmAlert from "@/components/ConfirmAlert";
import { useWatTestNames } from "@/hooks/wat/useWat";
import { useWatAdmin } from "@/hooks/wat/useWatAdmin";
import watImage from "@/assets/card-wat.jpg";
import { BookOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";

const WatSample = () => {
  const { user } = useAuth();
  // ✅ compute admin ONCE
  const isUserAdmin = isAdmin(user);

  const { data, isLoading, error } = useWatTestNames();
  const { deleteWat } = useWatAdmin();
  const navigate = useNavigate();

  // ✅ Alert State
  const [showAlert, setShowAlert] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  /* ================= HANDLERS ================= */

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowAlert(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    await deleteWat(selectedId);
    setShowAlert(false);
    setSelectedId(null);
  };

  const handleCancelDelete = () => {
    setShowAlert(false);
    setSelectedId(null);
  };

  const handleEdit = (id) => {
    navigate(`/admin/wat/edit/${id}`);
  };

  /* ================= STATES ================= */

  if (isLoading) {
    return (
      <section className="py-16 pt-24 bg-background">
        <Header />
        <p className="text-center mt-20 text-muted-foreground">
          Loading WAT tests...
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
        {/* ✅ Heading + Admin Add Button */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
          <SectionTitle
            title="Sample WAT Tests"
            subtitle="Explore sample Word Association Tests with guidance and tips."
          />

          {/* ✅ Admin Only Add Button */}
          {isUserAdmin && (
            <button
              onClick={() => navigate("/admin/wat/add")}
              className="mt-4 lg:mt-0 inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              <Plus size={18} />
              Add WAT Test
            </button>
          )}
        </div>

        {/* ✅ Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((test, index) => (
            <TestCard
              key={test.id}
              title={`Sample ${index + 1}`}
              description="✅ Tip: Focus on positive, action-oriented responses in this sample test."
              image={watImage}
              icon={BookOpen}
              href={`/wat/sample/${test.id}`}
              size="small"
              /* ✅ Admin Only Icons */
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
        title="Delete WAT Test"
        message="Are you sure you want to delete this WAT test? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </section>
  );
};

export default WatSample;
