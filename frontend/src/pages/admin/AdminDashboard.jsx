import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { LayoutGrid, TrendingUp, Users, Mic, FolderOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = ({ user }) => {
    const [stats, setStats] = useState({
        totalTopics: 0,
        totalCategories: 0,
        totalUsers: 0,
        totalAttempts: 0,
        avgScore: 'N/A'
    });
    const [recentAttempts, setRecentAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch all data in parallel
            const [topicsRes, categoriesRes, usersRes, attemptsRes] = await Promise.all([
                axios.get(`${API_URL}/topics`),
                axios.get(`${API_URL}/categories`),
                axios.get(`${API_URL}/admin/users`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                }),
                axios.get(`${API_URL}/admin/attempts`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                })
            ]);

            const topics = topicsRes.data;
            const categories = categoriesRes.data;
            const users = usersRes.data;
            const attempts = attemptsRes.data;

            // Calculate average score
            const validScores = attempts.filter(a => a.score !== null && a.score !== undefined);
            const avgScore = validScores.length > 0
                ? (validScores.reduce((sum, a) => sum + a.score, 0) / validScores.length).toFixed(1)
                : 'N/A';

            setStats({
                totalTopics: topics.length,
                totalCategories: categories.length,
                totalUsers: users.length,
                totalAttempts: attempts.length,
                avgScore
            });

            // Get recent attempts (last 5)
            setRecentAttempts(attempts.slice(0, 5));

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            label: 'Total Topics',
            value: stats.totalTopics,
            icon: LayoutGrid,
            color: 'bg-blue-500',
            link: '/admin/topics'
        },
        {
            label: 'Categories',
            value: stats.totalCategories,
            icon: FolderOpen,
            color: 'bg-indigo-500',
            link: '/admin/categories'
        },
        {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-green-500',
            link: '/admin/users'
        },
        {
            label: 'Voice Attempts',
            value: stats.totalAttempts,
            icon: Mic,
            color: 'bg-purple-500',
            link: '/admin/attempts'
        },
        {
            label: 'Avg Score',
            value: stats.avgScore,
            icon: TrendingUp,
            color: 'bg-orange-500',
            link: '/admin/attempts'
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome to the Talk2Me admin panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={index}
                            to={stat.link}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Attempts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Recent Attempts</h2>
                        <Link to="/admin/attempts" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                            View All <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentAttempts.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No attempts yet</p>
                        ) : (
                            recentAttempts.map((attempt) => (
                                <div key={attempt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm">{attempt.user?.username || 'Unknown'}</p>
                                        <p className="text-xs text-gray-600">{attempt.topic?.title || 'Unknown Topic'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-semibold ${attempt.score >= 80 ? 'text-green-600' :
                                            attempt.score >= 60 ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                            {attempt.score || 'N/A'}
                                        </p>
                                        <p className="text-xs text-gray-500">{attempt.wpm?.toFixed(0) || 'N/A'} WPM</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            to="/admin/topics"
                            className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">Add Topic</h3>
                                <p className="text-sm text-gray-600">Create a new speaking topic</p>
                            </div>
                            <ArrowRight className="text-gray-400 group-hover:text-indigo-600" size={20} />
                        </Link>
                        <Link
                            to="/admin/categories"
                            className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">Add Category</h3>
                                <p className="text-sm text-gray-600">Create a new category</p>
                            </div>
                            <ArrowRight className="text-gray-400 group-hover:text-indigo-600" size={20} />
                        </Link>
                        <Link
                            to="/admin/users"
                            className="flex items-center justify-between p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">Manage Users</h3>
                                <p className="text-sm text-gray-600">View and manage user accounts</p>
                            </div>
                            <ArrowRight className="text-gray-400 group-hover:text-indigo-600" size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
