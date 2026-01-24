import SectionTitle from "./SectionTitle.jsx";
import TestCard from "./TestCard.jsx";
import { Eye, PenTool, AlertCircle, Users } from "lucide-react";
import tatImage from "@/assets/card-tat.jpg";
import watImage from "@/assets/card-wat.jpg";
import srtImage from "@/assets/card-srt.jpg";
import sdtImage from "@/assets/card-sdt.jpg";

const psychTests = [
  {
    title: "TAT - Thematic Apperception Test",
    description:
      "Write creative stories based on pictures to reveal your personality traits and thought patterns.",
    image: tatImage,
    icon: Eye,
    href: "#tat",
  },
  {
    title: "WAT - Word Association Test",
    description:
      "Quick responses to stimulus words that reveal your spontaneous thinking and personality.",
    image: watImage,
    icon: PenTool,
    href: "/wat",
  },
  {
    title: "SRT - Situation Reaction Test",
    description:
      "React to everyday situations demonstrating your decision-making and problem-solving abilities.",
    image: srtImage,
    icon: AlertCircle,
    href: "/srt",
  },
  {
    title: "SDT - Self Description Test",
    description:
      "Describe yourself from multiple perspectives - parents, friends, teachers, and your own view.",
    image: sdtImage,
    icon: Users,
    href: "#sdt",
  },
];

const PsychologicalSection = () => {
  return (
    <section id="psychological" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Psychological Tests"
          subtitle="Deep assessment of your personality, character, and officer-like qualities through proven techniques."
          centered
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {psychTests.map((test) => (
            <TestCard key={test.title} {...test} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PsychologicalSection;
