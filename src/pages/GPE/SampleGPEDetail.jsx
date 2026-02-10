import { useParams, Link } from "react-router-dom";
import SectionTitle from "@/components/SectionTitle.jsx";
import Header from "@/components/Header.jsx";
import { useGpeDetail } from "@/hooks/gpe/useGPE";
import { ArrowLeft } from "lucide-react";
import { toSecureUrl } from "@/lib/utils";

const SampleGPEDetail = () => {
  const { id } = useParams();
  const { data: gpe, isLoading, error } = useGpeDetail(id);

  if (isLoading) {
    return (
      <section className="py-16 pt-24 bg-background">
        <Header />
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading GPE details...</p>
        </div>
      </section>
    );
  }

  if (error || !gpe) {
    return (
      <section className="py-16 pt-24 bg-background">
        <Header />
        <div className="container mx-auto px-4 text-center text-red-500">
          Failed to load GPE details.
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-5xl">
        {/* 🔙 Back Button */}
        <Link
          to="/gpe/sample"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft size={16} />
          Back to Sample Tests
        </Link>

        <SectionTitle
          title="Sample GPE Scenario"
          subtitle="Analyze the situation and understand the model solution."
          centered
        />

        {/* 🖼️ GPE Image */}
        <div className="mb-8 rounded-xl overflow-hidden border border-sky-border shadow-sm">
          <img
            src={toSecureUrl(gpe.imageUrl)}
            alt="GPE Map"
            className="w-full object-cover"
          />
        </div>

        {/* ❓ Narrative */}
        <div className="bg-card border border-sky-border rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-primary mb-2">Narrative</h3>
          <p className="text-muted-foreground leading-relaxed">
            {gpe.question}
          </p>
        </div>

        {/* ✅ Model Group Plan */}
        {gpe.plans && gpe.plans.length > 0 && (
          <div className="bg-card border border-sky-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Model Group Plan
            </h3>

            <div className="space-y-4">
              {gpe.plans.map((plan, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-muted/40 border border-sky-border"
                >
                  <h4 className="font-semibold text-primary mb-2">
                    Step {index + 1}: {plan.heading}
                  </h4>

                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {plan.explanation.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 📝 Short Advice */}
        <p className="mt-6 text-xs text-muted-foreground italic text-center">
          Note: This is only a sample solution. Candidates should frame their
          own plan based on their understanding of the situation.
        </p>
      </div>
    </section>
  );
};

export default SampleGPEDetail;
