import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook for text-to-speech narration with a deep male voice.
 * Uses the browser's built-in SpeechSynthesis API.
 */
const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [progress, setProgress] = useState(0); // 0-100 percentage
    const utteranceRef = useRef(null);
    const totalCharsRef = useRef(0);

    useEffect(() => {
        if (!("speechSynthesis" in window)) {
            setIsSupported(false);
        }

        return () => {
            window.speechSynthesis?.cancel();
        };
    }, []);

    /**
     * Pick the best deep male voice available.
     * Priority: Microsoft David (Windows), Google UK English Male, any male voice, fallback.
     */
    const pickMaleVoice = useCallback(() => {
        const voices = window.speechSynthesis.getVoices();

        // Priority list of deep male voices
        const preferred = [
            "Microsoft David",       // Windows — deep US English male
            "Microsoft Mark",        // Windows — another male
            "Google UK English Male", // Chrome — deep and authoritative
            "Google US English",     // Chrome fallback
            "Alex",                  // macOS
            "Daniel",                // macOS / iOS UK English
        ];

        for (const name of preferred) {
            const match = voices.find((v) => v.name.includes(name));
            if (match) return match;
        }

        // Fallback: find any English male voice
        const englishMale = voices.find(
            (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("male")
        );
        if (englishMale) return englishMale;

        // Last resort: any English voice
        const anyEnglish = voices.find((v) => v.lang.startsWith("en"));
        return anyEnglish || voices[0] || null;
    }, []);

    const speak = useCallback(
        (text) => {
            if (!text || !isSupported) return;

            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            totalCharsRef.current = text.length;

            // Wait for voices to be loaded (some browsers load asynchronously)
            const setVoiceAndSpeak = () => {
                const voice = pickMaleVoice();
                if (voice) utterance.voice = voice;

                // Deep male settings
                utterance.rate = 0.92;   // Slightly slower — authoritative pacing
                utterance.pitch = 0.85;  // Lower pitch — deep voice
                utterance.volume = 1;

                utterance.onstart = () => {
                    setIsSpeaking(true);
                    setIsPaused(false);
                    setProgress(0);
                };

                utterance.onend = () => {
                    setIsSpeaking(false);
                    setIsPaused(false);
                    setProgress(100);
                };

                utterance.onerror = (event) => {
                    if (event.error !== "canceled") {
                        console.error("Speech synthesis error:", event.error);
                    }
                    setIsSpeaking(false);
                    setIsPaused(false);
                };

                utterance.onboundary = (event) => {
                    if (totalCharsRef.current > 0) {
                        const pct = Math.round(
                            (event.charIndex / totalCharsRef.current) * 100
                        );
                        setProgress(pct);
                    }
                };

                utteranceRef.current = utterance;
                window.speechSynthesis.speak(utterance);
            };

            // Voices may not be loaded yet
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                setVoiceAndSpeak();
            } else {
                window.speechSynthesis.onvoiceschanged = () => {
                    setVoiceAndSpeak();
                };
            }
        },
        [isSupported, pickMaleVoice]
    );

    const pause = useCallback(() => {
        if (window.speechSynthesis?.speaking) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    }, []);

    const resume = useCallback(() => {
        if (window.speechSynthesis?.paused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    }, []);

    const stop = useCallback(() => {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        setProgress(0);
    }, []);

    return {
        speak,
        pause,
        resume,
        stop,
        isSpeaking,
        isPaused,
        isSupported,
        progress,
    };
};

export default useTextToSpeech;
