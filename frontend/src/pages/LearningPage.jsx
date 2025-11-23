import React from 'react';
import { BookOpen, Video, Headphones, Star, Play, Clock, ArrowRight } from 'lucide-react';

const LearningPage = () => {
    const videos = [
        {
            title: "The Art of Public Speaking",
            description: "Learn the essential techniques to captivate your audience.",
            duration: "15 mins",
            thumbnail: "https://img.youtube.com/vi/i5mYphUoC1I/maxresdefault.jpg",
            url: "https://www.youtube.com/watch?v=i5mYphUoC1I",
            category: "Public Speaking",
            color: "indigo"
        },
        {
            title: "Mastering Voice Modulation",
            description: "Discover how to vary your pitch, pace, and tone.",
            duration: "12 mins",
            thumbnail: "https://img.youtube.com/vi/9e6gq74l_1c/maxresdefault.jpg",
            url: "https://www.youtube.com/watch?v=9e6gq74l_1c",
            category: "Voice Control",
            color: "purple"
        },
        {
            title: "Body Language Secrets",
            description: "How to project confidence through non-verbal cues.",
            duration: "18 mins",
            thumbnail: "https://img.youtube.com/vi/K-6d7_Yt8r4/maxresdefault.jpg",
            url: "https://www.youtube.com/watch?v=K-6d7_Yt8r4",
            category: "Body Language",
            color: "blue"
        },
        {
            title: "Overcoming Stage Fright",
            description: "Psychological tricks to beat performance anxiety.",
            duration: "10 mins",
            thumbnail: "https://img.youtube.com/vi/tShavGuo0_E/hqdefault.jpg",
            url: "https://www.youtube.com/watch?v=tShavGuo0_E",
            category: "Confidence",
            color: "rose"
        }
    ];

    const guides = [
        {
            title: "Structuring Your Speech",
            description: "The classic frameworks for persuasive and informative speaking.",
            type: "Article",
            readTime: "5 mins",
            icon: BookOpen,
            color: "bg-amber-100 text-amber-600"
        },
        {
            title: "Vocal Warm-up Exercises",
            description: "A 5-minute routine to get your voice ready for the stage.",
            type: "Guide",
            readTime: "3 mins",
            icon: Headphones,
            color: "bg-teal-100 text-teal-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 pt-12 pb-64 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6 backdrop-blur-sm">
                                <BookOpen className="w-4 h-4 mr-2 text-yellow-300" />
                                Expert-Curated Resources
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                                Expand Your Knowledge <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">Master Your Speech</span>
                            </h1>
                            <p className="text-lg text-indigo-100 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Explore our comprehensive library of video tutorials, articles, and practical guides to become a more effective communicator.
                            </p>
                        </div>

                        <div className="flex-1 relative w-full max-w-lg lg:max-w-xl">
                            <div className="relative z-10">
                                <div className="w-48 h-48 mx-auto bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl relative">
                                    <div className="w-32 h-32 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-inner">
                                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <Play className="w-10 h-10 text-indigo-600 ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-10 -left-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                                        <Video className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">New Course</p>
                                        <p className="text-indigo-100 text-xs">Body Language Mastery</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 -right-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                                        <Star className="w-5 h-5 text-white" fill="currentColor" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">Top Rated</p>
                                        <p className="text-indigo-100 text-xs">Public Speaking 101</p>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto block">
                        <path fill="#f9fafb" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Video Tutorials</h2>
                            <p className="text-gray-500 mt-1">Watch and learn from the experts.</p>
                        </div>
                        <button className="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center">
                            View All <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {videos.map((video, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => window.open(video.url, '_blank')}>
                                <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <Play className="w-5 h-5 text-indigo-600 ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {video.duration}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-${video.color}-100 text-${video.color}-700 mb-3`}>
                                        {video.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                                        {video.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2">
                                        {video.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Expert Guides</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {guides.map((guide, index) => {
                            const IconComponent = guide.icon;
                            return (
                                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group flex items-start gap-6">
                                    <div className={`w-16 h-16 ${guide.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                                        <IconComponent className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{guide.type}</span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="text-xs text-gray-400 flex items-center"><Clock className="w-3 h-3 mr-1" /> {guide.readTime} read</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                            {guide.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {guide.description}
                                        </p>
                                        <div className="flex items-center text-indigo-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                                            Read Article <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPage;
