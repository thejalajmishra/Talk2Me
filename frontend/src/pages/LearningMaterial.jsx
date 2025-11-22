import React from 'react';
import { motion } from 'framer-motion';
import { Video, BookOpen, ExternalLink, PlayCircle, Star } from 'lucide-react';

const LearningMaterial = () => {
    const resources = [
        {
            category: 'Speaking Skills',
            description: 'Master the art of verbal communication',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            items: [
                {
                    type: 'video',
                    title: 'How to Speak English Fluently',
                    description: '5 tips to improve your speaking confidence and flow.',
                    duration: '10 min',
                    link: '#',
                    thumbnail: 'bg-gradient-to-br from-blue-100 to-indigo-100',
                },
                {
                    type: 'article',
                    title: 'The Art of Small Talk',
                    description: 'Mastering casual conversation in professional settings.',
                    readTime: '5 min read',
                    link: '#',
                    thumbnail: 'bg-gradient-to-br from-blue-50 to-cyan-50',
                },
                {
                    type: 'video',
                    title: 'Pronunciation Masterclass',
                    description: 'Fix common pronunciation mistakes instantly.',
                    duration: '15 min',
                    link: '#',
                    thumbnail: 'bg-gradient-to-br from-indigo-100 to-purple-100',
                },
            ],
        },
        {
            category: 'Soft Skills',
            description: 'Essential interpersonal skills for success',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            items: [
                {
                    type: 'video',
                    title: 'Active Listening Techniques',
                    description: 'Become a better listener to become a better speaker.',
                    duration: '8 min',
                    link: '#',
                    thumbnail: 'bg-gradient-to-br from-purple-100 to-pink-100',
                },
                {
                    type: 'article',
                    title: 'Body Language Basics',
                    description: 'What your non-verbal cues are saying about you.',
                    readTime: '7 min read',
                    link: '#',
                    thumbnail: 'bg-gradient-to-br from-fuchsia-50 to-pink-50',
                },
            ],
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-12 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Learning Center</h1>
                    <p className="text-xl text-gray-600">
                        Curated resources to help you master communication and soft skills.
                    </p>
                </div>

                <div className="space-y-16">
                    {resources.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="relative">
                            <div className="flex items-center mb-8">
                                <div className={`p-3 rounded-xl ${section.bg} mr-4`}>
                                    <Star className={`w-6 h-6 ${section.color}`} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{section.category}</h2>
                                    <p className="text-gray-500">{section.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {section.items.map((item, itemIndex) => (
                                    <motion.a
                                        href={item.link}
                                        key={itemIndex}
                                        whileHover={{ y: -8 }}
                                        className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                                    >
                                        <div className={`h-52 ${item.thumbnail} flex items-center justify-center relative overflow-hidden`}>
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                                            {item.type === 'video' ? (
                                                <div className="relative z-10">
                                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                        <PlayCircle className="w-8 h-8 text-indigo-600 ml-1" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative z-10">
                                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                        <BookOpen className="w-8 h-8 text-indigo-600" />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="absolute top-4 right-4">
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${item.type === 'video'
                                                        ? 'bg-white text-red-600'
                                                        : 'bg-white text-blue-600'
                                                    }`}>
                                                    {item.type.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">
                                                {item.duration || item.readTime}
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                                                {item.type === 'video' ? 'Watch Now' : 'Read Article'}
                                                <ExternalLink className="w-4 h-4 ml-2" />
                                            </div>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default LearningMaterial;
