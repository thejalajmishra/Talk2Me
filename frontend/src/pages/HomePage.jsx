import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Zap, TrendingUp, Award, Users, Target, ArrowRight, Play, CheckCircle, Star, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const HomePage = () => {
    const [stats, setStats] = useState({ users: 0, sessions: 0, improvement: 0 });

    useEffect(() => {
        // Animate stats on load
        const animateValue = (key, end, duration) => {
            let start = 0;
            const increment = end / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setStats(prev => ({ ...prev, [key]: end }));
                    clearInterval(timer);
                } else {
                    setStats(prev => ({ ...prev, [key]: Math.floor(start) }));
                }
            }, 16);
        };

        animateValue('users', 1250, 2000);
        animateValue('sessions', 5420, 2000);
        animateValue('improvement', 89, 2000);
    }, []);

    const features = [
        {
            icon: Mic,
            title: 'AI-Powered Analysis',
            description: 'Get instant feedback on your speaking pace, filler words, and clarity with advanced AI technology.',
            color: 'from-indigo-500 to-purple-500'
        },
        {
            icon: Zap,
            title: 'Real-Time Feedback',
            description: 'Receive immediate insights after each recording to iterate and improve your communication skills quickly.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: TrendingUp,
            title: 'Track Your Progress',
            description: 'Monitor your improvement over time with detailed analytics and personalized recommendations.',
            color: 'from-pink-500 to-red-500'
        },
        {
            icon: Award,
            title: 'Gamified Learning',
            description: 'Compete on leaderboards, earn achievements, and stay motivated on your journey to better communication.',
            color: 'from-orange-500 to-yellow-500'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Marketing Manager',
            image: '👩‍💼',
            rating: 5,
            text: 'Talk2Me helped me reduce my filler words by 70% in just two weeks. My presentations are now much more confident!'
        },
        {
            name: 'Michael Chen',
            role: 'Software Engineer',
            image: '👨‍💻',
            rating: 5,
            text: 'The AI feedback is incredibly accurate. It\'s like having a personal speech coach available 24/7.'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Student',
            image: '👩‍🎓',
            rating: 5,
            text: 'As an international student, this tool helped me improve my English speaking skills tremendously. Highly recommend!'
        }
    ];

    const benefits = [
        'Instant AI-powered speech analysis',
        'Personalized improvement plans',
        'Track progress over time',
        'Practice with diverse topics',
        'Compete on global leaderboards',
        'Access from anywhere, anytime'
    ];

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Home"
                description="Master public speaking with AI-powered feedback. Practice anytime, anywhere and improve your communication skills."
            />
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Text Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                                <Zap size={16} className="mr-2" />
                                AI-Powered Speech Coaching
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                                Master the Art of
                                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
                                    Confident Speaking
                                </span>
                            </h1>

                            <p className="text-xl text-indigo-100 mb-8 max-w-2xl">
                                Transform your communication skills with AI-powered feedback. Practice speaking, get instant analysis, and track your progress—all in one platform.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link
                                    to="/topics"
                                    className="group inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                                >
                                    Start Practicing Free
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                                </Link>

                                <Link
                                    to="/about"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                                >
                                    <Play size={20} className="mr-2" />
                                    Learn More
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start text-sm">
                                <div className="flex items-center">
                                    <CheckCircle size={20} className="mr-2 text-green-300" />
                                    <span>No credit card required</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle size={20} className="mr-2 text-green-300" />
                                    <span>Free forever plan</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Visual Element */}
                        <div className="relative hidden lg:block">
                            <div className="relative">
                                {/* Floating Cards Animation */}
                                <div className="absolute top-0 right-0 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl animate-float">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-400 rounded-full p-3">
                                            <CheckCircle size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Great Progress!</p>
                                            <p className="text-sm text-indigo-100">WPM improved by 15%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl animate-float-delay">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-yellow-400 rounded-full p-3">
                                            <Star size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">Achievement Unlocked!</p>
                                            <p className="text-sm text-indigo-100">10 sessions completed</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Center Microphone Icon */}
                                <div className="flex items-center justify-center">
                                    <div className="bg-white/20 backdrop-blur-xl rounded-full p-16 shadow-2xl">
                                        <Mic size={120} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-8">
                            <div className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                                {stats.users.toLocaleString()}+
                            </div>
                            <p className="text-gray-600 font-medium">Active Users</p>
                        </div>
                        <div className="p-8">
                            <div className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                                {stats.sessions.toLocaleString()}+
                            </div>
                            <p className="text-gray-600 font-medium">Practice Sessions</p>
                        </div>
                        <div className="p-8">
                            <div className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-red-600 mb-2">
                                {stats.improvement}%
                            </div>
                            <p className="text-gray-600 font-medium">Average Improvement</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                            Everything You Need to Improve
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to help you become a more confident and effective communicator
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={32} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { step: '01', title: 'Choose a Topic', desc: 'Select from our diverse library of speaking topics', icon: Target },
                            { step: '02', title: 'Record Your Speech', desc: 'Speak naturally for 2-3 minutes on your chosen topic', icon: Mic },
                            { step: '03', title: 'Get AI Feedback', desc: 'Receive instant analysis and personalized improvement tips', icon: TrendingUp }
                        ].map((item, index) => (
                            <div key={index} className="relative text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-2xl font-bold mb-6 shadow-lg">
                                    {item.step}
                                </div>
                                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-6">
                                    <item.icon size={32} className="text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-10 left-full w-full">
                                        <ArrowRight className="text-indigo-300 mx-auto" size={32} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Custom Topic Feature Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-900"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50"></div>

                {/* Animated background shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
                    <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-float-delay"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                                <div className="relative bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="bg-purple-500/20 p-3 rounded-lg">
                                            <Mic className="text-purple-400" size={24} />
                                        </div>
                                        <div className="h-2 flex-1 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-2/3 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-gray-700/50 rounded-lg p-4">
                                            <p className="text-gray-300 text-sm mb-2">AI Analysis Result</p>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <span className="text-3xl font-bold text-white">92</span>
                                                    <span className="text-gray-400 text-sm ml-1">/ 100</span>
                                                </div>
                                                <div className="text-green-400 text-sm flex items-center">
                                                    <TrendingUp size={16} className="mr-1" />
                                                    Excellent Pace
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-700/30 rounded-lg p-3">
                                                <p className="text-gray-400 text-xs">Clarity</p>
                                                <p className="text-white font-semibold">High</p>
                                            </div>
                                            <div className="bg-gray-700/30 rounded-lg p-3">
                                                <p className="text-gray-400 text-xs">Filler Words</p>
                                                <p className="text-white font-semibold">Minimal</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating badge */}
                                <div className="absolute -top-6 -right-6 bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-xl flex items-center animate-bounce">
                                    <Sparkles className="text-yellow-500 mr-2" size={20} />
                                    New Feature
                                </div>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 text-center lg:text-left">
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
                                Practice With <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                    Any Topic You Want
                                </span>
                            </h2>
                            <p className="text-xl text-gray-300 mb-8">
                                Don't see a topic that fits your needs? Create your own custom topic! Our AI adapts to any subject matter to give you relevant, contextual feedback instantly.
                            </p>

                            <ul className="space-y-4 mb-10 text-left inline-block">
                                {[
                                    'Create custom scenarios for job interviews',
                                    'Practice specific presentation decks',
                                    'Rehearse difficult conversations',
                                    'Get tailored feedback for your specific context'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-gray-300">
                                        <div className="bg-purple-500/20 rounded-full p-1 mr-3">
                                            <CheckCircle size={16} className="text-purple-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div>
                                <Link
                                    to="/topics/custom"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300"
                                >
                                    Try Custom Topics
                                    <ArrowRight className="ml-2" size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl font-extrabold mb-6">
                                Why Choose Talk2Me?
                            </h2>
                            <p className="text-xl text-indigo-100 mb-8">
                                Join thousands of users who have transformed their communication skills with our platform
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle size={24} className="text-green-300 flex-shrink-0" />
                                        <span className="text-indigo-100">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                            <div className="space-y-6">
                                {testimonials.slice(0, 2).map((testimonial, index) => (
                                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="text-4xl mr-4">{testimonial.image}</div>
                                            <div>
                                                <p className="font-semibold">{testimonial.name}</p>
                                                <p className="text-sm text-indigo-200">{testimonial.role}</p>
                                            </div>
                                            <div className="ml-auto flex">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star key={i} size={16} className="text-yellow-300 fill-current" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-indigo-100 text-sm">{testimonial.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
                            Loved by Users Worldwide
                        </h2>
                        <p className="text-xl text-gray-600">
                            See what our community has to say
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={20} className="text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                                <div className="flex items-center">
                                    <div className="text-4xl mr-4">{testimonial.image}</div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">
                        Ready to Transform Your Communication?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Join thousands of users improving their speaking skills every day
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2" size={20} />
                        </Link>
                        <Link
                            to="/topics"
                            className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                        >
                            Browse Topics
                        </Link>
                    </div>
                </div>
            </section>

            {/* Add custom animations */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
        </div>
    );
};

export default HomePage;
