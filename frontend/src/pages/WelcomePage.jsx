import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContributionGraph from '../components/ContributionGraph';
import { ArrowRight, Activity, Award, Target, BookOpen, Quote, Sparkles } from 'lucide-react';

const WelcomePage = ({ user }) => {
    const navigate = useNavigate();

    // Fallback if user is not passed correctly (though it should be protected)
    const username = user?.username || user?.name || 'User';

    const dailyQuote = {
        text: "Speech is power: speech is to persuade, to convert, to compel.",
        author: "Ralph Waldo Emerson"
    };

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">

                {/* Header Section */}
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden text-white transform hover:scale-[1.01] transition-transform duration-500">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-sm font-medium mb-4 backdrop-blur-sm">
                                <Award className="w-4 h-4 mr-2 text-yellow-300" />
                                Ready for a new streak?
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200">{username}!</span> 👋
                            </h1>
                            <p className="text-indigo-100 text-lg md:text-xl max-w-2xl leading-relaxed">
                                Welcome back to Talk2Me. Your personal AI speech coach is ready to help you improve.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-24 h-24 bg-white/10 rounded-2xl rotate-12 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg animate-float">
                                <Activity className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Contribution Graph Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-600" />
                                    Your Activity
                                </h2>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 365 Days</span>
                            </div>
                            <div className="overflow-x-auto">
                                <ContributionGraph />
                            </div>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Start Practice */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group" onClick={() => navigate('/topics')}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                                        <Target className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Start Practice</h3>
                                <p className="text-gray-500 text-sm">Choose a topic and start recording your speech.</p>
                            </div>

                            {/* View Insights */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group" onClick={() => navigate('/insights')}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                                        <Activity className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">View Insights</h3>
                                <p className="text-gray-500 text-sm">Check your detailed analytics and improvement.</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-8">
                        {/* Daily Inspiration */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100 relative overflow-hidden">
                            <Quote className="absolute top-4 right-4 w-12 h-12 text-amber-200 opacity-50" />
                            <div className="relative z-10">
                                <h3 className="text-amber-800 font-bold mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> Daily Inspiration
                                </h3>
                                <blockquote className="text-gray-700 italic mb-4 text-lg leading-relaxed">
                                    "{dailyQuote.text}"
                                </blockquote>
                                <cite className="text-amber-600 font-medium not-italic block text-right">
                                    — {dailyQuote.author}
                                </cite>
                            </div>
                        </div>

                        {/* Learning Card (Moved to sidebar) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group" onClick={() => navigate('/learning')}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors duration-300">
                                    <BookOpen className="w-6 h-6 text-teal-600 group-hover:text-white transition-colors" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Learning Center</h3>
                            <p className="text-gray-500 text-sm mb-4">Enhance your skills with curated resources.</p>
                            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
                                <div className="bg-teal-500 h-1.5 rounded-full w-3/4"></div>
                            </div>
                            <p className="text-xs text-gray-400">3 courses in progress</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WelcomePage;
