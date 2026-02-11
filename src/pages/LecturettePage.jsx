import { useEffect, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import TestCard from "@/components/TestCard";
import {
  useLecturettes,
  useLecturetteSearch,
} from "@/hooks/lecturette/useLecturettes";
import { useToast } from "@/components/ui/use-toast";
import Header from "../components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Plus } from "lucide-react";
import { useLecturetteAdmin } from "@/hooks/lecturette/useLecturetteAdmin";
import AddLecturetteModal from "@/pages/Lecturette/AddLecturetteModal";
import { isAdmin } from "@/config/admin"; // ✅ IMPORT ADMIN FLAG
import { useAuth } from "@/lib/AuthContext";

const categories = ["All", "Defence", "Social", "Education", "Technology"];

const LecturettePage = () => {
  const { user } = useAuth();
  const isUserAdmin = isAdmin(user);

  const { toast } = useToast();
  const { data, isLoading, refetch } = useLecturettes();
  const { search, filterByCategory } = useLecturetteSearch();
  const { deleteLecturette } = useLecturetteAdmin();

  const [lecturettes, setLecturettes] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [deleteId, setDeleteId] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    if (data) setLecturettes(data);
  }, [data]);

  const handleSearch = async (value) => {
    setKeyword(value);
    if (!value) {
      setLecturettes(data || []);
      return;
    }

    try {
      const res = await search.mutateAsync(value);
      setLecturettes(res);
    } catch {
      toast({
        title: "Error",
        description: "Search failed",
        variant: "destructive",
      });
    }
  };

  const handleCategoryChange = async (value) => {
    setCategory(value);

    if (value === "All") {
      setLecturettes(data || []);
      return;
    }

    try {
      const res = await filterByCategory.mutateAsync(value);
      setLecturettes(res);
    } catch {
      toast({
        title: "Error",
        description: "Category filter failed",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLecturette.mutateAsync(deleteId);
      toast({
        title: "Deleted",
        description: "Lecturette deleted successfully",
      });
      setDeleteId(null);
      refetch();
    } catch {
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Lecturette Topics"
          subtitle="Search and filter lecturette topics for SSB preparation"
          centered
        />

        {/* Search + Filter + Add Button */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 max-w-4xl mx-auto items-center">
          <input
            type="text"
            placeholder="Search lecturette..."
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full md:flex-1 px-4 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-accent outline-none"
          />

          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full md:w-40 px-3 py-2 rounded-lg border border-border bg-card focus:ring-2 focus:ring-accent outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* ✅ Add Button ONLY for Admin */}
          {isUserAdmin && (
            <button
              onClick={() => setOpenAdd(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 whitespace-nowrap"
            >
              <Plus size={18} /> Add Lecturette
            </button>
          )}
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : lecturettes.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No lecturette found.
          </p>
        ) : (
          <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {lecturettes.map((item) => (
              <TestCard
                key={item.id}
                title={item.title}
                description="Click to read lecturette"
                image="/lecturette-default.jpg"
                href={`/lecturette/${item.id}`}
                // ✅ Delete icon ONLY for Admin
                showDelete={isUserAdmin}
                onDelete={() => setDeleteId(item.id)}
                size="small"
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ Add Modal (Admin Only) */}
      {isUserAdmin && (
        <AddLecturetteModal open={openAdd} onClose={() => setOpenAdd(false)} />
      )}

      {/* Delete Confirmation Modal (Admin Only) */}
      {isUserAdmin && deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-87.5 shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Delete Lecturette?</h2>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to delete this lecturette?
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

export default LecturettePage;
