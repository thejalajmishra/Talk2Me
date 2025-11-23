import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Mic, Star, Calendar, Edit2, Save, X, TrendingUp, Activity, Clock } from 'lucide-react';
import { showAlert } from '../utils/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const ProfilePage = ({ user, onUpdate }) => {
    const navigate = useNavigate();
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.token) {
            fetchAttempts();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchAttempts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users/me/attempts', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setAttempts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch attempts", error);
            setLoading(false);
        }
    };

    // Calculate Stats
    const totalAttempts = attempts.length;
    const avgScore = totalAttempts > 0 ? (attempts.reduce((acc, curr) => acc + curr.overall_score, 0) / totalAttempts).toFixed(1) : 0;
    const bestScore = totalAttempts > 0 ? Math.max(...attempts.map(a => a.overall_score)).toFixed(1) : 0;

    // Prepare Chart Data (sort by date)
    const chartData = [...attempts].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((a, index) => ({
        name: `Attempt ${index + 1}`,
        score: a.overall_score,
        wpm: a.wpm,
        date: new Date(a.created_at).toLocaleDateString()
    }));

    // Recent Activity (reverse chronological)
    const recentActivity = [...attempts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Home
                </button>

                {/* Profile Header */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="flex items-end">
                                <div className="h-24 w-24 bg-white rounded-full p-1 shadow-lg">
                                    <div className="h-full w-full bg-indigo-50 rounded-full flex items-center justify-center text-4xl border-2 border-indigo-100">
                                        {user.profile_picture || <User size={40} className="text-indigo-300" />}
                                    </div>
                                </div>
                                <div className="ml-4 mb-1 flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                                    <p className="text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="mb-1 flex flex-col items-end space-y-2">
                                <div className="text-sm text-gray-500 flex items-center">
                                    <Calendar size={16} className="mr-1" /> Joined {new Date(user.created_at).toLocaleDateString()}
                                </div>
                                <div>
                                    <button
                                        onClick={() => navigate('/profile/edit')}
                                        className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                    >
                                        <Edit2 size={16} className="mr-1" /> Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-2 text-gray-500">
                                    <Mic size={20} />
                                    <span className="font-medium">Total Speeches</span>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{totalAttempts}</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-2 text-gray-500">
                                    <Star size={20} />
                                    <span className="font-medium">Avg. Score</span>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{avgScore}</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-2 text-gray-500">
                                    <TrendingUp size={20} />
                                    <span className="font-medium">Best Score</span>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{bestScore}</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-2 text-gray-500">
                                    <Activity size={20} />
                                    <span className="font-medium">Recent Activity</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {recentActivity.length > 0 ? `Last: ${new Date(recentActivity[0].created_at).toLocaleDateString()}` : 'No activity'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                {attempts.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Score History Chart */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Score Improvement</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="name" hide />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Overall Score" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* WPM History Chart */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Speaking Pace (WPM)</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="name" hide />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        />
                                        <Legend />
                                        <Bar dataKey="wpm" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Words Per Minute" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Attempts List */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Analysis History</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WPM</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tone</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentActivity.map((attempt) => (
                                            <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(attempt.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {attempt.topic?.title || 'Custom Topic'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${attempt.overall_score >= 80 ? 'bg-green-100 text-green-800' :
                                                        attempt.overall_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {attempt.overall_score}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {attempt.wpm}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {attempt.tone_analysis ? JSON.parse(attempt.tone_analysis).primary_tone : 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 border-dashed">
                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                            <Mic size={48} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No speeches recorded yet</h3>
                        <p className="mt-2 text-gray-500">Start practicing to see your analytics and improvement!</p>
                        <button
                            onClick={() => navigate('/topics')}
                            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Start Practice
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
