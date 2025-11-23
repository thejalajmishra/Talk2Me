import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Mic, Clock, TrendingUp, Sparkles, ChevronLeft, ChevronRight, Lock, User } from 'lucide-react';
import SEO from '../components/SEO';

const PAGE_SIZE = 8; // 8 topics + 1 custom card = 9 items per page

const TopicsPage = ({ user }) => {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [pendingPath, setPendingPath] = useState(null);
    const [showRecommended, setShowRecommended] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tRes, cRes] = await Promise.all([
                    axios.get(`${API_URL}/topics`),
                    axios.get(`${API_URL}/categories`),
                ]);
                setTopics(tRes.data);
                setCategories(cRes.data);
            } catch (e) {
                console.error('Failed to load topics/categories', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Get user's interests from onboarding data
    const userInterests = user?.onboarding_data?.interests || [];

    // Filter topics based on search, category, difficulty, and interests
    const filtered = topics.filter(topic => {
        const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCat || topic.category?.id === Number(selectedCat);
        const matchesDifficulty = !selectedDifficulty || topic.difficulty === selectedDifficulty;
        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Recommended topics based on user interests
    const recommended = userInterests.length > 0 ? filtered.filter(topic => {
        const topicCategory = topic.category?.name || '';
        return userInterests.some(interest =>
            topicCategory.toLowerCase().includes(interest.toLowerCase()) ||
            topic.title.toLowerCase().includes(interest.toLowerCase()) ||
            topic.description?.toLowerCase().includes(interest.toLowerCase())
        );
    }) : [];

    // Topics to display (recommended first if showing, then others)
    const topicsToShow = showRecommended && recommended.length > 0 ? recommended : filtered;

    const pageCount = Math.ceil(topicsToShow.length / PAGE_SIZE);
    const displayed = topicsToShow.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleCatChange = (catId) => {
        setSelectedCat(catId);
        setCurrentPage(1);
    };

    const handleDifficultyChange = (diff) => {
        setSelectedDifficulty(diff);
        setCurrentPage(1);
    };

    const handleTopicClick = (path) => {
        if (user) {
            navigate(path);
        } else {
            setPendingPath(path);
            setShowLoginModal(true);
        }
    };

    const handleGuestAccess = () => {
        if (pendingPath) {
            navigate(`${pendingPath}?guest=true`);
        }
        setShowLoginModal(false);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getDifficultyIcon = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return '⭐';
            case 'Medium': return '⭐⭐';
            case 'Hard': return '⭐⭐⭐';
            default: return '⭐';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading topics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
            <SEO
                title="Practice Topics"
                description="Choose from a variety of topics to practice your public speaking skills. Get instant AI feedback on your performance."
            />
            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all scale-100">
                        <div className="text-center mb-8">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="text-indigo-600" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unlock Full Practice</h2>
                            <p className="text-gray-600">
                                Sign up to save your progress, track improvements, and get detailed analytics.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center"
                            >
                                <User className="mr-2" size={20} />
                                Login / Sign Up
                            </button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">or</span>
                                </div>
                            </div>

                            <button
                                onClick={handleGuestAccess}
                                className="w-full py-3 px-4 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-semibold transition-all flex items-center justify-center hover:bg-gray-50"
                            >
                                Try as Guest
                                <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">No Save</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="mt-6 text-sm text-gray-400 hover:text-gray-600 w-full text-center"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-extrabold mb-4 flex items-center justify-center">
                            <Mic className="mr-4" size={48} />
                            Practice Topics
                        </h1>
                        <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                            Choose a topic and start improving your communication skills with AI-powered feedback
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search and Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search topics..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    value={selectedCat}
                                    onChange={(e) => handleCatChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => handleDifficultyChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
                            >
                                <option value="">All Levels</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(selectedCat || selectedDifficulty || searchQuery) && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {searchQuery && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700">
                                    Search: "{searchQuery}"
                                    <button onClick={() => setSearchQuery('')} className="ml-2 hover:text-indigo-900">×</button>
                                </span>
                            )}
                            {selectedCat && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
                                    Category: {categories.find(c => c.id === Number(selectedCat))?.name}
                                    <button onClick={() => setSelectedCat('')} className="ml-2 hover:text-purple-900">×</button>
                                </span>
                            )}
                            {selectedDifficulty && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-700">
                                    Level: {selectedDifficulty}
                                    <button onClick={() => setSelectedDifficulty('')} className="ml-2 hover:text-pink-900">×</button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Recommended Topics Banner */}
                {user && recommended.length > 0 && (
                    <div className="mb-6">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Sparkles size={24} className="text-yellow-300" />
                                    <div>
                                        <h2 className="text-xl font-bold">Recommended for You</h2>
                                        <p className="text-indigo-100 text-sm">Based on your interests: {userInterests.join(', ')}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowRecommended(!showRecommended)}
                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all font-medium text-sm backdrop-blur-sm"
                                >
                                    {showRecommended ? 'Show All Topics' : 'Show Recommended'}
                                </button>
                            </div>
                            {showRecommended && (
                                <div className="mt-4 text-sm text-indigo-100">
                                    Showing {recommended.length} topic{recommended.length !== 1 ? 's' : ''} matching your interests
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{displayed.length}</span> of{' '}
                        <span className="font-semibold text-gray-900">{topicsToShow.length}</span> topics
                    </p>
                </div>

                {/* Topics Grid */}
                {displayed.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                            <Sparkles size={64} className="mx-auto mb-4 text-gray-300" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No topics found</h3>
                            <p className="text-gray-600">Try adjusting your filters or search query</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                        {/* Custom Topic Creation Card */}
                        <div
                            onClick={() => handleTopicClick('/topics/custom')}
                            className="cursor-pointer bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border-2 border-purple-400 relative"
                        >
                            {/* Sparkle Effect */}
                            <div className="absolute top-4 right-4">
                                <Sparkles size={32} className="text-yellow-300 animate-pulse" />
                            </div>

                            {/* Card Content */}
                            <div className="p-8 text-white h-full flex flex-col justify-between min-h-[320px]">
                                <div>
                                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm inline-block mb-4">
                                        ✨ New Feature
                                    </div>
                                    <h3 className="text-3xl font-extrabold mb-4 group-hover:scale-105 transition-transform">
                                        Create Custom Topic
                                    </h3>
                                    <p className="text-purple-100 mb-6">
                                        Record your own topic with speech-to-text! Your custom topics will be saved for practice.
                                    </p>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                    <div className="flex items-center justify-center space-x-2 text-white font-semibold">
                                        <Sparkles size={20} />
                                        <span>Start Creating</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Regular Topics */}
                        {displayed.map(topic => (
                            <div
                                key={topic.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                            >
                                {/* Card Header with Gradient */}
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                                            {topic.category?.name || 'Uncategorized'}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(topic.difficulty)}`}>
                                            {getDifficultyIcon(topic.difficulty)} {topic.difficulty}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform">
                                        {topic.title}
                                    </h3>
                                </div>

                                {/* Card Body */}
                                <div className="p-6">
                                    <p className="text-gray-600 mb-6 line-clamp-3 min-h-[4.5rem]">
                                        {topic.description || 'Practice your speaking skills on this topic and get instant AI feedback.'}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Clock size={16} className="mr-1" />
                                            <span>2-3 min</span>
                                        </div>
                                        <div className="flex items-center">
                                            <TrendingUp size={16} className="mr-1" />
                                            <span>AI Feedback</span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleTopicClick(`/record/${topic.id}`)}
                                        className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-md hover:shadow-lg group-hover:scale-105 transform"
                                    >
                                        <span className="flex items-center justify-center">
                                            <Mic size={18} className="mr-2" />
                                            Start Recording
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pageCount > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex space-x-2">
                            {[...Array(pageCount)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${i + 1 === currentPage
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                            disabled={currentPage === pageCount}
                            className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopicsPage;
