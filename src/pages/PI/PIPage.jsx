import SectionTitle from "@/components/SectionTitle.jsx";
import TestCard from "@/components/TestCard.jsx";
import Header from "@/components/Header.jsx";
import { BookOpen, Zap, HelpCircle, Mic } from "lucide-react";
import piImage from "@/assets/card-pi.jpg";

const piCards = [
  {
    title: "About SSB Interview",
    description: "Learn how the SSB interview works and how to prepare.",
    icon: BookOpen,
    image: piImage,
    href: "/pi/about",
  },
  {
    title: "Rapid Fire Questions",
    description: "Practice fast-paced questions asked by IO.",
    icon: Zap,
    image: piImage,
    href: "/pi/rapid-fire",
  },

  {
    title: "AI Interviewer",
    description: "Practice real-time AI-based mock interview with voice.",
    icon: Mic, // 🎤 mic icon
    image: piImage,
    href: "/pi/ai-interviewer", // ✅ future route
  },
];

const PIPage = () => {
  return (
    <section className="py-16 pt-24 bg-background">
      <Header />

      <div className="container mx-auto px-4 max-w-6xl">
        <SectionTitle
          title="Personal Interview (PI)"
          subtitle="Prepare for SSB Personal Interview with structured practice."
          centered
        />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {piCards.map((card) => (
            <TestCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PIPage;
