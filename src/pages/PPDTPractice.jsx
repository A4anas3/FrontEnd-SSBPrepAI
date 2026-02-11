import SectionTitle from "@/components/SectionTitle";
import Header from "@/components/Header";
import TestCard from "@/components/TestCard";
import {
  Users,
  Image,
  StepForward,
  SwatchBook,
  Plus,
  Images,
} from "lucide-react";
import img1 from "@/assets/card-oir.jpg";
import img2 from "@/assets/card-ppdt.jpg";
import img3 from "@/assets/Sampleppdt.png";
import adminAddImg from "@/assets/Sampleppdt.png";
import adminAllImg from "@/assets/Sampleppdt.png";
import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";

const ppdtPractice = [
  {
    title: "PPDT Test Steps & Guidelines",
    description:
      "Complete step-by-step explanation of PPDT including picture observation, story writing, narration, and group discussion with key do’s and don’ts.",
    image: img2,
    icon: StepForward,
    href: "/practice/ppdt/steps",
  },
  {
    title: "Sample PPDT Story",
    description:
      "Learn how to frame characters and write a clear, structured PPDT story within the 4-minute time limit.",
    image: img3,
    icon: SwatchBook,
    href: "/practice/ppdt/sample",
  },
  {
    title: "PPDT Story Writing Practice (AI Analysis)",
    description:
      "Practice writing positive and logical PPDT stories under time pressure and get AI-based feedback.",
    image: img1,
    icon: Image,
    href: "/practice/ppdt/PPDTImageSelect",
  },
  {
    title: "PPDT Group Discussion",
    description:
      "Learn how to effectively participate in PPDT group discussion, present your story confidently, listen to others, and show OLQs. (Service available soon)",
    image: img3,
    icon: Users,
    href: "/practice/ppdt/gd-soon",
    disabled: true,
  },
];

const adminCards = [
  {
    title: "Add PPDT Image",
    description: "Admin only: add a new PPDT image.",
    image: adminAddImg,
    icon: Plus,
    href: "/admin/ppdt/add-image",
  },
  {
    title: "All PPDT Images",
    description: "Admin only: view all PPDT images.",
    image: adminAllImg,
    icon: Images,
    href: "/admin/ppdt/images",
  },
];

const PPDTPractice = () => {
  const { user } = useAuth();
  const isUserAdmin = isAdmin(user);
  const cards = isUserAdmin ? [...ppdtPractice, ...adminCards] : ppdtPractice;

  return (
    <section className="py-16 lg:py-24 mx-auto bg-background">
      <Header />
      <div className="container mx-auto px-4">
        <SectionTitle
          title="PPDT Practice"
          subtitle="Master picture perception and discussion with focused practice"
          centered
        />

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {cards.map((item) => (
            <TestCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PPDTPractice;
