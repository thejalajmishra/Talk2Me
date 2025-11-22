import React, { useState, useEffect } from 'react';
import { showAlert } from '../utils/alert';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Recorder from '../components/Recorder';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const RecordPage = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isGuest = searchParams.get('guest') === 'true';

    const [topic, setTopic] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    // Get current user from localStorage for analysis request
    const user = JSON.parse(localStorage.getItem('talk2me_user'));

    useEffect(() => {
        // Redirect if not logged in and not guest
        if (!user && !isGuest) {
            showAlert('warning', 'Please login to practice.', 'Access Denied');
            navigate('/topics');
            return;
        }

        // Fetch topic details
        const fetchTopic = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/topics/${topicId}`);
                setTopic(response.data);
            } catch (error) {
                console.error("Failed to fetch topic", error);
                // Fallback
                setTopic({ id: topicId, title: "Loading Topic...", description: "Please wait." });
            }
        };
        fetchTopic();
    }, [topicId, user, isGuest, navigate]);

    const handleRecordingComplete = async (audioBlob) => {
        setIsAnalyzing(true);

        // Create FormData
        const formData = new FormData();
        formData.append('file', audioBlob, 'speech.webm');
        formData.append('topic_id', topicId);

        // Attach the logged‑in user's ID so the backend can associate the attempt
        if (user && user.id) {
            formData.append('user_id', user.id);
        }

        try {
            const response = await axios.post('http://localhost:8000/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Navigate to results with data
            navigate('/results', { state: { results: response.data, topic, isGuest } });

        } catch (error) {
            console.error("Analysis failed", error);
            showAlert('error', 'Analysis failed. Please try again.');
            setIsAnalyzing(false);
        }
    };

    if (!topic) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/topics')}
                    className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Topics
                </button>

                {isGuest && (
                    <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start">
                        <AlertCircle className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" size={20} />
                        <div>
                            <h4 className="text-blue-800 font-semibold">Guest Mode</h4>
                            <p className="text-blue-600 text-sm mt-1">
                                You are practicing as a guest. Your results will be shown but <strong>not saved</strong> to your history.
                                <button onClick={() => navigate('/signup')} className="underline ml-1 font-medium hover:text-blue-800">Sign up</button> to save progress.
                            </p>
                        </div>
                    </div>
                )}

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{topic.title}</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {topic.description}
                    </p>
                </div>

                {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900">Analyzing your speech...</h3>
                        <p className="text-gray-500 mt-2">Checking pace, clarity, and tone.</p>
                    </div>
                ) : (
                    <Recorder onRecordingComplete={handleRecordingComplete} />
                )}
            </div>
        </div>
    );
};

export default RecordPage;
