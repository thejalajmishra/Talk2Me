import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Shield } from 'lucide-react';

const AdminUsers = ({ user }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        if (!user || !user.token) {
            console.error("User or token not available");
            return;
        }
        try {
            const response = await axios.get('http://localhost:8000/admin/users', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const handleToggleAdmin = async (userId) => {
        try {
            await axios.post(`http://localhost:8000/admin/users/${userId}/toggle-admin`, {}, {
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
                await axios.delete(`http://localhost:8000/admin/users/${userId}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                fetchUsers();
            } catch (error) {
                console.error("Failed to delete user", error);
                alert(error.response?.data?.detail || "Failed to delete user");
            }
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Registered Users ({users.length})</h2>
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
        </div>
    );
};

export default AdminUsers;
