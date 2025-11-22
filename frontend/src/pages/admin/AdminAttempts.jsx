import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { showAlert } from '../../utils/alert';

const AdminAttempts = ({ user }) => {
    const [attempts, setAttempts] = useState([]);

    useEffect(() => {
        fetchAttempts();
    }, []);

    const fetchAttempts = async () => {
        if (!user || !user.token) {
            console.error("User or token not available");
            return;
        }
        try {
            const response = await axios.get('http://localhost:8000/admin/attempts', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setAttempts(response.data);
        } catch (error) {
            console.error("Failed to fetch attempts", error);
        }
    };

    const handleDelete = async (attemptId) => {
        const result = await showAlert('warning', 'Are you sure you want to delete this attempt? This action cannot be undone.', 'Delete Attempt', true);
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8000/admin/attempts/${attemptId}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                fetchAttempts();
                showAlert('success', 'Attempt deleted successfully!', 'Deleted');
            } catch (error) {
                console.error("Failed to delete attempt", error);
                showAlert('error', error.response?.data?.detail || 'Failed to delete attempt', 'Error');
            }
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Voice Analysis</h1>
                <p className="text-gray-600 mt-2">View and manage all voice analysis attempts</p>
            </div>

            {/* Attempts List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">All Attempts ({attempts.length})</h2>
                <div className="space-y-3">
                    {attempts.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No attempts yet</p>
                    ) : (
                        attempts.map((attempt) => (
                            <div key={attempt.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h3 className="font-semibold text-gray-900">{attempt.user?.username || 'Unknown User'}</h3>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-sm text-gray-600">{attempt.topic?.title || 'Unknown Topic'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">WPM:</span>
                                            <span className="ml-1 font-medium text-gray-900">{attempt.wpm?.toFixed(0) || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Filler Words:</span>
                                            <span className="ml-1 font-medium text-gray-900">{attempt.filler_count}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Score:</span>
                                            <span className={`ml-1 font-medium ${attempt.score >= 80 ? 'text-green-600' :
                                                attempt.score >= 60 ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`}>{attempt.score || 'N/A'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Date:</span>
                                            <span className="ml-1 font-medium text-gray-900">
                                                {new Date(attempt.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    {attempt.transcript && (
                                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                            {attempt.transcript}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(attempt.id)}
                                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors ml-4"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAttempts;
