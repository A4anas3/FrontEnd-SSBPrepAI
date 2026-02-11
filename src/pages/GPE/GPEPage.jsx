import SectionTitle from "@/components/SectionTitle.jsx";
import TestCard from "@/components/TestCard.jsx";
import { Target, BookOpen, PlayCircle, PlusCircle } from "lucide-react";
import gpeImage from "@/assets/card-gpe.jpg";
import Header from "../../components/Header";
import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";

const GPEPage = () => {
  const { user } = useAuth();
  // ✅ compute admin ONCE (inside component)
  const isUserAdmin = isAdmin(user);

  // ✅ base cards (no auth logic here)
  const gpeCards = [
    {
      title: "About GPE",
      description:
        "Learn what GPE is, its rules, procedure, and evaluation criteria in SSB.",
      image: gpeImage,
      icon: BookOpen,
      href: "/gpe/about",
    },
    {
      title: "Sample GPE",
      description:
        "View sample GPE situations with explanations and model solutions.",
      image: gpeImage,
      icon: Target,
      href: "/gpe/sample",
    },
    {
      title: "GPE Test",
      description:
        "Attempt real-time GPE practice tests to improve your planning skills.",
      image: gpeImage,
      icon: PlayCircle,
      href: "/gpe/test",
    },
  ];

  // ✅ admin-only card
  if (isUserAdmin) {
    gpeCards.push({
      title: "Add GPE",
      description: "Create new GPE situations for students.",
      image: gpeImage,
      icon: PlusCircle,
      href: "/admin/gpe/add",
    });
  }

  return (
    <section className="py-16 pt-24 lg:py-24 bg-background">
      <Header />

      <div className="container mx-auto px-4">
        <SectionTitle
          title="Group Planning Exercise (GPE)"
          subtitle="Explore GPE concepts, sample situations, and practice tests."
          centered
        />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {gpeCards.map((card) => (
            <TestCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GPEPage;
