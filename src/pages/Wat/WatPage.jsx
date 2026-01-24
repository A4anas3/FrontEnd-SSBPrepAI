import SectionTitle from "@/components/SectionTitle.jsx";
import TestCard from "@/components/TestCard.jsx";
import { Info, BookOpen, Brain } from "lucide-react";
import watImage from "@/assets/card-wat.jpg";

const watCards = [
  {
    title: "About WAT Test",
    description:
      "Learn what the Word Association Test is, its rules, and how to attempt it effectively in SSB.",
    image: watImage,
    icon: Info,
    href: "/wat/about",
  },
  {
    title: "Sample Test",
    description:
      "Explore sample WAT words and model responses to understand the test pattern clearly.",
    image: watImage,
    icon: BookOpen,
    href: "/wat/sample",
  },
  {
    title: "Practice Test & AI Analysis",
    description:
      "Attempt the WAT test in real-time and get AI-based analysis of your responses.",
    image: watImage,
    icon: Brain,
    href: "/wat/practice",
  },
];

const WatPage = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Word Association Test (WAT)"
          subtitle="Understand the test, explore samples, and practice with AI analysis."
          centered
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {watCards.map((card) => (
            <TestCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WatPage;
