import SectionTitle from "./SectionTitle.jsx";
import TestCard from "./TestCard.jsx";
import { Brain, FileText } from "lucide-react";
import oirImage from "../assets/card-oir.jpg";
import ppdtImage from "../assets/card-ppdt.jpg";

const screeningTests = [
  {
    title: "OIR - Officer Intelligence Rating",
    description:
      "Verbal and non-verbal reasoning tests to assess your cognitive abilities and logical thinking capacity.",
    image: oirImage,
    icon: Brain,
    href: "#oir",
  },
  {
    title: "PPDT - Picture Perception",
    description:
      "Analyze ambiguous pictures, write stories, and participate in group discussions to showcase leadership.",
    image: ppdtImage,
    icon: FileText,
    href: "/practice/ppdt",
  },
];

const ScreeningSection = () => {
  return (
    <section id="screening" className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Screening Test"
          subtitle="The first stage to prove your potential - clear OIR and PPDT to advance to the next phases."
          centered
        />

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {screeningTests.map((test) => (
            <TestCard key={test.title} {...test} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScreeningSection;
