import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Mail, Lock, Save, Eye, EyeOff, Check } from 'lucide-react';
import { showAlert } from '../utils/alert';
import SEO from '../components/SEO';
import { AVATARS, getAvatarPath } from '../utils/avatars';

const EditProfilePage = ({ user, onUpdate }) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
        profile_picture: user?.profile_picture || 'avatar1'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.username.trim()) {
            showAlert('error', 'Username is required');
            return;
        }

        if (!formData.email.trim()) {
            showAlert('error', 'Email is required');
            return;
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            showAlert('error', 'Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const updateData = {
                username: formData.username,
                email: formData.email,
                profile_picture: formData.profile_picture
            };

            // Only include password if it's being changed
            if (formData.password) {
                updateData.password = formData.password;
            }

            const response = await axios.put(
                'http://localhost:8000/users/me',
                updateData,
                {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                }
            );


            // Update user in localStorage and state
            const updatedUser = {
                ...user,
                username: response.data.username || user.username,
                email: response.data.email || user.email,
                profile_picture: formData.profile_picture,
                token: user.token  // Preserve token
            };
            localStorage.setItem('talk2me_user', JSON.stringify(updatedUser));
            onUpdate(updatedUser);


            showAlert('success', 'Profile updated successfully!');
            navigate('/profile');
        } catch (error) {
            console.error('Failed to update profile', error);
            showAlert('error', error.response?.data?.detail || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SEO
                title="Edit Profile"
                description="Update your Talk2Me profile information"
            />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to Profile
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                    <p className="text-gray-500 mt-2">Update your account information</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Avatar Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Profile Picture
                            </label>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                {AVATARS.map((avatar) => (
                                    <button
                                        key={avatar.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, profile_picture: avatar.id })}
                                        className={`relative aspect-square rounded-full overflow-hidden border-4 transition-all hover:scale-105 ${formData.profile_picture === avatar.id
                                            ? 'border-indigo-600 ring-4 ring-indigo-100'
                                            : 'border-gray-200 hover:border-indigo-300'
                                            }`}
                                    >
                                        <img
                                            src={avatar.path}
                                            alt={avatar.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {formData.profile_picture === avatar.id && (
                                            <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                                                <Check className="w-8 h-8 text-white drop-shadow-lg" strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Choose an avatar for your profile</p>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password (Optional)</h3>
                            <p className="text-sm text-gray-500 mb-4">Leave blank if you don't want to change your password</p>

                            {/* New Password */}
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={20} className="mr-2" />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Your email address is used for login and notifications. Make sure it's accurate and accessible.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;
