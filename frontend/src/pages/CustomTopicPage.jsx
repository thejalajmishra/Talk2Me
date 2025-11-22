import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showAlert } from '../utils/alert';
import { Mic, Square, Send, Sparkles } from 'lucide-react';

const CustomTopicPage = ({ user }) => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [title, setTitle] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            showAlert('warning', 'Please login to create custom topics');
            navigate('/login');
            return;
        }

        fetchCategories();
        setupSpeechRecognition();
    }, [user, navigate]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/categories');
            setCategories(response.data);
            if (response.data.length > 0) {
                setSelectedCategory(response.data[0].id.toString());
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const setupSpeechRecognition = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = 'en-US';

            recognitionInstance.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcriptPiece = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcriptPiece + ' ';
                    } else {
                        interimTranscript += transcriptPiece;
                    }
                }

                setTranscript(prev => prev + finalTranscript);
            };

            recognitionInstance.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };

            setRecognition(recognitionInstance);
        } else {
            showAlert('warning', 'Speech recognition is not supported in your browser');
        }
    };

    const startRecording = async () => {
        if (!title.trim()) {
            showAlert('warning', 'Please enter a topic title first');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = () => {
                setAudioChunks(chunks);
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
            setTranscript('');

            // Start speech recognition
            if (recognition) {
                recognition.start();
            }

            showAlert('success', 'Recording started! Speak your topic content...');
        } catch (error) {
            console.error('Error starting recording:', error);
            showAlert('error', 'Failed to start recording. Please check microphone permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            setIsRecording(false);
        }

        if (recognition) {
            recognition.stop();
        }

        showAlert('info', 'Recording stopped. Review your transcript and submit.');
    };

    const handleSubmit = async () => {
        if (!title.trim()) {
            showAlert('warning', 'Please enter a topic title');
            return;
        }

        if (!transcript.trim()) {
            showAlert('warning', 'Please record some content first');
            return;
        }

        if (!selectedCategory) {
            showAlert('warning', 'Please select a category');
            return;
        }

        setIsSubmitting(true);

        try {
            const token = user.token;
            await axios.post(
                'http://localhost:8000/topics/custom',
                {
                    title: title.trim(),
                    category_id: parseInt(selectedCategory),
                    description: transcript.trim()
                },
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            showAlert('success', 'Custom topic created successfully!');
            navigate('/topics');
        } catch (error) {
            console.error('Failed to create custom topic:', error);
            showAlert('error', 'Failed to create custom topic. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-4">
                        <Sparkles size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Create Custom Topic</h1>
                    <p className="text-xl text-gray-600">
                        Record your own topic and practice speaking on it
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
                    <div className="space-y-6">
                        {/* Title Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Topic Title *
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a title for your topic..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                disabled={isRecording}
                            />
                        </div>

                        {/* Category Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                disabled={isRecording}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Recording Controls */}
                        <div className="flex justify-center space-x-4">
                            {!isRecording ? (
                                <button
                                    onClick={startRecording}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl"
                                >
                                    <Mic size={24} />
                                    <span>Start Recording</span>
                                </button>
                            ) : (
                                <button
                                    onClick={stopRecording}
                                    className="flex items-center space-x-2 bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-all font-medium shadow-lg hover:shadow-xl animate-pulse"
                                >
                                    <Square size={24} />
                                    <span>Stop Recording</span>
                                </button>
                            )}
                        </div>

                        {/* Transcript Display */}
                        {transcript && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Transcript (Auto-generated)
                                </label>
                                <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto border border-gray-200">
                                    <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    This will be saved as the topic description
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        {transcript && !isRecording && (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={20} />
                                <span>{isSubmitting ? 'Creating...' : 'Create Custom Topic'}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                    <h3 className="font-semibold text-indigo-900 mb-2">How it works:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-indigo-800">
                        <li>Enter a title for your custom topic</li>
                        <li>Select a category</li>
                        <li>Click "Start Recording" and speak about your topic</li>
                        <li>Your speech will be automatically transcribed</li>
                        <li>Click "Stop Recording" when done</li>
                        <li>Review the transcript and click "Create Custom Topic"</li>
                        <li>Your custom topic will be saved and visible in the admin panel</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default CustomTopicPage;
