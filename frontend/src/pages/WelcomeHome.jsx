import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, BarChart2, GraduationCap, ArrowRight, Zap, Flame, Star } from 'lucide-react';
import StreakCalendar from '../components/StreakCalendar';

const WelcomeHome = ({ user }) => {
    const tiles = [
        {
            title: 'Topics',
            description: 'Practice speaking on various topics.',
            icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
            link: '/topics',
            color: 'bg-indigo-100',
            hoverColor: 'hover:bg-indigo-200',
            borderColor: 'border-indigo-200',
            gradient: 'from-indigo-500 to-blue-500'
        },
        {
            title: 'Insights',
            description: 'Track your progress and analytics.',
            icon: <BarChart2 className="w-6 h-6 text-purple-600" />,
            link: '/insights',
            color: 'bg-purple-100',
            hoverColor: 'hover:bg-purple-200',
            borderColor: 'border-purple-200',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Learning Material',
            description: 'Improve your skills with curated resources.',
            icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
            link: '/learning',
            color: 'bg-emerald-100',
            hoverColor: 'hover:bg-emerald-200',
            borderColor: 'border-emerald-200',
            gradient: 'from-emerald-500 to-teal-500'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Unified Header Section */}
                    <div className="relative mb-10">
                        {/* Main Glass Card */}
                        <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-white/50 p-8 relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-100/40 via-purple-100/40 to-pink-100/40 rounded-full blur-3xl -mr-32 -mt-32" />
                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100/40 to-cyan-100/40 rounded-full blur-3xl -ml-20 -mb-20" />

                            <div className="relative z-10">
                                {/* Top Section: Greeting & Stats */}
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                                    {/* Greeting */}
                                    <div className="flex-1">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
                                            <Star className="w-3 h-3 mr-1" /> Welcome Back
                                        </div>
                                        <h1 className="text-5xl font-black text-gray-900 mb-3 tracking-tight leading-tight">
                                            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">{user?.username || 'Explorer'}</span>!
                                        </h1>
                                        <p className="text-xl text-gray-600 font-medium">Ready to master your communication skills?</p>
                                    </div>

                                    {/* Stats Group */}
                                    <div className="flex gap-4">
                                        {/* Total Learnings */}
                                        <div className="group relative bg-white rounded-2xl p-1 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                                            <div className="px-5 py-4 flex items-center gap-4">
                                                <div className="p-3 bg-amber-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                                    <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Learnings</p>
                                                    <p className="text-2xl font-black text-gray-900">24</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Fire Streak */}
                                        <div className="group relative bg-white rounded-2xl p-1 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
                                            <div className="px-5 py-4 flex items-center gap-4">
                                                <div className="p-3 bg-orange-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.1, 1] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                    >
                                                        <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                                                    </motion.div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Streak</p>
                                                    <p className="text-2xl font-black text-gray-900">12 <span className="text-sm font-bold text-gray-400">Days</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Activity History Section */}
                                <div className="flex flex-col items-center mt-8">
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Activity History</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        </div>
                                    </div>
                                    <StreakCalendar className="bg-transparent" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                        {/* Pie Chart - Difficulty Distribution */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-indigo-50 rounded-lg mr-3">
                                    <BarChart2 className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Topics by Difficulty</h3>
                                    <p className="text-sm text-gray-500">Distribution of attempted topics</p>
                                </div>
                            </div>
                            <div className="h-64 flex items-center justify-center">
                                <div className="relative">
                                    {/* Simple CSS Pie Chart */}
                                    <div className="w-48 h-48 rounded-full relative" style={{
                                        background: `conic-gradient(
                                            #10b981 0deg 144deg,
                                            #fbbf24 144deg 252deg,
                                            #ef4444 252deg 360deg
                                        )`
                                    }}>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <p className="text-3xl font-black text-gray-900">45</p>
                                                    <p className="text-xs text-gray-500 font-bold">Total</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                                        <span className="text-xs font-bold text-gray-500">Easy</span>
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">18</p>
                                    <p className="text-xs text-gray-400">40%</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <div className="w-3 h-3 rounded-full bg-amber-400 mr-2"></div>
                                        <span className="text-xs font-bold text-gray-500">Medium</span>
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">15</p>
                                    <p className="text-xs text-gray-400">30%</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                        <span className="text-xs font-bold text-gray-500">Hard</span>
                                    </div>
                                    <p className="text-2xl font-black text-gray-900">12</p>
                                    <p className="text-xs text-gray-400">30%</p>
                                </div>
                            </div>
                        </div>

                        {/* Line Chart - Weekly Progress */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-purple-50 rounded-lg mr-3">
                                    <BarChart2 className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Weekly Progress</h3>
                                    <p className="text-sm text-gray-500">Questions attempted over time</p>
                                </div>
                            </div>
                            <div className="h-64 relative">
                                {/* Y-axis labels */}
                                <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-400 font-medium">
                                    <span>20</span>
                                    <span>15</span>
                                    <span>10</span>
                                    <span>5</span>
                                    <span>0</span>
                                </div>

                                {/* Chart area */}
                                <div className="ml-10 h-full relative">
                                    {/* Grid lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="border-t border-gray-100"></div>
                                        ))}
                                    </div>

                                    {/* SVG for lines */}
                                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                                        {/* Easy line (green) */}
                                        <polyline
                                            points="0,150 100,120 200,100 300,80 400,60"
                                            fill="none"
                                            stroke="#10b981"
                                            strokeWidth="3"
                                        />
                                        {/* Medium line (yellow) */}
                                        <polyline
                                            points="0,170 100,150 200,130 300,110 400,90"
                                            fill="none"
                                            stroke="#fbbf24"
                                            strokeWidth="3"
                                        />
                                        {/* Hard line (red) */}
                                        <polyline
                                            points="0,180 100,170 200,160 300,150 400,140"
                                            fill="none"
                                            stroke="#ef4444"
                                            strokeWidth="3"
                                        />
                                    </svg>
                                </div>

                                {/* X-axis labels */}
                                <div className="ml-10 mt-2 flex justify-between text-xs text-gray-400 font-medium">
                                    <span>Week 1</span>
                                    <span>Week 2</span>
                                    <span>Week 3</span>
                                    <span>Week 4</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-6 mt-6">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                                    <span className="text-xs font-bold text-gray-500">Easy</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-amber-400 mr-2"></div>
                                    <span className="text-xs font-bold text-gray-500">Medium</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                    <span className="text-xs font-bold text-gray-500">Hard</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Grid */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-2 h-8 bg-indigo-600 rounded-full mr-3"></span>
                        Quick Access
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {tiles.map((tile, index) => (
                            <Link to={tile.link} key={index} className="block group h-full">
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`bg-white rounded-3xl p-8 transition-all duration-300 h-full border border-gray-100 hover:shadow-xl hover:shadow-indigo-100/50 relative overflow-hidden group`}
                                >
                                    {/* Hover Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                    <div className={`absolute top-0 right-0 w-40 h-40 ${tile.color} rounded-bl-[100px] -mr-10 -mt-10 opacity-20 transition-transform duration-500 group-hover:scale-110`} />

                                    <div className="relative z-10">
                                        <div className={`w-14 h-14 ${tile.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                            {tile.icon}
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                            {tile.title}
                                        </h3>
                                        <p className="text-gray-600 text-base mb-6 leading-relaxed">
                                            {tile.description}
                                        </p>

                                        <div className="flex items-center text-sm font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">
                                            Go to {tile.title} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default WelcomeHome;
