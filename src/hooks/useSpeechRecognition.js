import { useState, useEffect, useRef, useCallback } from "react";

const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [error, setError] = useState(null);

    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setError("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN"; // Default to Indian English

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onend = () => {
            // If we're supposed to be listening, auto-restart (handles no-speech timeout)
            if (recognitionRef.current?._shouldBeListening) {
                try {
                    recognition.start();
                    return;
                } catch (err) {
                    console.warn("Could not auto-restart recognition:", err);
                }
            }
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);

            // no-speech and aborted are transient — let onend handle the restart
            if (event.error === "no-speech" || event.error === "aborted") {
                return;
            }

            // For real errors, stop listening
            recognitionRef.current._shouldBeListening = false;
            setIsListening(false);
            if (event.error === "not-allowed") {
                setError("Microphone permission denied.");
            } else if (event.error === "network") {
                setError(
                    "Speech recognition is not available. Please use Google Chrome for voice features."
                );
            } else {
                setError(event.error);
            }
        };

        recognition.onresult = (event) => {
            let finalTrans = "";
            let interimTrans = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTrans += t + " ";
                } else {
                    interimTrans += t;
                }
            }

            // We only append finalized text to the main transcript state
            // But we expose it so the consumer can decide how to use it
            if (finalTrans) {
                setTranscript((prev) => prev + finalTrans);
            }
            setInterimTranscript(interimTrans);
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startRecording = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current._shouldBeListening = true;
                recognitionRef.current.start();
            } catch (err) {
                console.error("Failed to start recording:", err);
            }
        }
    }, [isListening]);

    const stopRecording = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current._shouldBeListening = false;
            recognitionRef.current.stop();
        }
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript("");
        setInterimTranscript("");
    }, []);

    return {
        isListening,
        transcript,
        interimTranscript,
        startRecording,
        stopRecording,
        resetTranscript,
        error,
    };
};

export default useSpeechRecognition;
