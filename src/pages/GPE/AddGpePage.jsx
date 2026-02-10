import Header from "@/components/Header.jsx";
import SectionTitle from "@/components/SectionTitle.jsx";
import AddGpeModel from "@/pages/GPE/AddGpeModel";

const AddGpePage = () => {
  return (
    <section className="py-16 pt-24 bg-background min-h-screen">
      <Header />

      <div className="container mx-auto px-4 max-w-4xl">
        <SectionTitle
          title="Create New GPE"
          subtitle="Add a new Group Planning Exercise scenario."
          centered
        />

        {/* ✅ Render form directly (not modal style) */}
        <div className="bg-card border border-sky-border rounded-xl p-6 shadow-sm">
          <AddGpeModel open={true} onClose={() => {}} />
        </div>
      </div>
    </section>
  );
};

export default AddGpePage;
