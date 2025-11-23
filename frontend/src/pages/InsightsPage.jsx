import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ArrowLeft, TrendingUp, Clock, Award, Play, Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InsightsPage = ({ user }) => {
    const navigate = useNavigate();
    const [streak, setStreak] = React.useState(0);

    // Fallback to localStorage if user prop is missing
    const initialUser = user || JSON.parse(localStorage.getItem('talk2me_user'));

    React.useEffect(() => {
        // Initialize from prop/local storage
        if (initialUser?.current_streak) {
            setStreak(initialUser.current_streak);
        }

        // Fetch latest user data to get up-to-date streak
        const fetchUserData = async () => {
            try {
                // Token is stored in the user object as 'token'
                const token = initialUser?.token;

                if (token) {
                    const response = await axios.get('http://localhost:8000/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data && response.data.current_streak !== undefined) {
                        setStreak(response.data.current_streak);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch latest user data", error);
            }
        };

        fetchUserData();
    }, [initialUser]);

    // Mock Data
    const performanceData = [
        { name: 'Mon', score: 65 },
        { name: 'Tue', score: 72 },
        { name: 'Wed', score: 68 },
        { name: 'Thu', score: 85 },
        { name: 'Fri', score: 82 },
        { name: 'Sat', score: 90 },
        { name: 'Sun', score: 88 },
    ];

    const topicData = [
        { name: 'Public Speaking', attempts: 12 },
        { name: 'Interview', attempts: 8 },
        { name: 'Debate', attempts: 5 },
        { name: 'Storytelling', attempts: 10 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/welcome')}
                    className="group flex items-center text-gray-500 hover:text-indigo-600 mb-8 transition-colors font-medium"
                >
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-2 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    Back to Welcome
                </button>

                {/* Header Section */}
                <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden text-white mb-10">
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">Insights</span>
                            </h1>
                            <p className="text-indigo-200 text-lg max-w-xl">
                                Track your progress, analyze your performance, and identify areas for improvement.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                            <div className="text-right">
                                <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Current Streak</p>
                                <p className="text-2xl font-bold">{streak} Days 🔥</p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl"></div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center">
                                +5% <ArrowLeft className="w-3 h-3 ml-1 rotate-90" />
                            </span>
                        </div>
                        <h3 className="text-gray-500 font-medium text-sm">Average Score</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-1">78.5</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">
                                35 Sessions
                            </span>
                        </div>
                        <h3 className="text-gray-500 font-medium text-sm">Total Practice Time</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-1">12h 30m</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                <Award className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">
                                Top 5%
                            </span>
                        </div>
                        <h3 className="text-gray-500 font-medium text-sm">Top Skill</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-1">Storytelling</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Performance Trend */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Performance Trend</h3>
                                <p className="text-sm text-gray-500">Your score over the last 7 days</p>
                            </div>
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-indigo-600" />
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                                        cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#4f46e5"
                                        strokeWidth={4}
                                        dot={{ fill: '#fff', strokeWidth: 3, r: 6, stroke: '#4f46e5' }}
                                        activeDot={{ r: 8, fill: '#4f46e5', stroke: '#fff', strokeWidth: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Topic Distribution */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Practice by Topic</h3>
                                <p className="text-sm text-gray-500">Distribution of your sessions</p>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Award className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topicData} layout="vertical" barSize={24}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }} />
                                    <Tooltip
                                        cursor={{ fill: '#f9fafb' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                                    />
                                    <Bar dataKey="attempts" fill="#8b5cf6" radius={[0, 12, 12, 0]}>
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recommended Learning Section */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
                            <p className="text-gray-500 mt-1">Curated based on your recent performance</p>
                        </div>
                        <button className="text-indigo-600 font-semibold hover:text-indigo-700 flex items-center transition-colors">
                            View All <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Public Speaking Video */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => window.open('https://www.youtube.com/watch?v=i5mYphUoC1I', '_blank')}>
                            <div className="aspect-w-16 aspect-h-9 bg-gray-900 relative overflow-hidden">
                                <img
                                    src="https://img.youtube.com/vi/i5mYphUoC1I/maxresdefault.jpg"
                                    alt="Public Speaking Tips"
                                    className="w-full h-64 object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Play className="w-6 h-6 text-indigo-600 ml-1 fill-indigo-600" />
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                                    <Clock className="w-3 h-3 mr-1" /> 15:00
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-3">
                                    <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">Public Speaking</span>
                                    <div className="flex items-center ml-auto text-yellow-400">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-gray-500 text-sm font-medium ml-1">4.9</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">The Art of Public Speaking</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Learn the essential techniques to captivate your audience and deliver powerful speeches from world-renowned experts.</p>
                                <div className="flex items-center text-indigo-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                    Watch Now <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                                </div>
                            </div>
                        </div>

                        {/* Voice Modulation Video */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={() => window.open('https://www.youtube.com/watch?v=9e6gq74l_1c', '_blank')}>
                            <div className="aspect-w-16 aspect-h-9 bg-gray-900 relative overflow-hidden">
                                <img
                                    src="https://img.youtube.com/vi/9e6gq74l_1c/hqdefault.jpg"
                                    alt="Voice Modulation"
                                    className="w-full h-64 object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                    <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Play className="w-6 h-6 text-purple-600 ml-1 fill-purple-600" />
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                                    <Clock className="w-3 h-3 mr-1" /> 12:30
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center mb-3">
                                    <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">Voice Modulation</span>
                                    <div className="flex items-center ml-auto text-yellow-400">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-gray-500 text-sm font-medium ml-1">4.8</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Mastering Voice Modulation</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Discover how to vary your pitch, pace, and tone to keep your listeners engaged and convey emotion effectively.</p>
                                <div className="flex items-center text-purple-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                                    Watch Now <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsPage;
