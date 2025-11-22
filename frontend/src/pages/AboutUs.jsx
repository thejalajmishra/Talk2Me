import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Zap, Award } from 'lucide-react';

const AboutUs = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl font-extrabold text-center mb-6">About Talk2Me</h1>
                <p className="text-xl text-center text-indigo-100 max-w-3xl mx-auto">
                    Empowering everyone to communicate with confidence through AI-powered speech coaching
                </p>
            </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Our Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                    At Talk2Me, we believe that effective communication is a skill that can be learned and mastered.
                    Our AI-powered platform provides instant, personalized feedback on your speaking skills, helping you
                    improve your pace, reduce filler words, and build confidence in every conversation. Whether you're
                    preparing for a presentation, learning a new language, or simply want to sound more articulate,
                    we're here to help you achieve your goals.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
                    <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                        <Target className="text-indigo-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Targeted Feedback</h3>
                    <p className="text-gray-600">
                        Get precise insights on your speaking pace, filler words, and overall clarity with AI analysis.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                        <Zap className="text-purple-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Results</h3>
                    <p className="text-gray-600">
                        Receive immediate feedback after each recording, so you can iterate and improve quickly.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
                    <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                        <Users className="text-pink-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Community Driven</h3>
                    <p className="text-gray-600">
                        Compare your progress with others on the leaderboard and stay motivated to improve.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                        <Award className="text-green-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
                    <p className="text-gray-600">
                        Monitor your improvement over time with detailed analytics and personalized recommendations.
                    </p>
                </div>
            </div>

            {/* Story Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-xl p-12 text-white mb-16">
                <h2 className="text-4xl font-bold mb-6 text-center">Our Story</h2>
                <p className="text-lg leading-relaxed max-w-4xl mx-auto text-center">
                    Talk2Me was born from a simple observation: many people struggle with public speaking and
                    everyday communication, not because they lack ideas, but because they lack confidence and
                    awareness of their speaking habits. We set out to create a tool that democratizes access to
                    professional speech coaching, making it available to anyone, anywhere, at any time. Using
                    cutting-edge AI technology, we've built a platform that provides the kind of detailed,
                    actionable feedback that was once only available through expensive one-on-one coaching sessions.
                </p>
            </div>

            {/* CTA Section */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Improve Your Communication?</h2>
                <div className="flex justify-center space-x-4">
                    <Link
                        to="/topics"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
                    >
                        Start Practicing
                    </Link>
                    <Link
                        to="/contact"
                        className="bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-lg hover:bg-indigo-50 transition-all font-medium shadow-lg"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

export default AboutUs;
