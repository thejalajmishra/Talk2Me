
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../../config/api';
import { Trash2, Shield, Edit2, Save, X, Plus } from 'lucide-react';
import { showAlert } from '../../utils/alert';

const AdminUsers = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editData, setEditData] = useState({ username: '', email: '', password: '' });
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

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

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newUser.username || !newUser.email || !newUser.password) {
            showAlert('warning', 'Please fill in all fields', 'Missing Information');
            return;
        }

        try {
            await axios.post(`${API_URL}/admin/users`, newUser, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setNewUser({ username: '', email: '', password: '' });
            setShowAddForm(false);
            fetchUsers();
            showAlert('success', 'User created successfully!', 'Success');
        } catch (error) {
            console.error("Failed to create user", error);
            showAlert('error', error.response?.data?.detail || 'Failed to create user', 'Error');
        }
    };

    const handleToggleAdmin = async (userId) => {
        try {
            await axios.post(`${API_URL}/admin/users/${userId}/toggle-admin`, {}, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            fetchUsers();
            showAlert('success', 'User admin status updated successfully!', 'Success');
        } catch (error) {
            console.error("Failed to toggle admin status", error);
            showAlert('error', error.response?.data?.detail || 'Failed to update user', 'Error');
        }
    };

    const handleDeleteUser = async (userId) => {
        const result = await showAlert('warning', 'Are you sure you want to delete this user? This action cannot be undone.', 'Delete User', true);
        if (result.isConfirmed) {
            try {
                await axios.delete(`${API_URL}/admin/users/${userId}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                fetchUsers();
                showAlert('success', 'User deleted successfully!', 'Deleted');
            } catch (error) {
                console.error("Failed to delete user", error);
                showAlert('error', error.response?.data?.detail || 'Failed to delete user', 'Error');
            }
        }
    };

    const handleEdit = (u) => {
        setEditingUser(u.id);
        setEditData({ username: u.username, email: u.email, password: '' });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditData({ username: '', email: '', password: '' });
    };

    const handleUpdate = async (id) => {
        try {
            const updatePayload = {
                username: editData.username,
                email: editData.email
            };
            if (editData.password) {
                updatePayload.password = editData.password;
            }

            await axios.put(`${API_URL}/admin/users/${id}`, updatePayload, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setEditingUser(null);
            fetchUsers();
            showAlert('success', 'User updated successfully!', 'Updated');
        } catch (error) {
            console.error("Failed to update user", error);
            showAlert('error', error.response?.data?.detail || 'Failed to update user', 'Error');
        }
    };

    return (
        <div>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                    <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    {showAddForm ? <X size={20} className="mr-2" /> : <Plus size={20} className="mr-2" />}
                    {showAddForm ? 'Cancel' : 'Add User'}
                </button>
            </div>

            {/* Add User Form */}
            {showAddForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 animate-fade-in">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New User</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        <div className="md:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Create User
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Registered Users ({users.length})</h2>
                <div className="space-y-3">
                    {users.map((u) => (
                        <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                            <div className="flex-1">
                                {editingUser === u.id ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                                        <input
                                            type="text"
                                            value={editData.username}
                                            onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Username"
                                        />
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Email"
                                        />
                                        <input
                                            type="password"
                                            value={editData.password}
                                            onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="New Password (optional)"
                                        />
                                    </div>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </div>
                            <div className="flex space-x-2 ml-4">
                                {editingUser === u.id ? (
                                    <>
                                        <button
                                            onClick={() => handleUpdate(u.id)}
                                            className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Save"
                                        >
                                            <Save size={18} />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                            title="Cancel"
                                        >
                                            <X size={18} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleEdit(u)}
                                            className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
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
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
