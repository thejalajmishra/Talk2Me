import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, User } from 'lucide-react';
import { showAlert } from '../utils/alert';

const EditProfilePage = ({ user, onUpdate }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        profile_picture: user?.profile_picture || '👨‍💻'
    });
    const [loading, setLoading] = useState(false);

    const avatars = ['👨‍💻', '👩‍💻', '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🧑‍🚀', '👩‍🚀', '🦊', '🐼'];

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatePayload = {
                username: formData.username,
                email: formData.email,
                profile_picture: formData.profile_picture
            };
            if (formData.password) {
                updatePayload.password = formData.password;
            }

            const response = await axios.put('http://localhost:8000/users/me', updatePayload, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            // Update local user state
            const updatedUser = { ...user, ...response.data };
            onUpdate(updatedUser);

            showAlert('success', 'Profile updated successfully!', 'Success');
            navigate('/profile');
        } catch (error) {
            console.error("Failed to update profile", error);
            showAlert('error', error.response?.data?.detail || 'Failed to update profile', 'Error');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Profile
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 flex items-center px-8">
                        <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Avatar Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">Choose Avatar</label>
                                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                                    {avatars.map((avatar) => (
                                        <button
                                            key={avatar}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, profile_picture: avatar })}
                                            className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl border-2 transition-all ${formData.profile_picture === avatar
                                                    ? 'border-indigo-600 bg-indigo-50 scale-110 shadow-md'
                                                    : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                                }`}
                                        >
                                            {avatar}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password <span className="text-gray-400 font-normal">(optional)</span></label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Leave blank to keep current password"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/profile')}
                                    className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center shadow-lg shadow-indigo-200"
                                >
                                    {loading ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Changes</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;
