import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, VideoOff, Timer } from "lucide-react";
import useSpeechRecognition from "../hooks/useSpeechRecognition";

const VoiceRecorder = ({
    onRecordComplete,
    maxDuration = 60,
    mode = "video",
}) => {
    const {
        isListening,
        transcript,
        interimTranscript,
        startRecording: startDeepgram,
        stopRecording: stopDeepgram,
        resetTranscript,
        error
    } = useSpeechRecognition();

    const [timeLeft, setTimeLeft] = useState(maxDuration);
    const [hasPermission, setHasPermission] = useState(null);

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    // Keep the current accumulated text in a ref so we can grab the final value reliably on unmount/stop
    const transcriptRef = useRef("");
    useEffect(() => {
        transcriptRef.current = (transcript + (interimTranscript ? " " + interimTranscript : "")).trim();
    }, [transcript, interimTranscript]);

    /* ── Media init ── */
    useEffect(() => {
        initMedia();
        return () => {
            stopEverything();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const initMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: mode === "video",
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

    /* ============================================================
       START SESSION (user presses button)
       ============================================================ */

    const startRecordingSession = () => {
        resetTranscript();
        transcriptRef.current = "";
        setTimeLeft(maxDuration);
        startTimeRef.current = Date.now();

        startDeepgram();

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) { finishSession(); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    /* ============================================================
       STOP
       ============================================================ */

    const stopEverything = () => {
        stopDeepgram();

        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const finishSession = () => {
        stopEverything();
        if (onRecordComplete) {
            const duration = startTimeRef.current
                ? (Date.now() - startTimeRef.current) / 1000
                : 0;
            onRecordComplete(transcriptRef.current, duration);
        }
    };

    /* ============================================================
       UI
       ============================================================ */

    const displayLiveText = (transcript + (interimTranscript ? " " + interimTranscript : "")).trim();

    return (
        <div className="w-full flex flex-col md:flex-row gap-4 bg-black text-white rounded-lg overflow-hidden relative border-4 border-yellow-500 shadow-lg">

            {/* ── Media Area ── */}
            <div className="relative w-full md:w-2/3 bg-gray-900 flex items-center justify-center min-h-[300px]">

                {hasPermission === null && (
                    <p className="text-gray-400">Requesting media access…</p>
                )}

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

                {isListening && (
                    <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                        <Timer size={16} />
                        <span className="font-mono font-bold">{timeLeft}s</span>
                    </div>
                )}

                {error && (
                    <div className="absolute bottom-16 bg-red-800 text-white px-3 py-1 rounded text-sm z-10">
                        {error}
                    </div>
                )}
            </div>

            {/* ── Transcript Panel ── */}
            <div className="flex md:w-1/3 bg-gray-900 p-6 flex-col border-l border-gray-800">
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                    Live Transcript
                </h3>
                <div className="flex-1 overflow-y-auto font-mono text-gray-300 text-sm leading-relaxed">
                    {displayLiveText ? (
                        <p>{displayLiveText}</p>
                    ) : (
                        <p className="text-gray-600 italic">
                            {isListening
                                ? "Listening…"
                                : 'Press "Start Recording" and speak clearly.'}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Controls ── */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                {!isListening ? (
                    <button
                        onClick={startRecordingSession}
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
