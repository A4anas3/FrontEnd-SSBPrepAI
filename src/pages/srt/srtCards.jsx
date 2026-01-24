import SectionTitle from "@/components/SectionTitle.jsx";
import TestCard from "@/components/TestCard.jsx";
import { AlertTriangle, BookOpen, Brain } from "lucide-react";
import srtImage from "@/assets/card-srt.jpg";

const srtCards = [
  {
    title: "About SRT Test",
    description:
      "Understand what the Situation Reaction Test is, its rules, and how it is evaluated in SSB.",
    image: srtImage,
    icon: AlertTriangle,
    href: "/srt/about",
  },
  {
    title: "Sample Situations",
    description:
      "Explore sample SRT situations with ideal responses to understand the test pattern.",
    image: srtImage,
    icon: BookOpen,
    href: "/srt/sample",
  },
  {
    title: "Practice Test & AI Analysis",
    description:
      "Attempt real SRT scenarios and get AI-based analysis of your reactions and personality traits.",
    image: srtImage,
    icon: Brain,
    href: "/srt/practice",
  },
];

const SrtPage = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Situation Reaction Test (SRT)"
          subtitle="Learn concepts, explore examples, and practice with AI-driven feedback."
          centered
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {srtCards.map((card) => (
            <TestCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SrtPage;
