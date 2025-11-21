import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mic, Star, Calendar } from 'lucide-react';

const ProfilePage = ({ user }) => {
    const navigate = useNavigate();

    // Fallback if user is null (shouldn't happen if protected, but good for safety)
    const displayUser = user || {
        username: "Guest User",
        email: "guest@example.com",
        joinedDate: "2023-11-21",
        totalSpeeches: 0,
        averageScore: "N/A",
        recentActivity: []
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Home
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="flex items-end">
                                <div className="h-24 w-24 bg-white rounded-full p-1 shadow-lg">
                                    <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                        <User size={40} />
                                    </div>
                                </div>
                                <div className="ml-4 mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{displayUser.username}</h1>
                                    <p className="text-gray-500">{displayUser.email}</p>
                                </div>
                            </div>
                            <div className="mb-1 text-sm text-gray-500 flex items-center">
                                <Calendar size={16} className="mr-1" /> Joined {displayUser.joinedDate}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-2 text-gray-500">
                                    <Mic size={20} />
                                    <span className="font-medium">Total Speeches</span>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{displayUser.totalSpeeches}</p>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-3 mb-2 text-gray-500">
                                    <Star size={20} />
                                    <span className="font-medium">Avg. Score</span>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{displayUser.averageScore}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                            {displayUser.recentActivity.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Activity items would go here */}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                                    <p className="text-gray-500">No recent activity to show.</p>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
                                    >
                                        Start your first speech
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
