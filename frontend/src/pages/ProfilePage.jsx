import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import { ArrowLeft, User, Mic, Star, Calendar, Edit2, Save, X, TrendingUp, Activity, Clock, Eye, Download, FileText } from 'lucide-react';
import { showAlert } from '../utils/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import SEO from '../components/SEO';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ProfilePage = ({ user, onUpdate }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAttempt, setSelectedAttempt] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);

    useEffect(() => {
        if (user?.token) {
            fetchAttempts();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchAttempts = async () => {
        try {
            const response = await axios.get(`${API_URL}/users/me/attempts`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setAttempts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch attempts", error);
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setEditData({
            username: user.username,
            email: user.email,
            password: ''
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({ username: '', email: '', password: '' });
    };

    const handleSave = async () => {
        try {
            const updatePayload = {
                username: editData.username,
                email: editData.email
            };
            if (editData.password) {
                updatePayload.password = editData.password;
            }

            const response = await axios.put(`${API_URL}/users/me`, updatePayload, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            // Update local user state
            const updatedUser = { ...user, ...response.data };
            onUpdate(updatedUser);

            setIsEditing(false);
            showAlert('success', 'Profile updated successfully!', 'Success');
        } catch (error) {
            console.error("Failed to update profile", error);
            showAlert('error', error.response?.data?.detail || 'Failed to update profile', 'Error');
        }
    };

    const handleViewReport = (attempt) => {
        setSelectedAttempt(attempt);
        setShowReportModal(true);
    };

    const handleDownloadPDF = async (attempt) => {
        try {
            // Create a temporary div for the report
            const reportDiv = document.createElement('div');
            reportDiv.style.width = '800px';
            reportDiv.style.padding = '40px';
            reportDiv.style.backgroundColor = 'white';
            reportDiv.style.fontFamily = 'Arial, sans-serif';

            const feedback = attempt.feedback_json || {};
            const date = new Date(attempt.created_at).toLocaleDateString();

            reportDiv.innerHTML = `
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #4F46E5; margin-bottom: 10px;">Talk2Me - Speech Analysis Report</h1>
                    <p style="color: #666; font-size: 14px;">${date}</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">Topic</h2>
                    <p style="font-size: 18px; font-weight: bold; color: #333;">${attempt.topic?.title || 'Custom Topic'}</p>
                    ${attempt.topic?.description ? `<p style="color: #666; margin-top: 5px;">${attempt.topic.description}</p>` : ''}
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">Performance Metrics</h2>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px;">
                            <p style="color: #666; font-size: 12px; margin: 0;">Overall Score</p>
                            <p style="font-size: 32px; font-weight: bold; color: #4F46E5; margin: 5px 0;">${attempt.score}</p>
                        </div>
                        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px;">
                            <p style="color: #666; font-size: 12px; margin: 0;">Topic Match</p>
                            <p style="font-size: 32px; font-weight: bold; color: #4F46E5; margin: 5px 0;">${feedback.content_match_score || 0}%</p>
                        </div>
                        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px;">
                            <p style="color: #666; font-size: 12px; margin: 0;">Words Per Minute</p>
                            <p style="font-size: 32px; font-weight: bold; color: #333; margin: 5px 0;">${attempt.wpm}</p>
                        </div>
                        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px;">
                            <p style="color: #666; font-size: 12px; margin: 0;">Filler Words</p>
                            <p style="font-size: 32px; font-weight: bold; color: #333; margin: 5px 0;">${attempt.filler_count}</p>
                        </div>
                        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px;">
                            <p style="color: #666; font-size: 12px; margin: 0;">Tone</p>
                            <p style="font-size: 18px; font-weight: bold; color: #333; margin: 5px 0;">${feedback.tone || 'N/A'}</p>
                        </div>
                        <div style="background: #F3F4F6; padding: 15px; border-radius: 8px;">
                            <p style="color: #666; font-size: 12px; margin: 0;">Clarity</p>
                            <p style="font-size: 32px; font-weight: bold; color: #333; margin: 5px 0;">${feedback.metrics?.clarity || 0}%</p>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">Transcript</h2>
                    <p style="background: #F9FAFB; padding: 15px; border-radius: 8px; color: #333; line-height: 1.6; font-style: italic;">"${attempt.transcript || 'N/A'}"</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">Improvement Plan</h2>
                    <ul style="list-style: none; padding: 0;">
                        ${(feedback.improvement_plan || []).map((tip, idx) => `
                            <li style="background: #ECFDF5; padding: 12px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid #10B981;">
                                <span style="font-weight: bold; color: #059669;">${idx + 1}.</span> ${tip}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #999; font-size: 12px;">
                    <p>Generated by Talk2Me - AI Communication Coach</p>
                </div>
            `;

            document.body.appendChild(reportDiv);

            const canvas = await html2canvas(reportDiv, {
                scale: 2,
                useCORS: true,
                logging: false
            });

            document.body.removeChild(reportDiv);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Talk2Me_Report_${attempt.topic?.title || 'Speech'}_${date}.pdf`);

            showAlert('success', 'Report downloaded successfully!', 'Success');
        } catch (error) {
            console.error('PDF generation failed:', error);
            showAlert('error', 'Failed to generate PDF', 'Error');
        }
    };

    // Calculate Stats
    const totalAttempts = attempts.length;
    const avgScore = totalAttempts > 0 ? (attempts.reduce((acc, curr) => acc + curr.score, 0) / totalAttempts).toFixed(1) : 0;
    const bestScore = totalAttempts > 0 ? Math.max(...attempts.map(a => a.score)).toFixed(1) : 0;

    // Prepare Chart Data (sort by date)
    const chartData = [...attempts].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map((a, index) => ({
        name: `Attempt ${index + 1}`,
        score: a.score,
        wpm: a.wpm,
        date: new Date(a.created_at).toLocaleDateString()
    }));


    // Recent Activity (reverse chronological)
    const recentActivity = [...attempts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <SEO
                title="My Profile"
                description="View your speech analysis history, track your progress, and manage your account settings."
            />
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
                                    <div className="h-full w-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                        <User size={40} />
                                    </div>
                                </div>
                                <div className="ml-4 mb-1 flex-1">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={editData.username}
                                                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                                className="block w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Username"
                                            />
                                            <input
                                                type="email"
                                                value={editData.email}
                                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                className="block w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Email"
                                            />
                                            <input
                                                type="password"
                                                value={editData.password}
                                                onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                                className="block w-full px-3 py-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="New Password (optional)"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                                            <p className="text-gray-500">{user.email}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="mb-1 flex flex-col items-end space-y-2">
                                <div className="text-sm text-gray-500 flex items-center">
                                    <Calendar size={16} className="mr-1" /> Joined {new Date(user.created_at).toLocaleDateString()}
                                </div>
                                <div>
                                    {isEditing ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleSave}
                                                className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                            >
                                                <Save size={16} className="mr-1" /> Save
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="flex items-center px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                            >
                                                <X size={16} className="mr-1" /> Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleEdit}
                                            className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                        >
                                            <Edit2 size={16} className="mr-1" /> Edit Profile
                                        </button>
                                    )}
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Audio</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WPM</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tone</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {attempt.audio_url ? (
                                                        <audio controls src={`${API_URL}/uploads/${attempt.audio_url}`} className="h-8 w-48" />
                                                    ) : (
                                                        <span className="text-gray-400 italic">Not available</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${attempt.score >= 80 ? 'bg-green-100 text-green-800' :
                                                        attempt.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {attempt.score}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {attempt.wpm}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {attempt.feedback_json?.tone || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleViewReport(attempt)}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                                            title="View Report"
                                                        >
                                                            <Eye size={16} />
                                                            <span className="text-xs font-medium">View</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDownloadPDF(attempt)}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                            title="Download PDF"
                                                        >
                                                            <Download size={16} />
                                                            <span className="text-xs font-medium">PDF</span>
                                                        </button>
                                                    </div>
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

            {/* Report Modal */}
            {showReportModal && selectedAttempt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowReportModal(false)}>
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <FileText size={28} />
                                    Speech Analysis Report
                                </h2>
                                <p className="text-indigo-100 text-sm mt-1">
                                    {new Date(selectedAttempt.created_at).toLocaleDateString('en-US', {
                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                            {/* Topic Section */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Mic className="text-indigo-600" size={20} />
                                    Topic
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <p className="text-xl font-bold text-gray-900">{selectedAttempt.topic?.title || 'Custom Topic'}</p>
                                    {selectedAttempt.topic?.description && (
                                        <p className="text-gray-600 mt-2">{selectedAttempt.topic.description}</p>
                                    )}
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <TrendingUp className="text-indigo-600" size={20} />
                                    Performance Metrics
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
                                        <p className="text-sm text-indigo-700 font-medium">Overall Score</p>
                                        <p className="text-4xl font-bold text-indigo-900 mt-1">{selectedAttempt.score}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                                        <p className="text-sm text-purple-700 font-medium">Topic Match</p>
                                        <p className="text-4xl font-bold text-purple-900 mt-1">{selectedAttempt.feedback_json?.content_match_score || 0}%</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <p className="text-sm text-gray-600 font-medium">Words Per Minute</p>
                                        <p className="text-4xl font-bold text-gray-900 mt-1">{selectedAttempt.wpm}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <p className="text-sm text-gray-600 font-medium">Filler Words</p>
                                        <p className="text-4xl font-bold text-gray-900 mt-1">{selectedAttempt.filler_count}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <p className="text-sm text-gray-600 font-medium">Tone</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{selectedAttempt.feedback_json?.tone || 'N/A'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <p className="text-sm text-gray-600 font-medium">Clarity</p>
                                        <p className="text-4xl font-bold text-gray-900 mt-1">{selectedAttempt.feedback_json?.metrics?.clarity || 0}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Transcript */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Transcript</h3>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <p className="text-gray-700 italic leading-relaxed">"{selectedAttempt.transcript || 'N/A'}"</p>
                                </div>
                            </div>

                            {/* Improvement Plan */}
                            {selectedAttempt.feedback_json?.improvement_plan && selectedAttempt.feedback_json.improvement_plan.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Star className="text-green-600" size={20} />
                                        Improvement Plan
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedAttempt.feedback_json.improvement_plan.map((tip, idx) => (
                                            <div key={idx} className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500">
                                                <p className="text-green-900">
                                                    <span className="font-bold text-green-700">{idx + 1}.</span> {tip}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Audio Playback */}
                            {selectedAttempt.audio_url && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Audio Recording</h3>
                                    <audio controls src={`${API_URL}/uploads/${selectedAttempt.audio_url}`} className="w-full" />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => handleDownloadPDF(selectedAttempt)}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-200"
                                >
                                    <Download size={20} />
                                    Download as PDF
                                </button>
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
