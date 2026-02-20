import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, VideoOff, Timer } from "lucide-react";

/**
 * VoiceRecorder Component
 * Stable version with duplicate prevention + Android Chrome fixes
 */
const VoiceRecorder = ({
    onRecordComplete,
    maxDuration = 60,
    mode = "video",
}) => {
    const [listening, setListening] = useState(false);
    const [liveText, setLiveText] = useState("");
    const [timeLeft, setTimeLeft] = useState(maxDuration);
    const [hasPermission, setHasPermission] = useState(null);

    const videoRef = useRef(null);
    const recognitionRef = useRef(null);
    const finalTextRef = useRef("");
    const timerRef = useRef(null);
    const streamRef = useRef(null);
    const startTimeRef = useRef(null);
    const listeningRef = useRef(false);

    /* ============================
       Keep listening ref updated
    ============================ */
    useEffect(() => {
        listeningRef.current = listening;
    }, [listening]);

    /* ============================
       Init Media
    ============================ */
    useEffect(() => {
        startMedia();
        return () => {
            stopStream();
            stopRecordingProcess();
        };
    }, [mode]);

    const startMedia = async () => {
        try {
            const constraints = {
                audio: true,
                video: mode === "video",
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            // Important: stop audio track to avoid Android conflict
            const audioTracks = stream.getAudioTracks();
            audioTracks.forEach((track) => {
                track.stop();
                stream.removeTrack(track);
            });

            if (mode === "video" && videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            streamRef.current = stream;
            setHasPermission(true);
        } catch (err) {
            console.error("Media error:", err);
            setHasPermission(false);
        }
    };

    const stopStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }
    };

    /* ============================
       Start Recording
    ============================ */
    const startRecording = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech Recognition not supported. Use Chrome.");
            return;
        }

        // Stop old instance if exists
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        finalTextRef.current = "";
        setLiveText("");
        setTimeLeft(maxDuration);
        setListening(true);
        startTimeRef.current = Date.now();

        recognition.onresult = (event) => {
            let currentInterim = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                let transcript = event.results[i][0].transcript.trim();

                // Android Chrome duplicate workaround: The engine often repeats confirmed text
                // in the new results. We strip it if the new transcript starts with the confirmed text.
                const finalStr = finalTextRef.current.trim().toLowerCase();
                if (finalStr && transcript.toLowerCase().startsWith(finalStr)) {
                    transcript = transcript.substring(finalStr.length).trim();
                }

                if (event.results[i].isFinal) {
                    const newText = transcript.trim();
                    if (newText) {
                        finalTextRef.current += (finalTextRef.current ? " " : "") + newText;
                    }
                } else {
                    // Critical fix for repetition: If there are multiple interim results, 
                    // DO NOT concatenate them. The last one is the most complete guess.
                    // E.g. ["hello", "hello my"] -> take "hello my"
                    if (transcript.trim()) {
                        currentInterim = transcript.trim();
                    }
                }
            }

            const combined = finalTextRef.current + (currentInterim ? " " + currentInterim : "");
            setLiveText(combined.trim());
        };

        recognition.onerror = (event) => {
            if (event.error !== "no-speech" && event.error !== "aborted") {
                console.error("Speech error:", event.error);
            }
            if (event.error === "not-allowed") {
                alert("Microphone permission denied.");
                stopRecordingProcess();
            }
        };

        // Safe auto restart
        recognition.onend = () => {
            if (listeningRef.current) {
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (err) { }
                }, 200);
            }
        };

        recognition.start();
        recognitionRef.current = recognition;

        // Timer
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    finishSession();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    /* ============================
       Stop Recording
    ============================ */
    const stopRecordingProcess = () => {
        if (recognitionRef.current) {
            recognitionRef.current.onend = null;
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        setListening(false);
    };

    const finishSession = () => {
        stopRecordingProcess();

        if (onRecordComplete) {
            const duration = startTimeRef.current
                ? Math.abs((Date.now() - startTimeRef.current) / 1000)
                : 0;

            onRecordComplete(finalTextRef.current.trim(), duration);
        }
    };

    /* ============================
       UI
    ============================ */
    return (
        <div className="w-full flex flex-col md:flex-row gap-4 bg-black text-white rounded-lg overflow-hidden relative border-4 border-yellow-500 shadow-lg">

            {/* Media Area */}
            <div className="relative w-full md:w-2/3 bg-gray-900 flex items-center justify-center min-h-[300px]">

                {hasPermission === null && <p>Requesting Media Access...</p>}

                {hasPermission === false && (
                    <div className="text-center text-red-400">
                        <VideoOff size={48} className="mx-auto mb-2" />
                        <p>Media access denied</p>
                    </div>
                )}

                {mode === "video" && (
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                )}

                {listening && (
                    <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                        <Timer size={16} />
                        <span className="font-mono font-bold">{timeLeft}s</span>
                    </div>
                )}
            </div>

            {/* Transcript Panel */}
            <div className="flex md:w-1/3 bg-gray-900 p-6 flex-col border-l border-gray-800">
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                    Live Transcript
                </h3>

                <div className="flex-1 overflow-y-auto font-mono text-gray-300">
                    {liveText ? (
                        <p>{liveText}</p>
                    ) : (
                        <p className="text-gray-600 italic">
                            {listening
                                ? "Listening..."
                                : 'Click "Start Recording" and speak clearly.'}
                        </p>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                {!listening ? (
                    <button
                        onClick={startRecording}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-8 py-3 rounded-full font-bold shadow-lg transition"
                    >
                        <Mic size={20} /> Start Recording
                    </button>
                ) : (
                    <button
                        onClick={finishSession}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-bold shadow-lg transition"
                    >
                        <Square size={20} fill="currentColor" /> Stop
                    </button>
                )}
            </div>
        </div>
    );
};

export default VoiceRecorder;