import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Activity, Lock } from 'lucide-react';

const InsightsPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-50">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-100 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-100 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <div className="flex justify-center mb-8 space-x-4">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center shadow-sm"
                        >
                            <BarChart2 className="w-8 h-8 text-purple-600" />
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                            className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center shadow-sm mt-4"
                        >
                            <TrendingUp className="w-8 h-8 text-indigo-600" />
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                            className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center shadow-sm"
                        >
                            <Activity className="w-8 h-8 text-pink-600" />
                        </motion.div>
                    </div>

                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        Advanced Insights <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                            Coming Soon
                        </span>
                    </h1>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        We're building a powerful analytics dashboard to help you visualize your progress,
                        track your speaking patterns, and identify areas for improvement.
                    </p>

                    <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-500">
                        <Lock className="w-4 h-4 mr-2" />
                        Feature in Development
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default InsightsPage;
