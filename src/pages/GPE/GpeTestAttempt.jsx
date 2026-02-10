import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useGpeDetail } from "@/hooks/gpe/useGPE";
import { toSecureUrl } from "@/lib/utils";

const GpeTestAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: gpe, isLoading } = useGpeDetail(id);

  if (isLoading) {
    return (
      <section className="pt-24">
        <Header />
        <p className="text-center text-muted-foreground">Loading GPE test...</p>
      </section>
    );
  }

  return (
    <section className="pt-24 pb-24 bg-background min-h-screen">
      <Header />

      <div className="container mx-auto px-4 max-w-4xl space-y-6">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          ← Back to GPE Tests
        </button>

        {/* 💡 TOP TIPS */}
        <div className="bg-linear-to-br from-yellow-50 to-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="text-base font-semibold text-amber-800 mb-2">
            💡 Tips Before You Start
          </h3>
          <ul className="list-disc pl-5 text-sm text-amber-800/90 space-y-1">
            <li>First understand the situation, don’t rush to solutions.</li>
            <li>Prioritise life-threatening problems first.</li>
            <li>Use only realistic and available resources.</li>
            <li>Estimate time and distance logically.</li>
            <li>Do not ignore any problem, even minor ones.</li>
          </ul>
        </div>

        {/* 🖼 GPE Image */}
        <div className="border rounded-xl overflow-hidden bg-white">
          <img
            src={toSecureUrl(gpe.imageUrl)}
            alt="GPE Model"
            className="w-full object-contain"
          />
        </div>

        {/* 📄 GPE Question */}
        <div className="bg-card border border-sky-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary mb-3">
            GPE Narrative
          </h2>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {gpe.question}
          </p>
        </div>
      </div>
    </section>
  );
};

export default GpeTestAttempt;
