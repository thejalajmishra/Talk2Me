import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, LayoutGrid, Users, FolderOpen, Edit2, Shield, Mic } from 'lucide-react';

const AdminPage = ({ user }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('topics');

    // Topics state
    const [topics, setTopics] = useState([]);
    const [newTopic, setNewTopic] = useState({
        title: '',
        category_id: null,
        difficulty: 'Medium',
        description: '',
        time_limit: 60
    });

    // Categories state
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [editingCategory, setEditingCategory] = useState(null);

    // Users state
    const [users, setUsers] = useState([]);

    // Attempts state
    const [attempts, setAttempts] = useState([]);

    useEffect(() => {
        fetchTopics();
        fetchCategories();
        fetchUsers();
        fetchAttempts();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await axios.get(`${API_URL}/topics`);
            setTopics(response.data);
        } catch (error) {
            console.error("Failed to fetch topics", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/categories`);
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchUsers = async () => {
        if (!user || !user.token) {
            console.error("User or token not available");
            return;
        }
        try {
            const response = await axios.get(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const fetchAttempts = async () => {
        if (!user || !user.token) {
            console.error("User or token not available");
            return;
        }
        try {
            const response = await axios.get(`${API_URL}/admin/attempts`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setAttempts(response.data);
        } catch (error) {
            console.error("Failed to fetch attempts", error);
        }
    };

    // Topic handlers
    const handleTopicSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/topics`, newTopic, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setNewTopic({ title: '', category_id: null, difficulty: 'Medium', description: '', time_limit: 60 });
            fetchTopics();
        } catch (error) {
            console.error("Failed to create topic", error);
            alert(error.response?.data?.detail || "Failed to create topic");
        }
    };

    const handleTopicDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this topic?")) {
            try {
                await axios.delete(`${API_URL}/topics/${id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                fetchTopics();
            } catch (error) {
                console.error("Failed to delete topic", error);
                alert(error.response?.data?.detail || "Failed to delete topic");
            }
        }
    };

    // Category handlers
    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axios.put(`${API_URL}/categories/${editingCategory.id}`, newCategory, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                setEditingCategory(null);
            } else {
                await axios.post(`${API_URL}/categories`, newCategory, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
            }
            setNewCategory({ name: '', description: '' });
            fetchCategories();
            fetchTopics(); // Refresh topics to show updated categories
        } catch (error) {
            console.error("Failed to save category", error);
            alert(error.response?.data?.detail || "Failed to save category");
        }
    };

    const handleCategoryEdit = (category) => {
        setEditingCategory(category);
        setNewCategory({ name: category.name, description: category.description || '' });
    };

    const handleCategoryDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await axios.delete(`${API_URL}/categories/${id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                fetchCategories();
                fetchTopics();
            } catch (error) {
                console.error("Failed to delete category", error);
                alert(error.response?.data?.detail || "Cannot delete category with existing topics");
            }
        }
    };

    // User handlers
    const handleToggleAdmin = async (userId) => {
        try {
            await axios.post(`${API_URL}/admin/users/${userId}/toggle-admin`, {}, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            fetchUsers();
        } catch (error) {
            console.error("Failed to toggle admin status", error);
            alert(error.response?.data?.detail || "Failed to update user");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`${API_URL}/admin/users/${userId}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                fetchUsers();
            } catch (error) {
                console.error("Failed to delete user", error);
                alert(error.response?.data?.detail || "Failed to delete user");
            }
        }
    };

    // Attempt handlers
    const handleDeleteAttempt = async (attemptId) => {
        if (window.confirm("Are you sure you want to delete this attempt?")) {
            try {
                await axios.delete(`${API_URL}/admin/attempts/${attemptId}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                fetchAttempts();
            } catch (error) {
                console.error("Failed to delete attempt", error);
                alert(error.response?.data?.detail || "Failed to delete attempt");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back to Home
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <LayoutGrid className="mr-3 text-indigo-600" size={32} />
                        Admin Panel
                    </h1>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('topics')}
                            className={`${activeTab === 'topics'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                        >
                            <LayoutGrid size={18} className="mr-2" />
                            Topics
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`${activeTab === 'categories'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                        >
                            <FolderOpen size={18} className="mr-2" />
                            Categories
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`${activeTab === 'users'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                        >
                            <Users size={18} className="mr-2" />
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('attempts')}
                            className={`${activeTab === 'attempts'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
                        >
                            <Mic size={18} className="mr-2" />
                            Voice Analysis
                        </button>
                    </nav>
                </div>

                {/* Topics Tab */}
                {activeTab === 'topics' && (
                    <div>
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 p-6 mb-6 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Plus className="mr-2 text-indigo-600" size={24} />
                                Add New Topic
                            </h2>
                            <form onSubmit={handleTopicSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Topic Title"
                                        value={newTopic.title}
                                        onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        required
                                    />
                                    <select
                                        value={newTopic.category_id || ''}
                                        onChange={(e) => setNewTopic({ ...newTopic, category_id: e.target.value ? parseInt(e.target.value) : null })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={newTopic.difficulty}
                                        onChange={(e) => setNewTopic({ ...newTopic, difficulty: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Time Limit (seconds)"
                                        value={newTopic.time_limit}
                                        onChange={(e) => setNewTopic({ ...newTopic, time_limit: parseInt(e.target.value) })}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        min="10"
                                    />
                                </div>
                                <textarea
                                    placeholder="Description (optional)"
                                    value={newTopic.description}
                                    onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    rows="3"
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md shadow-indigo-200"
                                >
                                    Add Topic
                                </button>
                            </form>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 p-6 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Topics</h2>
                            <div className="space-y-3">
                                {topics.map((topic) => (
                                    <div key={topic.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                                            <div className="flex items-center space-x-3 mt-1">
                                                <span className="text-sm text-gray-600">
                                                    {topic.category?.name || 'No Category'}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${topic.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                    topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {topic.difficulty}
                                                </span>
                                                <span className="text-xs text-gray-500 flex items-center">
                                                    ⏱ {topic.time_limit || 60}s
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleTopicDelete(topic.id)}
                                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div>
                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 p-6 mb-6 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Plus className="mr-2 text-indigo-600" size={24} />
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
                            </h2>
                            <form onSubmit={handleCategorySubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    required
                                />
                                <textarea
                                    placeholder="Description (optional)"
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    rows="2"
                                />
                                <div className="flex space-x-2">
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md shadow-indigo-200"
                                    >
                                        {editingCategory ? 'Update' : 'Add'} Category
                                    </button>
                                    {editingCategory && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingCategory(null);
                                                setNewCategory({ name: '', description: '' });
                                            }}
                                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 p-6 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Categories</h2>
                            <div className="space-y-3">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                            {category.description && (
                                                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleCategoryEdit(category)}
                                                className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleCategoryDelete(category.id)}
                                                className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Registered Users</h2>
                        <div className="space-y-3">
                            {users.map((u) => (
                                <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-semibold text-gray-900">{u.username}</h3>
                                            {u.is_superadmin && (
                                                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center">
                                                    <Shield size={12} className="mr-1" />
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">{u.email}</p>
                                        <p className="text-xs text-gray-500 mt-1">Joined: {new Date(u.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleToggleAdmin(u.id)}
                                            className={`${u.is_superadmin
                                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                } px-4 py-2 rounded-lg transition-colors font-medium text-sm`}
                                        >
                                            {u.is_superadmin ? 'Remove Admin' : 'Make Admin'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            disabled={u.id === user.id}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Attempts Tab */}
                {activeTab === 'attempts' && (
                    <div className="bg-white rounded-2xl shadow-xl shadow-gray-100 p-6 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Voice Analysis Attempts</h2>
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
                                            <div className="mt-3">
                                                {attempt.audio_url ? (
                                                    <audio controls src={`${API_URL}/uploads/${attempt.audio_url}`} className="h-8 w-full max-w-md" />
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Audio not available</span>
                                                )}
                                            </div>
                                            {attempt.transcript && (
                                                <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                                                    {attempt.transcript}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteAttempt(attempt.id)}
                                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors ml-4"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default AdminPage;
