import SectionTitle from "@/components/SectionTitle";
import TestCard from "@/components/TestCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { Info, Image, Brain, PlusCircle } from "lucide-react";

import aboutImg from "@/assets/card-tat.jpg";
import sampleImg from "@/assets/card-tat.jpg";
import testImg from "@/assets/card-tat.jpg";

import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";

const TATPage = () => {
  const { user } = useAuth();
  // ✅ compute admin ONCE
  const isUserAdmin = isAdmin(user);

  // ✅ base cards (no auth logic here)
  const tatCards = [
    {
      title: "About TAT",
      description:
        "Understand what the Thematic Apperception Test is and why it matters in SSB.",
      image: aboutImg,
      icon: Info,
      href: "/tat/about",
    },
    {
      title: "Sample TAT",
      description:
        "View sample pictures and model stories to understand structure and mindset.",
      image: sampleImg,
      icon: Image,
      href: "/tat/sample",
    },
    {
      title: "TAT Test + AI Analysis",
      description:
        "Attempt the real-time TAT test with timer and picture sequence, then get instant AI-based OLQ and personality analysis.",
      image: testImg,
      icon: Brain,
      href: "/tat/test",
    },
  ];

  return (
    <>
      {/* 🔝 Global Header */}
      <Header />

      {/* 📄 Page Content */}
      <main className="pt-10 bg-muted/30 min-h-screen">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <SectionTitle
              title="Thematic Apperception Test (TAT)"
              subtitle="Practice, attempt, and analyze your TAT performance with structured guidance and AI support."
              centered
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tatCards.map((card) => (
                <TestCard key={card.title} {...card} />
              ))}

              {/* ✅ Admin-only card */}
              {isUserAdmin && (
                <TestCard
                  title="Add New TAT Set"
                  description="Upload new TAT pictures, instructions, timers, and AI prompts."
                  image={sampleImg}
                  icon={PlusCircle}
                  href="/tat/admin"
                  variant="navy"
                />
              )}
            </div>
          </div>
        </section>
      </main>

      {/* 🔻 Global Footer */}
      <Footer />
    </>
  );
};

export default TATPage;
