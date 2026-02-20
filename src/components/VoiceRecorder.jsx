import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, VideoOff, Timer } from "lucide-react";
import { getDeepgramToken } from "@/services/deepgramService";

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
    const socketRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    // Flag to track whether the websocket was closed intentionally or if it expired
    const intentionalCloseRef = useRef(false);

    // All confirmed text accumulated across utterances
    const confirmedRef = useRef("");
    // The interim text for the CURRENT utterance only
    const interimRef = useRef("");
    const startTimeRef = useRef(null);

    /* ── Media init ── */
    useEffect(() => {
        initMedia();
        return () => {
            stopEverything();
        };
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
       DEEPGRAM RECOGNITION
       ============================================================ */

    const killRecognition = () => {
        intentionalCloseRef.current = true;
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            try {
                mediaRecorderRef.current.stop();
            } catch (e) {
                console.warn("Error stopping media recorder", e);
            }
        }

        const oldWs = socketRef.current;
        if (oldWs) {
            if (oldWs.readyState === 1) {
                oldWs.send(JSON.stringify({ type: "CloseStream" }));
            }
            setTimeout(() => {
                if (oldWs.readyState === 1 || oldWs.readyState === 0) {
                    oldWs.close();
                }
            }, 500);
        }
        mediaRecorderRef.current = null;
        socketRef.current = null;
    };

    const startDeepgram = async () => {
        killRecognition();
        intentionalCloseRef.current = false;

        try {
            const token = await getDeepgramToken();
            if (!token) throw new Error("No Deepgram token available");

            if (!streamRef.current) {
                await initMedia();
            }

            let mimeType = 'audio/webm';
            if (typeof MediaRecorder.isTypeSupported === 'function' && !MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'audio/mp4';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = '';
                }
            }

            const mediaRecorder = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : undefined);
            mediaRecorderRef.current = mediaRecorder;

            const ws = new WebSocket(
                'wss://api.deepgram.com/v1/listen?model=nova-2&language=en&smart_format=true&interim_results=true',
                ['token', token]
            );

            ws.onopen = () => {
                mediaRecorder.addEventListener('dataavailable', event => {
                    if (event.data.size > 0 && ws.readyState === 1) {
                        ws.send(event.data);
                    }
                });

                // Low latency chunks
                try {
                    mediaRecorder.start(250);
                } catch (e) {
                    console.warn("Failed to start MediaRecorder with timeslice, trying without:", e);
                    try {
                        mediaRecorder.start();
                        // Polyfill timeslice by manually requesting data
                        const requestInterval = setInterval(() => {
                            if (mediaRecorder.state === 'recording') {
                                try {
                                    mediaRecorder.requestData();
                                } catch (err) {
                                    console.warn("requestData not supported, clearing interval:", err);
                                    clearInterval(requestInterval);
                                }
                            } else {
                                clearInterval(requestInterval);
                            }
                        }, 250);

                        // Ensure interval is cleared when recorder stops
                        mediaRecorder.addEventListener('stop', () => {
                            if (requestInterval) clearInterval(requestInterval);
                        });
                    } catch (e2) {
                        console.error("Failed to start MediaRecorder fallback:", e2);
                    }
                }
            };

            ws.onmessage = (message) => {
                const received = JSON.parse(message.data);
                const isFinal = received.is_final;
                const transcriptText = received.channel?.alternatives?.[0]?.transcript;

                if (transcriptText) {
                    if (isFinal) {
                        confirmedRef.current += (confirmedRef.current ? " " : "") + transcriptText;
                        interimRef.current = "";
                    } else {
                        interimRef.current = transcriptText;
                    }
                }

                const display = (confirmedRef.current + (interimRef.current ? " " + interimRef.current : "")).trim();
                setLiveText(display);
            };

            ws.onclose = () => {
                if (socketRef.current !== ws) return; // ignore old sockets closing

                if (!intentionalCloseRef.current) {
                    console.log("Deepgram WS expired/closed naturally. Reconnecting...");
                    setTimeout(() => {
                        // Double check we haven't been stopped in the meantime
                        if (socketRef.current === ws && !intentionalCloseRef.current) {
                            startDeepgram();
                        }
                    }, 500);
                }
            };

            ws.onerror = (e) => {
                console.error("Deepgram WS Error:", e);
                // We don't reconnect here directly because onclose will fire immediately after onerror and handle the reconnect
            };

            socketRef.current = ws;

        } catch (err) {
            console.error("Failed to start Deepgram recognition:", err);
            alert("Voice recognition failed to start. Ensure the backend is configured securely.");
            stopEverything();
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
        setListening(true);

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
            // Provide the finalized text
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