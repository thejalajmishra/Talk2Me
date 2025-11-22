import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, FileText, ExternalLink } from 'lucide-react';

const LearningMaterial = () => {
    const resources = [
        {
            category: 'Speaking Skills',
            description: 'Master the art of verbal communication',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            items: [
                {
                    title: 'Public Speaking Fundamentals',
                    description: 'Learn the basics of effective public speaking and overcome stage fright.',
                    type: 'video',
                    thumbnail: 'bg-gradient-to-br from-indigo-400 to-blue-500'
                },
                {
                    title: 'Voice Modulation Techniques',
                    description: 'Master the art of using your voice to engage and captivate your audience.',
                    type: 'article',
                    thumbnail: 'bg-gradient-to-br from-purple-400 to-pink-500'
                },
                {
                    title: 'Storytelling for Impact',
                    description: 'Learn how to craft and deliver compelling stories that resonate.',
                    type: 'video',
                    thumbnail: 'bg-gradient-to-br from-blue-400 to-cyan-500'
                }
            ]
        },
        {
            category: 'Soft Skills',
            description: 'Develop essential interpersonal abilities',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            items: [
                {
                    title: 'Active Listening',
                    description: 'Improve your ability to truly hear and understand others.',
                    type: 'article',
                    thumbnail: 'bg-gradient-to-br from-emerald-400 to-teal-500'
                },
                {
                    title: 'Emotional Intelligence',
                    description: 'Develop awareness and control of your emotions in communication.',
                    type: 'video',
                    thumbnail: 'bg-gradient-to-br from-orange-400 to-red-500'
                },
                {
                    title: 'Conflict Resolution',
                    description: 'Learn strategies to navigate and resolve disagreements effectively.',
                    type: 'article',
                    thumbnail: 'bg-gradient-to-br from-pink-400 to-rose-500'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                            Learning Materials
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Curated resources to enhance your communication skills
                        </p>
                    </div>

                    {/* Resource Sections */}
                    <div className="space-y-12">
                        {resources.map((section, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/50 p-8"
                            >
                                {/* Section Header */}
                                <div className="flex items-center mb-6">
                                    <div className={`p-3 ${section.bg} rounded-xl mr-4`}>
                                        <BookOpen className={`w-6 h-6 ${section.color}`} />
                                    </div>
                                    <div>
                                        <h2 className={`text-2xl font-bold ${section.color}`}>
                                            {section.category}
                                        </h2>
                                        <p className="text-gray-600">{section.description}</p>
                                    </div>
                                </div>

                                {/* Resource Cards */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    {section.items.map((item, itemIdx) => (
                                        <motion.div
                                            key={itemIdx}
                                            whileHover={{ y: -4 }}
                                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
                                        >
                                            {/* Thumbnail */}
                                            <div className={`h-40 ${item.thumbnail} relative flex items-center justify-center`}>
                                                {item.type === 'video' ? (
                                                    <Video className="w-12 h-12 text-white opacity-80" />
                                                ) : (
                                                    <FileText className="w-12 h-12 text-white opacity-80" />
                                                )}
                                                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-700">
                                                    {item.type}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {item.description}
                                                </p>
                                                <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                                    Learn More <ExternalLink className="w-4 h-4 ml-1" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LearningMaterial;
