import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Video, VideoOff, Timer } from "lucide-react";

/**
 * VoiceRecorder Component
 * Captures audio and video (optional), performs real-time speech-to-text, and handles submission.
 * 
 * @param {Function} onRecordComplete - Callback with the final transcript text.
 * @param {number} maxDuration - Maximum recording duration in seconds.
 * @param {string} mode - "video" (default) or "audio".
 */
const VoiceRecorder = ({ onRecordComplete, maxDuration = 60, mode = "video" }) => {
    const [listening, setListening] = useState(false);
    const [liveText, setLiveText] = useState("");
    const [timeLeft, setTimeLeft] = useState(maxDuration);
    const [hasPermission, setHasPermission] = useState(null);

    const videoRef = useRef(null);
    const recognitionRef = useRef(null);
    const finalTextRef = useRef("");
    const timerRef = useRef(null);
    const streamRef = useRef(null);
    const startTimeRef = useRef(null); // Fix for stale closure

    useEffect(() => {
        // Initialize Media
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
                video: mode === "video"
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            // On Android Chrome (and potentially other browsers), having an active audio track
            // in the MediaStream prevents SpeechRecognition from using the microphone.
            // Since we only need the microphone for SpeechRecognition, we stop the MediaStream's audio track.
            const audioTracks = stream.getAudioTracks();
            audioTracks.forEach(track => {
                track.stop();
                stream.removeTrack(track); // Optional, but keeps the stream clean
            });

            if (mode === "video" && videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
            setHasPermission(true);
        } catch (err) {
            console.error("Error accessing media:", err);
            setHasPermission(false);
        }
    };

    const stopStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const startRecording = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition not supported. Please use Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN"; // Defaulting to user's preference or en-US

        finalTextRef.current = "";
        setLiveText("");
        setTimeLeft(maxDuration);
        setListening(true);
        startTimeRef.current = Date.now(); // Record start time

        recognition.onresult = (event) => {
            let interim = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTextRef.current += transcript + " ";
                } else {
                    interim += transcript;
                }
            }
            setLiveText(finalTextRef.current + interim);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            if (event.error === 'not-allowed') {
                alert("Microphone permission denied.");
                setListening(false);
            }
        };

        recognition.onend = () => {
            if (listening) {
                // Restart if it stops unexpectedly while we think we are listening
            }
        };

        recognition.start();
        recognitionRef.current = recognition;

        // Countdown timer
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

    const stopRecordingProcess = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setListening(false);
    };

    const finishSession = () => {
        stopRecordingProcess();
        // Pass data back to parent
        if (onRecordComplete) {
            const duration = startTimeRef.current ? Math.abs((Date.now() - startTimeRef.current) / 1000) : 0;
            onRecordComplete(finalTextRef.current.trim(), duration);
        }
    };

    return (
        <div className={`w-full flex flex-col md:flex-row gap-4 bg-black text-white rounded-lg overflow-hidden relative border-4 border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.5)] ${mode === 'audio' ? 'h-auto md:h-auto min-h-[300px]' : 'h-[500px] md:h-[600px]'}`}>

            {/* 🎥 Video/Audio Area */}
            <div className={`relative w-full ${mode === 'video' ? 'md:w-2/3' : 'md:w-1/2'} h-full flex flex-col items-center justify-center bg-gray-900 min-h-[300px]`}>
                {hasPermission === null && <p>Requesting Media Access...</p>}
                {hasPermission === false && (
                    <div className="text-center text-red-400">
                        <VideoOff size={48} className="mx-auto mb-2" />
                        <p>{mode === "video" ? "Camera" : "Microphone"} access denied</p>
                    </div>
                )}

                {mode === "video" ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-10">
                        <div className={`p-8 rounded-full ${listening ? 'bg-red-600/20 animate-pulse' : 'bg-gray-800'}`}>
                            <Mic size={64} className={listening ? "text-red-500" : "text-gray-400"} />
                        </div>
                        <p className="mt-4 text-gray-400 text-lg">
                            {listening ? "Recording Audio..." : "Audio Mode Ready"}
                        </p>
                    </div>
                )}

                {/* Mobile Text Overlay (Only visible on small screens when in video mode) */}
                {mode === "video" && (
                    <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent min-h-[30%]">
                        <p className="text-sm text-gray-300 mb-1">Live Transcript:</p>
                        <div className="text-lg font-medium leading-relaxed">
                            {liveText || <span className="text-gray-500 italic">Listening...</span>}
                        </div>
                    </div>
                )}

                {/* Timer Overlay */}
                {listening && (
                    <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse shadow-lg">
                        <Timer size={16} />
                        <span className="font-mono font-bold">{timeLeft}s</span>
                    </div>
                )}
            </div>

            {/* 📝 Transcript Area (Side Panel) */}
            <div className={`flex ${mode === 'video' ? 'md:w-1/3' : 'md:w-1/2'} bg-gray-900 p-6 flex-col border-l border-gray-800 min-h-[300px]`}>
                <h3 className="text-xl font-semibold mb-4 text-gray-200 border-b border-gray-700 pb-2">
                    Live Transcript
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2 font-mono text-gray-300">
                    {liveText ? (
                        <p>{liveText}</p>
                    ) : (
                        <p className="text-gray-600 italic">
                            {listening ? "Listening..." : `Click "Start Recording" and speak clearly. Your speech will appear here...`}
                        </p>
                    )}
                </div>
            </div>

            {/* 🎮 Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20 w-max">
                {!listening ? (
                    <button
                        type="button"
                        onClick={startRecording}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition transform hover:scale-105"
                    >
                        <Mic size={20} /> Start Recording
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={finishSession}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition transform hover:scale-105"
                    >
                        <Square size={20} fill="currentColor" /> Stop
                    </button>
                )}
            </div>
        </div>
    );
};

export default VoiceRecorder;
