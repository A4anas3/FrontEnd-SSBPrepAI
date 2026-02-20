import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, VideoOff, Timer } from "lucide-react";

/* ============================================================
   WHY continuous = false?

   Android Chrome does NOT reliably support continuous = true.
   Internally it stops & restarts recognition on its own, and on
   each restart it REPLAYS the full transcript from the beginning
   as new onresult events. No dedup logic can fully catch this
   because the replayed text can differ in punctuation, casing,
   or word order from what you stored.

   Solution: continuous = false
   - Each utterance is one clean, isolated session
   - Android stops naturally at a pause and fires onend
   - We immediately start a fresh session → no replay, ever
   - Interim results are scoped to the current utterance only
   ============================================================ */

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
    const streamRef = useRef(null);
    const timerRef = useRef(null);
    const recognitionRef = useRef(null);

    // All confirmed text accumulated across utterances
    const confirmedRef = useRef("");
    // The interim text for the CURRENT utterance only
    const interimRef = useRef("");
    // Whether we should keep restarting
    const listeningRef = useRef(false);
    const startTimeRef = useRef(null);

    useEffect(() => {
        listeningRef.current = listening;
    }, [listening]);

    /* ── Media init ── */
    useEffect(() => {
        initMedia();
        return () => {
            stopStream();
            killRecognition();
        };
    }, [mode]);

    const initMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: mode === "video",
            });

            // Release audio tracks — SpeechRecognition manages mic itself.
            // Holding them open causes Android to deny mic to recognition.
            stream.getAudioTracks().forEach((t) => {
                t.stop();
                stream.removeTrack(t);
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
        streamRef.current?.getTracks().forEach((t) => t.stop());
    };

    /* ============================================================
       RECOGNITION
       ============================================================ */

    const killRecognition = () => {
        if (!recognitionRef.current) return;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        try { recognitionRef.current.abort(); } catch (_) { }
        recognitionRef.current = null;
    };

    const startUtterance = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition not supported. Use Chrome.");
            return;
        }

        killRecognition();

        const rec = new SpeechRecognition();

        // ✅ KEY: false = one utterance per session, then stops cleanly.
        //    No continuous replay bug, no expanding interim bleed-over.
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = "en-IN";
        rec.maxAlternatives = 1;

        /* ── onresult ──────────────────────────────────────────────────
         * With continuous=false, event.results only contains results
         * for THIS utterance — no history replay from Android.
         *
         * Interim: always overwrite, never append.
         *   Android sends expanding partials per utterance:
         *   "hello" → "hello my" → "hello my name"
         *   Taking only the LAST one gives the best guess.
         * ────────────────────────────────────────────────────────────── */
        rec.onresult = (event) => {
            let utteranceFinal = "";
            let utteranceInterim = "";

            for (let i = 0; i < event.results.length; i++) {
                const t = event.results[i][0].transcript.trim();
                if (event.results[i].isFinal) {
                    utteranceFinal += (utteranceFinal ? " " : "") + t;
                } else {
                    utteranceInterim = t; // overwrite — last interim is most complete
                }
            }

            if (utteranceFinal) {
                // Commit this utterance to confirmed text
                confirmedRef.current +=
                    (confirmedRef.current ? " " : "") + utteranceFinal;
                interimRef.current = "";
            } else {
                interimRef.current = utteranceInterim;
            }

            const display =
                confirmedRef.current +
                (interimRef.current ? " " + interimRef.current : "");
            setLiveText(display.trim());
        };

        /* ── onerror ── */
        rec.onerror = (event) => {
            // no-speech = user paused too long → onend fires → we restart. Fine.
            if (event.error === "no-speech") return;
            // aborted = we called abort() intentionally → ignore
            if (event.error === "aborted") return;

            console.error("Recognition error:", event.error);

            if (event.error === "not-allowed") {
                alert("Microphone permission denied.");
                stopEverything();
                return;
            }

            // For network errors etc, attempt a restart after brief delay
            if (listeningRef.current) {
                setTimeout(() => {
                    if (listeningRef.current) startUtterance();
                }, 500);
            }
        };

        /* ── onend ─────────────────────────────────────────────────────
         * Fired when the utterance naturally ends (silence detected),
         * or after no-speech timeout, or after we call abort().
         *
         * If user is still recording → start a fresh utterance.
         * Clean slate: no history, no replay.
         * ────────────────────────────────────────────────────────────── */
        rec.onend = () => {
            // Clear any dangling interim for the finished utterance
            interimRef.current = "";

            if (!listeningRef.current) return;

            setTimeout(() => {
                if (listeningRef.current) startUtterance();
            }, 100);
        };

        try {
            rec.start();
            recognitionRef.current = rec;
        } catch (err) {
            console.error("Failed to start recognition:", err);
        }
    };

    /* ============================================================
       START SESSION (user presses button)
       ============================================================ */

    const startRecording = () => {
        // Full reset
        confirmedRef.current = "";
        interimRef.current = "";
        setLiveText("");
        setTimeLeft(maxDuration);
        startTimeRef.current = Date.now();
        setListening(true);         // sets listeningRef via useEffect

        // useEffect hasn't run yet so manually sync ref
        listeningRef.current = true;

        startUtterance();

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
        listeningRef.current = false; // stop before kill so onend doesn't restart
        killRecognition();
        clearInterval(timerRef.current);
        timerRef.current = null;
        setListening(false);
    };

    const finishSession = () => {
        stopEverything();
        if (onRecordComplete) {
            const duration = startTimeRef.current
                ? (Date.now() - startTimeRef.current) / 1000
                : 0;
            onRecordComplete(confirmedRef.current.trim(), duration);
        }
    };

    /* ============================================================
       UI
       ============================================================ */

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

                {listening && (
                    <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                        <Timer size={16} />
                        <span className="font-mono font-bold">{timeLeft}s</span>
                    </div>
                )}
            </div>

            {/* ── Transcript Panel ── */}
            <div className="flex md:w-1/3 bg-gray-900 p-6 flex-col border-l border-gray-800">
                <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                    Live Transcript
                </h3>
                <div className="flex-1 overflow-y-auto font-mono text-gray-300 text-sm leading-relaxed">
                    {liveText ? (
                        <p>{liveText}</p>
                    ) : (
                        <p className="text-gray-600 italic">
                            {listening
                                ? "Listening…"
                                : 'Press "Start Recording" and speak clearly.'}
                        </p>
                    )}
                </div>
            </div>

            {/* ── Controls ── */}
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