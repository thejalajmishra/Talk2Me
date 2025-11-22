import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-8">
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">About Talk2Me</h1>
            <p className="text-lg text-gray-700 mb-4">
                Talk2Me is an AI‑powered communication coach that helps you improve your speaking skills.
                Record a short speech, get instant feedback on pace, filler words, and confidence, and track your progress
                on a personalized dashboard.
            </p>
            <p className="text-lg text-gray-700 mb-4">
                Our mission is to make effective communication accessible to everyone, whether you are preparing for a presentation,
                learning a new language, or just want to sound more confident in everyday conversations.
            </p>
            <div className="text-center mt-8">
                <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                    Back to Home
                </Link>
            </div>
        </div>
    </div>
);

export default AboutUs;
