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
            color: 'bg-indigo-50',
            hoverColor: 'hover:bg-indigo-100',
            borderColor: 'border-indigo-100',
        },
        {
            title: 'Insights',
            description: 'Track your progress and analytics.',
            icon: <BarChart2 className="w-6 h-6 text-purple-600" />,
            link: '/insights',
            color: 'bg-purple-50',
            hoverColor: 'hover:bg-purple-100',
            borderColor: 'border-purple-100',
        },
        {
            title: 'Learning Material',
            description: 'Improve your skills with curated resources.',
            icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
            link: '/learning',
            color: 'bg-emerald-50',
            hoverColor: 'hover:bg-emerald-100',
            borderColor: 'border-emerald-100',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Unified Header Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-10 relative overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-full opacity-50 -mr-10 -mt-10" />

                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        {/* Greeting */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{user?.username || 'Explorer'}</span>! 👋
                            </h1>
                            <p className="text-lg text-gray-600">Ready to improve your communication skills today?</p>
                        </div>

                        {/* Stats Group */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Total Learnings */}
                            <div className="flex items-center bg-white/80 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-sm border border-gray-100">
                                <div className="p-3 bg-amber-50 rounded-xl mr-4">
                                    <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Learnings</p>
                                    <p className="text-2xl font-extrabold text-gray-900">24</p>
                                </div>
                            </div>

                            {/* Fire Streak */}
                            <div className="flex items-center bg-white/80 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-sm border border-gray-100">
                                <div className="p-3 bg-orange-50 rounded-xl mr-4">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                                    </motion.div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Daily Streak</p>
                                    <p className="text-2xl font-extrabold text-gray-900">12 Days</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compact Streak Calendar Integration */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <div className="flex items-center mb-4">
                            <Star className="w-4 h-4 text-indigo-400 mr-2" />
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Activity History</span>
                        </div>
                        <StreakCalendar className="bg-gray-50/50 border border-gray-100" />
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
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`bg-white rounded-3xl p-8 transition-all duration-300 h-full border border-gray-100 hover:shadow-xl hover:shadow-indigo-100/50 relative overflow-hidden group`}
                            >
                                <div className={`absolute top-0 right-0 w-40 h-40 ${tile.color} rounded-bl-[100px] -mr-10 -mt-10 opacity-30 transition-transform duration-500 group-hover:scale-110`} />

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
    );
};

export default WelcomeHome;
