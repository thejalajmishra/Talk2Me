import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Sparkles, Edit2, Save, X } from 'lucide-react';
import { showAlert } from '../../utils/alert';

const AdminTopics = ({ user }) => {
    const [topics, setTopics] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newTopic, setNewTopic] = useState({
        title: '',
        category_id: null,
        difficulty: 'Medium',
        description: ''
    });
    const [editingTopic, setEditingTopic] = useState(null);
    const [editData, setEditData] = useState({
        title: '',
        category_id: null,
        difficulty: 'Medium',
        description: ''
    });

    useEffect(() => {
        fetchTopics();
        fetchCategories();
    }, []);

    const fetchTopics = async () => {
        try {
            // Use admin endpoint to get all topics including custom ones
            const response = await axios.get('http://localhost:8000/admin/topics/all', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setTopics(response.data);
        } catch (error) {
            console.error("Failed to fetch topics", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate category selection
        if (!newTopic.category_id) {
            showAlert('warning', 'Please select a category', 'Category Required');
            return;
        }

        try {
            await axios.post('http://localhost:8000/topics', newTopic, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setNewTopic({ title: '', category_id: null, difficulty: 'Medium', description: '' });
            fetchTopics();
            showAlert('success', 'Topic has been created successfully!', 'Success');
        } catch (error) {
            console.error("Failed to create topic", error);
            showAlert('error', error.response?.data?.detail || 'Failed to create topic', 'Error');
        }
    };

    const handleDelete = async (id) => {
        const result = await showAlert('warning', 'Are you sure you want to delete this topic? This action cannot be undone.', 'Delete Topic', true);
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8000/topics/${id}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                fetchTopics();
                showAlert('success', 'Topic has been deleted successfully!', 'Deleted');
            } catch (error) {
                console.error("Failed to delete topic", error);
                showAlert('error', error.response?.data?.detail || 'Failed to delete topic', 'Error');
            }
        }
    };

    const handleEdit = (topic) => {
        setEditingTopic(topic.id);
        setEditData({
            title: topic.title,
            category_id: topic.category_id,
            difficulty: topic.difficulty,
            description: topic.description || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingTopic(null);
        setEditData({
            title: '',
            category_id: null,
            difficulty: 'Medium',
            description: ''
        });
    };

    const handleUpdate = async (id) => {
        if (!editData.category_id) {
            showAlert('warning', 'Please select a category before saving', 'Category Required');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/topics/${id}`, editData, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setEditingTopic(null);
            fetchTopics();
            showAlert('success', 'Topic has been updated successfully!', 'Updated');
        } catch (error) {
            console.error("Failed to update topic", error);
            showAlert('error', error.response?.data?.detail || 'Failed to update topic', 'Error');
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Topics Management</h1>
                <p className="text-gray-600 mt-2">Manage speaking topics for users</p>
            </div>

            {/* Add Topic Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Plus className="mr-2 text-indigo-600" size={24} />
                    Add New Topic
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Topic Title"
                            value={newTopic.title}
                            onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            required
                        />
                        <select
                            value={newTopic.category_id || ''}
                            onChange={(e) => setNewTopic({ ...newTopic, category_id: e.target.value ? parseInt(e.target.value) : null })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            required
                        >
                            <option value="">Select Category *</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <select
                            value={newTopic.difficulty}
                            onChange={(e) => setNewTopic({ ...newTopic, difficulty: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <textarea
                        placeholder="Description (optional)"
                        value={newTopic.description}
                        onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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

            {/* Topics List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Topics ({topics.length})</h2>
                <div className="space-y-3">
                    {topics.map((topic) => (
                        <div key={topic.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                            {editingTopic === topic.id ? (
                                /* Edit Mode */
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={editData.title}
                                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Topic Title"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <select
                                            value={editData.category_id || ''}
                                            onChange={(e) => setEditData({ ...editData, category_id: e.target.value ? parseInt(e.target.value) : null })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={editData.difficulty}
                                            onChange={(e) => setEditData({ ...editData, difficulty: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>
                                    <textarea
                                        value={editData.description}
                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        rows="2"
                                        placeholder="Description (optional)"
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleUpdate(topic.id)}
                                            className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Save size={16} />
                                            <span>Save</span>
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex items-center space-x-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            <X size={16} />
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* View Mode */
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-semibold text-gray-900">{topic.title}</h3>
                                            {topic.is_custom && (
                                                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center">
                                                    <Sparkles size={12} className="mr-1" />
                                                    Custom
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-3 mt-1">
                                            <span className="text-sm text-gray-600">
                                                {topic.category?.name || 'No Category'}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full flex items-center ${topic.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                topic.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    topic.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                <Sparkles size={12} className="mr-1" />
                                                {topic.difficulty}
                                            </span>
                                        </div>
                                        {topic.description && (
                                            <p className="text-sm text-gray-600 mt-2">{topic.description}</p>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(topic)}
                                            className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(topic.id)}
                                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminTopics;
