import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, Upload } from 'lucide-react';

const Recorder = ({ onRecordingComplete, timeLimit, onRealTimeTranscript }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);

    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    const chunksRef = useRef([]);

    // Auto-stop when time limit reached
    useEffect(() => {
        if (isRecording && timeLimit && recordingTime >= timeLimit) {
            stopRecording();
        }
    }, [recordingTime, isRecording, timeLimit]);

    // Real-time Speech Recognition
    useEffect(() => {
        let recognition = null;
        if (isRecording) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    console.log('Speech recognition started');
                };

                recognition.onresult = (event) => {
                    const currentTranscript = Array.from(event.results)
                        .map(result => result[0].transcript)
                        .join(' ');

                    console.log('Speech recognized:', currentTranscript);

                    if (onRealTimeTranscript) {
                        onRealTimeTranscript(currentTranscript);
                    }
                };

                recognition.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                };

                recognition.onend = () => {
                    console.log('Speech recognition ended');
                    // Restart if still recording
                    if (isRecording) {
                        try {
                            recognition.start();
                        } catch (e) {
                            console.error('Failed to restart recognition:', e);
                        }
                    }
                };

                try {
                    recognition.start();
                    console.log('Attempting to start speech recognition...');
                } catch (e) {
                    console.error("Speech recognition start failed", e);
                }
            } else {
                console.warn('Speech Recognition API not supported in this browser');
            }
        }
        return () => {
            if (recognition) {
                try {
                    recognition.stop();
                } catch (e) {
                    // Ignore stop errors
                }
            }
        };
    }, [isRecording, onRealTimeTranscript]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioBlob(blob);
                setAudioUrl(url);
                chunksRef.current = [];
                if (onRecordingComplete) onRecordingComplete(blob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0); // Reset timer on start

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please allow permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);

            // Stop all tracks to release microphone
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        setRecordingTime(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const remainingTime = timeLimit ? Math.max(0, timeLimit - recordingTime) : recordingTime;

    return (
        <div className="relative flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100 w-full max-w-md mx-auto">
            {/* Timer Top-Right */}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-mono font-bold ${timeLimit && remainingTime < 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
                {timeLimit ? `Time Left: ${formatTime(remainingTime)}` : formatTime(recordingTime)}
            </div>

            <div className="mb-8 relative mt-4">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-red-50 ring-4 ring-red-100' : 'bg-indigo-50'}`}>
                    {isRecording ? (
                        <div className="animate-pulse w-full h-full rounded-full bg-red-100 absolute opacity-50"></div>
                    ) : null}
                    <Mic size={48} className={`z-10 ${isRecording ? 'text-red-500' : 'text-indigo-500'}`} />
                </div>
            </div>

            <div className="flex gap-4">
                {!isRecording && !audioUrl && (
                    <button
                        onClick={startRecording}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-indigo-200"
                    >
                        <Mic size={20} /> Start Recording
                    </button>
                )}

                {isRecording && (
                    <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-red-200"
                    >
                        <Square size={20} fill="currentColor" /> Stop
                    </button>
                )}

                {audioUrl && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                const audio = new Audio(audioUrl);
                                audio.play();
                            }}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium transition-all"
                        >
                            <Play size={18} /> Play
                        </button>
                        <button
                            onClick={resetRecording}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium transition-all"
                        >
                            <RotateCcw size={18} /> Retry
                        </button>
                    </div>
                )}
            </div>

            {audioUrl && (
                <div className="mt-6 w-full">
                    <audio src={audioUrl} controls className="w-full hidden" />
                    {/* Hidden audio element if needed, but we use custom Play button */}
                </div>
            )}
        </div>
    );
};

export default Recorder;
