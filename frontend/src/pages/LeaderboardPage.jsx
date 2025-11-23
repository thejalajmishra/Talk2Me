import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';

const LeaderboardPage = () => {
    const [leaders, setLeaders] = useState([]);
    const [activeTab, setActiveTab] = useState('top'); // 'top' or 'average'
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/leaderboard?type=${activeTab}`);
                setLeaders(response.data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
                // Fallback
                setLeaders([
                    { rank: 1, user: "Alice", topic: "Future of AI", score: 98, date: "2023-10-01" },
                    { rank: 2, user: "Bob", topic: "Climate Change", score: 95, date: "2023-10-02" },
                    { rank: 3, user: "Charlie", topic: "Leadership", score: 92, date: "2023-10-03" },
                ]);
            }
        };
        fetchLeaderboard();
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Topics
                </button>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <Trophy className="text-yellow-500" size={40} /> Leaderboard
                    </h1>
                    <p className="text-lg text-gray-600">Top speakers of the week</p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex">
                        <button
                            onClick={() => setActiveTab('top')}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'top'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Top Attempt
                        </button>
                        <button
                            onClick={() => setActiveTab('average')}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'average'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            Average Score
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="p-6">Rank</th>
                                <th className="p-6">User</th>
                                <th className="p-6">Topic</th>
                                {activeTab === 'average' && <th className="p-6 text-center">Attempts</th>}
                                <th className="p-6 text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaders.map((item) => (
                                <tr key={item.rank} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            {item.rank === 1 && <Medal size={20} className="text-yellow-500" />}
                                            {item.rank === 2 && <Medal size={20} className="text-gray-400" />}
                                            {item.rank === 3 && <Medal size={20} className="text-amber-700" />}
                                            <span className={`font-bold ${item.rank <= 3 ? 'text-gray-900' : 'text-gray-500'}`}>#{item.rank}</span>
                                        </div>
                                    </td>
                                    <td className="p-6 font-medium text-gray-900">{item.user}</td>
                                    <td className="p-6 text-gray-600">{item.topic}</td>
                                    {activeTab === 'average' && (
                                        <td className="p-6 text-center text-gray-600">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                                {item.attempts}
                                            </span>
                                        </td>
                                    )}
                                    <td className="p-6 text-right">
                                        <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                                            {item.score}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {leaders.length === 0 && (
                                <tr>
                                    <td colSpan={activeTab === 'average' ? 5 : 4} className="p-10 text-center text-gray-500">
                                        No records yet. Be the first!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
