import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import { useRapidFire } from "@/hooks/interview/useRapidFire";
import { useRapidFireAdmin } from "@/hooks/interview/useRapidFire";
import { ChevronDown, Plus, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";

const RapidFirePage = () => {
  const { user } = useAuth();
  // ✅ compute admin ONCE
  const isUserAdmin = isAdmin(user);

  const navigate = useNavigate();
  const { data, isLoading, error } = useRapidFire();
  const { deleteRapidFire } = useRapidFireAdmin();

  const [openId, setOpenId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = async () => {
    await deleteRapidFire(deleteId);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <section className="py-16 pt-24 bg-background">
        <Header />
        <div className="container mx-auto px-4 text-center">
          Loading Rapid Fire Questions...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 pt-24 bg-background">
        <Header />
        <div className="container mx-auto px-4 text-center text-red-500">
          Failed to load data.
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* ✅ Title + Admin Add Button */}
        <div className="flex justify-between items-center mb-4">
          <SectionTitle
            title="Rapid Fire Questions"
            subtitle="Learn how to answer quickly, confidently, and honestly in SSB interview."
          />

          {isUserAdmin && (
            <button
              onClick={() => navigate("/admin/rapid-fire/add")}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
            >
              <Plus size={18} /> Add Sequence
            </button>
          )}
        </div>

        {/* ✅ Tips */}
        <div className="bg-card border border-sky-border rounded-xl p-5 mb-8 text-sm text-muted-foreground">
          <ul className="list-disc pl-5 space-y-2">
            <li>Answer confidently and clearly.</li>
            <li>Do not memorise answers from books.</li>
            <li>Be honest and consistent.</li>
            <li>Keep answers short and structured.</li>
          </ul>
        </div>

        {/* ✅ Sequences */}
        <div className="space-y-4">
          {data?.map((seq) => {
            const isOpen = openId === seq.id;

            return (
              <div
                key={seq.id}
                className="border border-sky-border rounded-xl bg-sky-50/60 dark:bg-sky-900/20 relative"
              >
                {/* ✅ Admin Icons */}
                {isUserAdmin && (
                  <div className="absolute top-3 right-3 flex gap-2">
                    {/* Edit */}
                    <button
                      onClick={() =>
                        navigate(`/admin/rapid-fire/edit/${seq.id}`)
                      }
                      className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Pencil size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteId(seq.id)}
                      className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}

                {/* HEADER */}
                <button
                  onClick={() => setOpenId(isOpen ? null : seq.id)}
                  className="w-full flex justify-between items-center p-4 text-left"
                >
                  <div>
                    <h3 className="font-semibold text-primary">
                      Sequence {seq.sequenceNumber}: {seq.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {seq.description}
                    </p>
                  </div>

                  <ChevronDown
                    className={`transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* BODY */}
                {isOpen && (
                  <div className="p-4 border-t border-sky-border space-y-4 text-sm">
                    <div>
                      <h4 className="font-semibold text-primary mb-1">
                        Main Question
                      </h4>
                      <p className="text-muted-foreground">
                        {seq.mainQuestion}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-1">
                        Question Flow
                      </h4>
                      <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        {seq.questionFlow?.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-primary mb-1">
                        Points to Remember
                      </h4>
                      <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        {seq.pointsToRemember?.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    {seq.sampleAnswer && (
                      <div>
                        <h4 className="font-semibold text-primary mb-1">
                          Sample Answer
                        </h4>
                        <p className="text-muted-foreground">
                          {seq.sampleAnswer}
                        </p>
                      </div>
                    )}

                    {seq.notes && (
                      <div className="bg-muted/40 p-3 rounded-lg text-xs text-muted-foreground">
                        ⚠️ {seq.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Delete Alert Modal */}
      {isUserAdmin && deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-87.5 shadow-lg">
            <h2 className="text-lg font-semibold mb-3">
              Delete Rapid Fire Sequence?
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete this sequence?
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
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RapidFirePage;
