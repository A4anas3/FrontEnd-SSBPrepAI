import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRandomLecturette } from "@/hooks/lecturette/useLecturettes";
import { Mic, RefreshCw, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Target, Volume2, Layout, Lightbulb, BookOpen } from "lucide-react";
import VoiceRecorder from "@/components/VoiceRecorder";
import Header from "@/components/Header";
import SectionTitle from "@/components/SectionTitle";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/api"; // Ensure api is imported for analysis call
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";

const LecturetteTest = () => {
    const { toast } = useToast();
    const { refetch, data: lecturette, isFetching, error } = useRandomLecturette();

    // States: 'start' | 'recording' | 'analyzing' | 'result'
    const [step, setStep] = useState('start');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Fetch random topic on mount
    useEffect(() => {
        handleGetNewTopic();
    }, []);

    const handleGetNewTopic = () => {
        setStep('start');
        setAnalysisResult(null);
        refetch();
    };

    const handleStartRecording = () => {
        setStep('recording');
    };

    const handleRecordingComplete = async (text, duration) => {
        setStep('analyzing');
        setIsAnalyzing(true);

        const payload = {
            lecturetteId: lecturette.id,
            userText: text,
            durationSeconds: duration
        };

        try {
            const { data } = await api.post("/gto/lecturette/test/analyse", payload);
            setAnalysisResult(data);
            setStep('result');
        } catch (err) {
            console.error("Analysis failed", err);
            toast({
                title: "Analysis Failed",
                description: "Could not analyze your speech. Please try again.",
                variant: "destructive"
            });
            setStep('start'); // Go back to start on error
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center h-[calc(100vh-100px)]">
                    <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Failed to load topic</h2>
                    <p className="text-muted-foreground mb-6">Could not fetch a random lecturette topic.</p>
                    <Button onClick={handleGetNewTopic}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-background pb-20">
            <Header />
            <div className="container mx-auto px-4 pt-24 max-w-4xl">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-600 mb-3">
                        Lecturette Practice Test
                    </h1>
                    <p className="text-muted-foreground">
                        simulate real SSB environment. Read the topic, prepare, and speak.
                    </p>
                </div>

                {/* Loading State */}
                {isFetching && step === 'start' && (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner />
                    </div>
                )}

                {/* Step 1: Topic Reveal */}
                {!isFetching && step === 'start' && lecturette && (
                    <div className="bg-card border-2 border-primary/20 shadow-xl overflow-hidden rounded-xl">
                        <div className="p-8 md:p-12 text-center space-y-8">

                            <div className="space-y-4">
                                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                    Topic Card
                                </span>
                                <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
                                    {lecturette.title}
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 text-left bg-muted/30 p-6 rounded-xl border border-border">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-primary flex items-center gap-2">
                                        <AlertCircle size={16} /> Preparation
                                    </h4>
                                    <p className="text-sm text-muted-foreground">You have 1 minutes to prepare your thoughts on this topic.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-primary flex items-center gap-2">
                                        <Mic size={16} /> Speaking
                                    </h4>
                                    <p className="text-sm text-muted-foreground">Speak for 2.5 minutes continuously. The AI will analyze your content.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-primary flex items-center gap-2">
                                        <CheckCircle2 size={16} /> Evaluation
                                    </h4>
                                    <p className="text-sm text-muted-foreground">Get instant feedback on your confidence, content, and pacing.</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Button
                                    variant="outline"
                                    onClick={handleGetNewTopic}
                                    className="gap-2 h-12 px-6"
                                >
                                    <RefreshCw size={18} /> Load New Topic
                                </Button>
                                <Button
                                    onClick={handleStartRecording}
                                    className="gap-2 h-12 px-8 text-lg shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Mic size={20} /> Start Speaking
                                </Button>
                            </div>

                        </div>
                    </div>
                )}

                {/* Step 2: Recording */}
                {step === 'recording' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Speaking: {lecturette?.title}</h2>
                            <Button variant="ghost" size="sm" onClick={() => setStep('start')}>Cancel</Button>
                        </div>
                        <VoiceRecorder
                            onRecordComplete={handleRecordingComplete}
                            maxDuration={149} // 3 minutes
                        />
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Camera is on to simulate eye contact. Speak clearly into the microphone.
                        </p>
                    </div>
                )}

                {/* Step 3: Analysis / Loading */}
                {(step === 'analyzing' || (step === 'result' && isAnalyzing)) && (
                    <div className="py-20 text-center space-y-6">
                        <LoadingSpinner size="lg" />
                        <h3 className="text-xl font-medium animate-pulse">Analyzing your speech...</h3>
                        <p className="text-muted-foreground">Checking content relevance, confidence, and timing.</p>
                    </div>
                )}

                {/* Step 4: Result */}
                {step === 'result' && analysisResult && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        <div className={`bg-card border-2 ${analysisResult.valid ? 'border-primary/20' : 'border-destructive/20'} shadow-xl rounded-xl overflow-hidden`}>

                            {/* Result Header */}
                            <div className={`p-6 border-b ${analysisResult.valid ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1">Analysis Result</h2>
                                        <p className="text-muted-foreground text-sm">
                                            Topic: <span className="font-medium text-foreground">{lecturette?.title}</span>
                                        </p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full font-bold text-center ${analysisResult.valid ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {analysisResult.valid ? 'Analysis Complete' : 'Improvement Needed'}
                                    </div>
                                </div>
                            </div>

                            {/* Accordion Sections */}
                            <div className="divide-y divide-border">
                                <ResultAccordion
                                    items={[
                                        {
                                            id: 'overall',
                                            title: 'Overall Feedback',
                                            content: analysisResult.overall || analysisResult.message,
                                            icon: Target,
                                            defaultOpen: true
                                        },
                                        {
                                            id: 'confidence',
                                            title: 'Confidence & Delivery',
                                            content: analysisResult.confidence,
                                            icon: Mic
                                        },
                                        {
                                            id: 'clarity',
                                            title: 'Clarity & Articulation',
                                            content: analysisResult.clarity,
                                            icon: Volume2
                                        },
                                        {
                                            id: 'structure',
                                            title: 'Structure & Flow',
                                            content: analysisResult.structure,
                                            icon: Layout
                                        },
                                        {
                                            id: 'suggestions',
                                            title: 'Key Suggestions',
                                            content: analysisResult.suggestions,
                                            icon: Lightbulb
                                        },
                                        {
                                            id: 'topic_ref',
                                            title: 'Topic Reference',
                                            content: (analysisResult.lecturette || lecturette) ?
                                                `${(analysisResult.lecturette || lecturette).title}\n\n` +
                                                `Introduction:\n${(analysisResult.lecturette || lecturette).introduction}\n\n` +
                                                `${formatSubHeadings((analysisResult.lecturette || lecturette).subHeadings)}\n` +
                                                `Conclusion:\n${(analysisResult.lecturette || lecturette).conclusion}`
                                                : null,
                                            icon: BookOpen,
                                            // Open by default if user asked for "typy open"
                                            defaultOpen: true
                                        }
                                    ].filter(item => item.content)}
                                />
                            </div>

                            {!analysisResult.valid && (
                                <div className="p-6 bg-red-50 dark:bg-red-900/10">
                                    <div className="flex gap-3 text-destructive">
                                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium">
                                            {analysisResult.message || "Please ensure you speak for at least 2 minutes with relevant content."}
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="flex justify-center pt-4">
                            <Button onClick={handleGetNewTopic} size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                                <RefreshCw size={18} /> Try Another Topic
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
};


const ResultAccordion = ({ items }) => {
    const [openItems, setOpenItems] = useState(
        items.filter(i => i.defaultOpen).map(i => i.id)
    );

    const toggleItem = (id) => {
        setOpenItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    if (items.length === 0) return null;

    return (
        <div className="flex flex-col">
            {items.map((item) => {
                const isOpen = openItems.includes(item.id);
                const Icon = item.icon;

                return (
                    <div key={item.id} className="group">
                        <button
                            onClick={() => toggleItem(item.id)}
                            className={`w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-muted/50 ${isOpen ? 'bg-muted/30' : ''}`}
                        >
                            <div className="flex items-center gap-3">
                                {Icon && <Icon className="w-5 h-5 text-primary" />}
                                <span className="font-semibold text-foreground">{item.title}</span>
                            </div>
                            {isOpen ? (
                                <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                        </button>

                        {isOpen && (
                            <div className="p-4 pt-0 pl-12 pr-6 pb-6 text-muted-foreground bg-muted/30 border-b border-border/50 animate-in slide-in-from-top-2 duration-200">
                                <p className="leading-relaxed whitespace-pre-line">
                                    {item.content}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const formatSubHeadings = (subHeadings) => {
    if (!subHeadings || !Array.isArray(subHeadings)) return "";
    return subHeadings.map(sh =>
        `• ${sh.heading}:\n${sh.explanations?.map(exp => `  - ${exp}`).join('\n') || ''}`
    ).join('\n\n');
};

export default LecturetteTest;
