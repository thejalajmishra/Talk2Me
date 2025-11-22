import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Filter, Mic, Clock, TrendingUp, Sparkles, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const PAGE_SIZE = 9;

const TopicsPage = () => {
    const [topics, setTopics] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tRes, cRes] = await Promise.all([
                    axios.get('http://localhost:8000/topics'),
                    axios.get('http://localhost:8000/categories'),
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

    // Filter topics based on search, category, and difficulty
    const filtered = topics.filter(topic => {
        const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCat || topic.category?.id === Number(selectedCat);
        const matchesDifficulty = !selectedDifficulty || topic.difficulty === selectedDifficulty;
        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
    const displayed = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleCatChange = (catId) => {
        setSelectedCat(catId);
        setCurrentPage(1);
    };

    const handleDifficultyChange = (diff) => {
        setSelectedDifficulty(diff);
        setCurrentPage(1);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Hard': return 'bg-rose-100 text-rose-700 border-rose-200';
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading topics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-6">
                            <Mic className="w-8 h-8 text-indigo-600" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Practice Topics
                        </h1>
                        <p className="text-xl text-gray-600">
                            Choose a topic and start improving your communication skills with AI-powered feedback
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search and Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search topics..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    value={selectedCat}
                                    onChange={(e) => handleCatChange(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none outline-none cursor-pointer"
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
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none outline-none cursor-pointer"
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
                        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                            {searchQuery && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700 border border-indigo-100">
                                    Search: "{searchQuery}"
                                    <button onClick={() => setSearchQuery('')} className="ml-2 hover:text-indigo-900">×</button>
                                </span>
                            )}
                            {selectedCat && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700 border border-purple-100">
                                    Category: {categories.find(c => c.id === Number(selectedCat))?.name}
                                    <button onClick={() => setSelectedCat('')} className="ml-2 hover:text-purple-900">×</button>
                                </span>
                            )}
                            {selectedDifficulty && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-50 text-pink-700 border border-pink-100">
                                    Level: {selectedDifficulty}
                                    <button onClick={() => setSelectedDifficulty('')} className="ml-2 hover:text-pink-900">×</button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-6 flex items-center justify-between px-2">
                    <p className="text-gray-500 font-medium">
                        Showing <span className="text-gray-900">{displayed.length}</span> of{' '}
                        <span className="text-gray-900">{filtered.length}</span> topics
                    </p>
                </div>

                {/* Topics Grid */}
                {displayed.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No topics found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search query</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
                        {/* Custom Topic Creation Card */}
                        <Link
                            to="/topics/custom"
                            className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />

                            <div className="relative h-full p-8 flex flex-col justify-between text-white">
                                <div>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold mb-6 border border-white/20">
                                        <Sparkles size={12} className="mr-1" /> NEW FEATURE
                                    </div>
                                    <h3 className="text-3xl font-extrabold mb-4 leading-tight">
                                        Create Custom Topic
                                    </h3>
                                    <p className="text-indigo-100 text-lg leading-relaxed opacity-90">
                                        Record your own topic with speech-to-text! Your custom topics will be saved for practice.
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center font-bold text-lg group-hover:translate-x-2 transition-transform">
                                    Start Creating <ChevronRight className="ml-2" />
                                </div>
                            </div>
                        </Link>

                        {/* Regular Topics */}
                        {displayed.map(topic => (
                            <motion.div
                                key={topic.id}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden group"
                            >
                                <div className="p-8 flex-grow">
                                    <div className="flex items-start justify-between mb-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 uppercase tracking-wide">
                                            {topic.category?.name || 'General'}
                                        </span>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(topic.difficulty)}`}>
                                            {topic.difficulty}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                        {topic.title}
                                    </h3>

                                    <p className="text-gray-600 leading-relaxed line-clamp-3 mb-6">
                                        {topic.description || 'Practice your speaking skills on this topic and get instant AI feedback.'}
                                    </p>

                                    <div className="flex items-center space-x-6 text-sm font-medium text-gray-400">
                                        <div className="flex items-center">
                                            <Clock size={16} className="mr-2" />
                                            <span>2-3 min</span>
                                        </div>
                                        <div className="flex items-center">
                                            <TrendingUp size={16} className="mr-2" />
                                            <span>AI Feedback</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 pt-0">
                                    <Link
                                        to={`/record/${topic.id}`}
                                        className="block w-full py-4 rounded-xl bg-gray-50 text-gray-900 font-bold text-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300"
                                    >
                                        Start Practice
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pageCount > 1 && (
                    <div className="flex justify-center items-center space-x-3">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex space-x-2">
                            {[...Array(pageCount)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all ${i + 1 === currentPage
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                            disabled={currentPage === pageCount}
                            className="p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
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
