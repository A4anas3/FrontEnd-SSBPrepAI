import { useState, useRef, useCallback } from "react";
import { getDeepgramToken } from "@/services/deepgramService";

const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [error, setError] = useState(null);

    const socketRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const intentionalCloseRef = useRef(false);

    const connectDeepgram = useCallback(async () => {
        try {
            setError(null);

            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                try { mediaRecorderRef.current.stop(); } catch (e) { }
            }
            if (socketRef.current) {
                const oldWs = socketRef.current;
                if (oldWs.readyState === 1) oldWs.send(JSON.stringify({ type: "CloseStream" }));
                setTimeout(() => {
                    if (oldWs.readyState === 1 || oldWs.readyState === 0) oldWs.close();
                }, 500);
            }
            mediaRecorderRef.current = null;
            socketRef.current = null;

            // 1. Get Token
            const token = await getDeepgramToken();
            if (!token) {
                setError("Could not retrieve speech recognition token.");
                setIsListening(false);
                return;
            }

            // 2. Get Microphone Stream
            if (!streamRef.current) {
                streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            }

            // Use MediaRecorder (supported by Deepgram)
            let mimeType = 'audio/webm';
            if (typeof MediaRecorder.isTypeSupported === 'function' && !MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'audio/mp4';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = '';
                }
            }

            const mediaRecorder = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : undefined);
            mediaRecorderRef.current = mediaRecorder;

            // 3. Connect to Deepgram WebSocket
            const ws = new WebSocket(
                'wss://api.deepgram.com/v1/listen?model=nova-2&language=en&smart_format=true&interim_results=true',
                ['token', token]
            );

            ws.onopen = () => {
                setIsListening(true);

                mediaRecorder.addEventListener('dataavailable', event => {
                    if (event.data.size > 0 && ws.readyState === 1) {
                        ws.send(event.data);
                    }
                });

                // Send audio chunks every 250ms for low latency
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
                        setTranscript(prev => (prev + " " + transcriptText).trim());
                        setInterimTranscript("");
                    } else {
                        setInterimTranscript(transcriptText);
                    }
                }
            };

            ws.onclose = () => {
                if (socketRef.current !== ws) return; // ignore old sockets

                if (!intentionalCloseRef.current) {
                    console.log("Deepgram WS closed unexpectedly. Reconnecting...");
                    setTimeout(() => {
                        if (socketRef.current === ws && !intentionalCloseRef.current) {
                            connectDeepgram();
                        }
                    }, 500);
                } else {
                    setIsListening(false);
                }
            };

            ws.onerror = (e) => {
                console.error("Deepgram WS Error:", e);
                setError("Connection error with transcription service.");
                // onclose logic will handle reconnection automatically
            };

            socketRef.current = ws;

        } catch (err) {
            console.error(err);
            if (err.name === 'NotAllowedError') {
                setError("Microphone permission denied.");
            } else {
                setError("Failed to start speech recognition.");
            }
            setIsListening(false);
        }
    }, []);

    const startRecording = useCallback(() => {
        intentionalCloseRef.current = false;
        connectDeepgram();
    }, [connectDeepgram]);

    const stopRecording = useCallback(() => {
        intentionalCloseRef.current = true;
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            try {
                mediaRecorderRef.current.stop();
            } catch (e) {
                console.warn("Error stopping media recorder", e);
            }
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }

        const oldWs = socketRef.current;
        if (oldWs) {
            // Signal Deepgram that the stream is closing to get the final transcript
            if (oldWs.readyState === 1) {
                oldWs.send(JSON.stringify({ type: "CloseStream" }));
            }

            // Give it a brief moment to process the final message before closing
            setTimeout(() => {
                if (oldWs.readyState === 1 || oldWs.readyState === 0) {
                    oldWs.close();
                }
            }, 500);
        }
        mediaRecorderRef.current = null;
        socketRef.current = null;
        setIsListening(false);
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript("");
        setInterimTranscript("");
        setError(null);
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