import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Award, TrendingUp, User } from 'lucide-react';
import SEO from '../components/SEO';

const LeaderboardPage = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`${API_URL}/leaderboard`);
                setLeaderboard(response.data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
                // Fallback
                setLeaderboard([
                    { rank: 1, user: "Alice", topic: "Future of AI", score: 98, date: "2023-10-01" },
                    { rank: 2, user: "Bob", topic: "Climate Change", score: 95, date: "2023-10-02" },
                    { rank: 3, user: "Charlie", topic: "Leadership", score: 92, date: "2023-10-03" },
                ]);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Topics
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <Trophy className="text-yellow-500" size={40} /> Leaderboard
                    </h1>
                    <p className="text-lg text-gray-600">Top speakers of the week</p>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="p-6">Rank</th>
                                <th className="p-6">User</th>
                                <th className="p-6">Topic</th>
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
                                    <td className="p-6 text-right">
                                        <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                                            {item.score}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {leaders.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-gray-500">No records yet. Be the first!</td>
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
