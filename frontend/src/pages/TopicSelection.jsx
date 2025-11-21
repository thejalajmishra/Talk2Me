import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Mic, BookOpen, Sparkles } from 'lucide-react';

const TopicSelection = () => {
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // In a real app, fetch from API. For now, we can hardcode or fetch if backend is running.
        // We'll try to fetch, fallback to hardcoded if fails (for dev speed without running backend yet)
        const fetchTopics = async () => {
            try {
                const response = await axios.get('http://localhost:8000/topics');
                setTopics(response.data);
            } catch (error) {
                console.error("Failed to fetch topics, using fallback", error);
                // Fallback data for UI development
                setTopics([
                    { id: 1, title: "The Future of AI", category: "Tech", difficulty: "Medium", description: "Discuss how AI will shape the workforce in 2030." },
                    { id: 2, title: "My Most Embarrassing Moment", category: "Fun", difficulty: "Easy", description: "Share a funny story from your past." },
                    { id: 3, title: "Climate Change Solutions", category: "General Knowledge", difficulty: "Hard", description: "What are the most effective ways to combat climate change?" },
                ]);
            }
        };
        fetchTopics();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Choose Your <span className="text-indigo-600">Topic</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Select a topic to practice your public speaking skills. We'll analyze your pace, tone, and clarity.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {topics.map((topic) => (
                        <div
                            key={topic.id}
                            onClick={() => navigate(`/record/${topic.id}`)}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden group"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase
                    ${topic.category?.name === 'Tech' || topic.category === 'Tech' ? 'bg-blue-100 text-blue-700' :
                                            topic.category?.name === 'Fun' || topic.category === 'Fun' ? 'bg-pink-100 text-pink-700' :
                                                'bg-green-100 text-green-700'}`}>
                                        {topic.category?.name || topic.category || 'General'}
                                    </span>
                                    <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                                        <Sparkles size={12} />
                                        {topic.difficulty}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {topic.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                    {topic.description}
                                </p>
                                <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                    Start Speaking <Mic size={16} className="ml-2" />
                                </div>
                            </div>
                            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopicSelection;
