import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import TestCard from "@/components/TestCard.jsx";
import ConfirmAlert from "@/components/ConfirmAlert";

import { useTatTestCards } from "@/hooks/tat/useTat";
import { useTatAdmin } from "@/hooks/tat/useTatAdmin";

import tatImage from "@/assets/card-tat.jpg";
import { Image } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";

const TatSample = () => {
  const { user } = useAuth();
  const isUserAdmin = isAdmin(user);

  const { data, isLoading, error } = useTatTestCards();
  const { deleteTat } = useTatAdmin();
  const navigate = useNavigate();

  /* ✅ Alert State */
  const [showAlert, setShowAlert] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowAlert(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    await deleteTat(selectedId);
    setShowAlert(false);
    setSelectedId(null);
  };

  const handleCancelDelete = () => {
    setShowAlert(false);
    setSelectedId(null);
  };

  const handleEdit = (id) => {
    navigate(`/admin/tat/edit/${id}`);
  };

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;

  if (error)
    return (
      <p className="text-center mt-20 text-red-500">
        Error loading TAT samples
      </p>
    );

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4">
        {/* ✅ Heading */}
        <div className="mb-10">
          <SectionTitle
            title="Sample TAT Tests"
            subtitle="Think of these as your warm-up ground. No timer, no pressure, no judgement. Just observe the picture, read a balanced story, and slowly train your mind to see situations positively — before you step into the real TAT."
          />
        </div>

        {/* ✅ Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((test, index) => (
            <TestCard
              key={test.id}
              title={`Sample ${index + 1}`}
              description="Sample only — read calmly, understand the flow, and notice how problems turn into positive action."
              image={tatImage}
              icon={Image}
              href={`/tat/sample/${test.id}`}
              size="small"
              /* ✅ Admin Controls */
              showDelete={isUserAdmin}
              onDelete={() => handleDeleteClick(test.id)}
              showEdit={isUserAdmin}
              onEdit={() => handleEdit(test.id)}
            />
          ))}
        </div>
      </div>

      {/* ✅ Confirm Delete */}
      <ConfirmAlert
        show={showAlert}
        title="Delete TAT Test"
        message="Are you sure you want to delete this TAT test? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </section>
  );
};

export default TatSample;
