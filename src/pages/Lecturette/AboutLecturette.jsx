import SectionTitle from "@/components/SectionTitle.jsx";
import Header from "@/components/Header.jsx";
import {
    Mic,
    Brain,
    Target,
    Clock,
    AlertTriangle,
    BookOpen,
    Users,
} from "lucide-react";

const AboutLecturette = () => {
    return (
        <section className="py-16 pt-24 lg:py-24 bg-background">
            <Header />

            <div className="container mx-auto px-4 max-w-6xl">
                <SectionTitle
                    title="Lecturette (SSB Interview)"
                    subtitle="Complete guide to lecturette task, evaluation criteria, and preparation strategy."
                    centered
                />

                {/* 🔹 Hero Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 rounded-xl bg-card border border-sky-border shadow-sm">
                        <Mic className="text-primary mb-3" />
                        <h4 className="font-semibold text-lg text-primary mb-2">
                            What is Lecturette?
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            An individual speaking task where you deliver a structured talk on
                            a given topic before the group.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-card border border-sky-border shadow-sm">
                        <Brain className="text-primary mb-3" />
                        <h4 className="font-semibold text-lg text-primary mb-2">
                            What is Tested?
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Confidence, clarity of thought, awareness, communication, and
                            officer-like qualities.
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-card border border-sky-border shadow-sm">
                        <Users className="text-primary mb-3" />
                        <h4 className="font-semibold text-lg text-primary mb-2">
                            Speaking Before Group
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            You speak in front of group members and GTO for about 2–3 minutes.
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Introduction */}
                    <div className="p-6 rounded-xl bg-card border border-sky-border shadow-sm">
                        <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
                            <Mic size={20} /> What is Lecturette in SSB?
                        </h3>

                        <p className="text-muted-foreground">
                            Lecturette is an individual task conducted during the GTO series
                            of the SSB interview. Each candidate picks a card containing four
                            topics ranging from social issues to national and international
                            affairs.
                        </p>

                        <p className="mt-2 text-muted-foreground">
                            You get 3 minutes to prepare and about 2–3 minutes to speak on one
                            topic of your choice. The aim is to check how clearly and
                            confidently you can express your ideas before a group.
                        </p>

                        <p className="mt-2 text-muted-foreground">
                            It is not about using complex English. The focus is on structure,
                            clarity, awareness, and confidence.
                        </p>
                    </div>

                    {/* Structure */}
                    <div className="p-6 rounded-xl bg-card border border-sky-border shadow-sm">
                        <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
                            <Target size={20} /> Structure of Lecturette
                        </h3>

                        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                            <li>Select topic from given card</li>
                            <li>3 minutes preparation time</li>
                            <li>2–3 minutes speaking time</li>
                            <li>Speak standing before the group</li>
                            <li>No interruption during speech</li>
                        </ul>
                    </div>

                    {/* Time */}
                    <div className="p-6 rounded-xl bg-card border border-sky-border shadow-sm">
                        <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
                            <Clock size={20} /> Time Distribution
                        </h3>

                        <div className="grid md:grid-cols-2 gap-2 text-muted-foreground">
                            <p>• Topic selection: few seconds</p>
                            <p>• Preparation time: 3 minutes</p>
                            <p>• Speaking time: 2–3 minutes</p>
                        </div>
                    </div>

                    {/* Evaluation */}
                    <div className="p-6 rounded-xl bg-linear-to-br from-primary/5 to-accent/10 border border-sky-border shadow-sm">
                        <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
                            <Brain size={20} /> What GTO Observes
                        </h3>

                        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                            <li>Clarity of thought</li>
                            <li>Power of expression</li>
                            <li>Confidence</li>
                            <li>Body language</li>
                            <li>General awareness</li>
                            <li>Logical structure</li>
                            <li>Ability to speak under pressure</li>
                        </ul>
                    </div>

                    {/* Topics */}
                    <div className="p-6 rounded-xl bg-card border border-sky-border shadow-sm">
                        <h3 className="text-xl font-semibold text-primary mb-3 flex items-center gap-2">
                            <BookOpen size={20} /> Common Lecturette Topics
                        </h3>

                        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                            <li>Role of youth in nation building</li>
                            <li>Women in armed forces</li>
                            <li>Artificial Intelligence</li>
                            <li>Social media impact</li>
                            <li>India’s defence strength</li>
                            <li>Climate change</li>
                            <li>Cyber security</li>
                            <li>Leadership</li>
                        </ul>
                    </div>

                    {/* Mistakes */}
                    <div className="p-6 rounded-xl bg-card border border-red-300 shadow-sm">
                        <h3 className="text-xl font-semibold text-red-600 mb-3 flex items-center gap-2">
                            <AlertTriangle size={20} /> Common Mistakes
                        </h3>

                        <ul className="list-disc pl-6 text-muted-foreground">
                            <li>Speaking without structure</li>
                            <li>Lack of confidence</li>
                            <li>Poor body language</li>
                            <li>Very short or very long speech</li>
                            <li>No clear conclusion</li>
                        </ul>
                    </div>

                    {/* Tips */}
                    <div className="p-6 rounded-xl bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 shadow-sm">
                        <h3 className="text-xl font-semibold text-green-700 mb-3">
                            Tips to Perform Well
                        </h3>

                        <ul className="list-disc pl-6 text-green-700/80">
                            <li>Follow intro → body → conclusion</li>
                            <li>Use simple and clear language</li>
                            <li>Maintain eye contact</li>
                            <li>Stay calm and confident</li>
                            <li>Practice speaking daily</li>
                        </ul>
                    </div>

                    {/* Conclusion */}
                    <div className="p-6 rounded-xl bg-card border border-sky-border shadow-sm">
                        <h3 className="text-xl font-semibold text-primary mb-3">
                            Conclusion
                        </h3>

                        <p className="text-muted-foreground">
                            Lecturette is a powerful task to demonstrate confidence,
                            awareness, and communication ability. Candidates who speak in a
                            structured, calm, and confident manner leave a strong impression
                            on the GTO.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutLecturette;