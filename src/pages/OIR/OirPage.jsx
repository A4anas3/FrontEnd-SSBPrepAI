import SectionTitle from "@/components/SectionTitle";
import TestCard from "@/components/TestCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Info, Brain, PlusCircle } from "lucide-react";
import oirImage from "@/assets/card-oir.jpg";

import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";

const oirCards = [
  {
    title: "About OIR Test",
    description:
      "Understand the Officer Intelligence Rating test, its structure, types of questions, and evaluation method in SSB.",
    image: oirImage,
    icon: Info,
    href: "/oir/about",
  },
  {
    title: "Practice OIR Test",
    description:
      "Attempt verbal and non-verbal OIR questions under timed conditions to improve speed, accuracy, and logical reasoning.",
    image: oirImage,
    icon: Brain,
    href: "/oir/practice",
  },
];

const OirPage = () => {
  const { user } = useAuth();
  const isUserAdmin = isAdmin(user);

  return (
    <>
      {/* 🔝 Header */}
      <Header />

      {/* 📄 Page Content */}
      <main className="pt-10 bg-muted/30 min-h-screen">
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <SectionTitle
              title="Officer Intelligence Rating (OIR)"
              subtitle="Learn the basics, understand the pattern, and practice OIR tests for SSB screening."
              centered
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {oirCards.map((card) => (
                <TestCard key={card.title} {...card} />
              ))}

              {/* 🔐 Admin-only Card */}
              {isUserAdmin && (
                <TestCard
                  title="Add New OIR Test"
                  description="Create and manage new OIR question sets for screening practice."
                  image={oirImage}
                  icon={PlusCircle}
                  href="/oir/admin"
                  variant="navy"
                />
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 🔻 Footer */}
      <Footer />
    </>
  );
};

export default OirPage;
