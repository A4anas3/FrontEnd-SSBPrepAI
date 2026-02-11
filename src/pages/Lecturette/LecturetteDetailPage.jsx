import { useParams } from "react-router-dom";
import { toSecureUrl } from "@/lib/utils";
import { useLecturetteById } from "@/hooks/lecturette/useLecturettes";
import LoadingSpinner from "@/components/LoadingSpinner";
import Header from "@/components/Header";
import { useState } from "react";
import EditLecturetteModal from "@/pages/Lecturette/EditLecturetteModal";
import { Pencil } from "lucide-react";
import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";

const LecturetteDetailPage = () => {
  const { user } = useAuth();
  const isUserAdmin = isAdmin(user);

  const [openEdit, setOpenEdit] = useState(false);

  const { id } = useParams();
  const { data, isLoading, error } = useLecturetteById(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500">Failed to load lecturette</p>
    );
  }

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      {/* ✅ relative container for absolute edit button */}
      <div className="container mx-auto px-4 max-w-4xl relative">
        {/* ✅ Admin Edit Button */}
        {isUserAdmin && (
          <button
            onClick={() => setOpenEdit(true)}
            className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg shadow-md hover:bg-accent/90"
          >
            <Pencil size={16} /> Edit
          </button>
        )}

        {/* Image */}
        <div className="w-full mb-8">
          <img
            src={toSecureUrl(data.imageUrl) || "/lecturette-default.jpg"}
            alt={data.title}
            className="w-full h-auto min-h-35 max-h-48 md:max-h-72 md:min-h-56 object-contain mx-auto rounded-xl shadow-md bg-gray-50"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-6">
          {data.title}
        </h1>

        {/* Introduction */}
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-center">
          {data.introduction}
        </p>

        {/* SubHeadings */}
        {data.subHeadings?.map((sub, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-xl font-semibold text-accent mb-2">
              {index + 1}. {sub.heading}
            </h2>

            <ul className="list-disc pl-6 space-y-2 text-base text-foreground">
              {sub.explanations?.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}

        {/* Conclusion */}
        <div className="mt-10 p-5 bg-card rounded-xl border border-border">
          <h3 className="text-lg font-semibold mb-2 text-primary">
            Conclusion
          </h3>
          <p className="text-base leading-relaxed text-muted-foreground">
            {data.conclusion}
          </p>
        </div>
      </div>

      {/* ✅ Edit Modal should be OUTSIDE content */}
      {isUserAdmin && (
        <EditLecturetteModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          lecturette={data}
        />
      )}
    </section>
  );
};

export default LecturetteDetailPage;
