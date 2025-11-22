import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 flex flex-col items-center justify-center text-white p-8">
        <h1 className="text-5xl font-extrabold mb-6 text-center drop-shadow-lg">
            Welcome to Talk2Me
        </h1>
        <p className="text-xl max-w-2xl text-center mb-8">
            AI‑powered communication coaching. Record, analyze, and improve your speaking skills.
        </p>
        <div className="flex space-x-4">
            <Link
                to="/topics"
                className="bg-white text-indigo-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
                Browse Topics
            </Link>
            <Link
                to="/about"
                className="bg-white text-indigo-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
                About Us
            </Link>
            <Link
                to="/contact"
                className="bg-white text-indigo-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
                Contact
            </Link>
        </div>
    </div>
);

export default HomePage;
