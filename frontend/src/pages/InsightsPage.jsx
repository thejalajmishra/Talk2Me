import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Target, BarChart } from 'lucide-react';

const InsightsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    {/* Coming Soon Section */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-16 relative overflow-hidden">
                        {/* Decorative background */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-3xl -mr-20 -mt-20" />

                        <div className="relative z-10">
                            {/* Animated Icons */}
                            <div className="flex justify-center gap-8 mb-8">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                                >
                                    <BarChart className="w-16 h-16 text-indigo-400" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                                >
                                    <TrendingUp className="w-16 h-16 text-purple-400" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
                                >
                                    <Target className="w-16 h-16 text-pink-400" />
                                </motion.div>
                            </div>

                            <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
                                Insights Coming Soon
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                                We're building powerful analytics to help you track your progress and improve your communication skills.
                            </p>

                            <div className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600">
                                <Lightbulb className="w-5 h-5 mr-2" />
                                <span className="font-bold">Stay tuned for exciting updates!</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default InsightsPage;
