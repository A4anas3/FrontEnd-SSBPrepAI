import SectionTitle from "@/components/SectionTitle.jsx";
import TestCard from "@/components/TestCard.jsx";
import { Target, BookOpen, PlayCircle, PlusCircle } from "lucide-react";
import lecturetteImage from "@/assets/card-lecturette.jpg";
import Header from "../../components/Header";
import { isAdmin } from "@/config/admin";
import { useAuth } from "@/lib/AuthContext";



const LecturettePage = () => {
    const { user } = useAuth();
    const isUserAdmin = isAdmin(user);

    const lecturetteCards = [
        {
            title: "About Lecturette",
            description:
                "Learn what Lecturette is, rules, timing, structure, and how GTO evaluates you.",
            image: lecturetteImage,
            icon: BookOpen,
            href: "/lecturette/about",
        },
        {
            title: "Sample Lecturette",
            description:
                "View sample lecturette topics with model introductions, points, and conclusions.",
            image: lecturetteImage,
            icon: Target,
            href: "/sample",
        },
        {
            title: "Lecturette AI Test",
            description:
                "Attempt live lecturette test. Speak for 2.5 minutes and get instant AI officer feedback.",
            image: lecturetteImage,
            icon: PlayCircle,
            href: "/lecturette/test",
        },
    ];



    return (
        <section className="py-16 pt-24 lg:py-24 bg-background">
            <Header />

            <div className="container mx-auto px-4">
                <SectionTitle
                    title="Lecturette"
                    subtitle="Understand lecturette, view samples, and practice with AI evaluation."
                    centered
                />

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
                    {lecturetteCards.map((card) => (
                        <TestCard key={card.title} {...card} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LecturettePage;