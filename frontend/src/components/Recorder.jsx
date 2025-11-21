import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, RotateCcw, Upload } from 'lucide-react';

const Recorder = ({ onRecordingComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);

    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    const chunksRef = useRef([]);

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

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100 w-full max-w-md mx-auto">
            <div className="mb-8 relative">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-red-50 ring-4 ring-red-100' : 'bg-indigo-50'}`}>
                    {isRecording ? (
                        <div className="animate-pulse w-full h-full rounded-full bg-red-100 absolute opacity-50"></div>
                    ) : null}
                    <Mic size={48} className={`z-10 ${isRecording ? 'text-red-500' : 'text-indigo-500'}`} />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-mono">
                    {formatTime(recordingTime)}
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
