import Header from "@/components/Header";
import SectionTitle from "@/components/SectionTitle";
import TestCard from "@/components/TestCard";
import ConfirmAlert from "@/components/ConfirmAlert";

import { useOirTestNames } from "@/hooks/oir/useOir";
import { deleteOir } from "@/features/oir/oirapi";
import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";

import oirImage from "@/assets/card-oir.jpg";
import { Brain, Clock, AlertTriangle } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const OirPracticeList = () => {
  const { user } = useAuth();
  const isUserAdmin = isAdmin(user);

  const { data, isLoading, error } = useOirTestNames();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* ======================
     CONFIRM ALERT STATE
  ====================== */
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState(null);

  /* ======================
     DELETE MUTATION
  ====================== */
  const deleteMutation = useMutation({
    mutationFn: deleteOir,
    onSuccess: () => {
      queryClient.invalidateQueries(["oir"]);
      setShowConfirm(false);
      setSelectedTestId(null);
    },
  });

  if (isLoading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-500">Error loading OIR tests</p>
    );
  }

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTitle
          title="OIR Practice Tests"
          subtitle="Practice Officer Intelligence Rating tests under SSB conditions."
          centered
        />

        {/* ================= INFO SECTION ================= */}
        <div className="mb-10 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-blue-700 text-sm">
            💡 <b>About OIR:</b> Logical reasoning, numerical ability &
            patterns.
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-700 text-sm flex items-center gap-2">
            <Clock size={16} />
            <span>
              <b>Time:</b> Speed + accuracy matter
            </span>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-700 text-sm flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>
              <b>Important:</b> Avoid random guessing
            </span>
          </div>
        </div>

        {/* ================= TEST CARDS ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((test, index) => (
            <TestCard
              key={test.id}
              title={`Test ${index + 1}`}
              description={`${test.totalQuestions} Questions\n\n✅ Practice smart`}
              image={oirImage}
              icon={Brain}
              href={`/oir/practice/${test.id}`}
              size="small"
              /* 🔐 ADMIN FEATURES */
              showEdit={isUserAdmin}
              showDelete={isUserAdmin}
              onEdit={() => navigate(`/oir/admin/edit/${test.id}`)}
              onDelete={() => {
                setSelectedTestId(test.id);
                setShowConfirm(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* ================= CONFIRM DELETE MODAL ================= */}
      <ConfirmAlert
        show={showConfirm}
        title="Delete OIR Test"
        message="This action will permanently delete the test and all its questions."
        onCancel={() => {
          setShowConfirm(false);
          setSelectedTestId(null);
        }}
        onConfirm={() => {
          if (selectedTestId) {
            deleteMutation.mutate(selectedTestId);
          }
        }}
      />
    </section>
  );
};

export default OirPracticeList;
