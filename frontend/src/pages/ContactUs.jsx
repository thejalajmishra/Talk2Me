import React from 'react';
import { Link } from 'react-router-dom';

const ContactUs = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-8">
        <div className="max-w-2xl bg-white rounded-xl shadow-lg p-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Contact Us</h1>
            <p className="text-lg text-gray-700 mb-4">
                We'd love to hear from you! Whether you have feedback, questions, or partnership ideas, feel free to reach out.
            </p>
            <ul className="text-lg text-gray-700 space-y-2">
                <li><strong>Email:</strong> support@talk2me.com</li>
                <li><strong>Phone:</strong> +1 (555) 123‑4567</li>
                <li><strong>Address:</strong> 123 Innovation Way, San Francisco, CA</li>
            </ul>
            <div className="text-center mt-8">
                <Link to="/" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                    Back to Home
                </Link>
            </div>
        </div>
    </div>
);

export default ContactUs;
