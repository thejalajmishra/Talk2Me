import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { showAlert } from '../utils/alert';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import SEO from '../components/SEO';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.post('http://localhost:8000/contact', formData);
            showAlert('success', 'Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            showAlert('error', 'Failed to send message. Please try again.');
            console.error('Contact form error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            <SEO
                title="Contact Us"
                description="Get in touch with the Talk2Me team. We're here to help you with any questions or feedback."
            />
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-5xl font-extrabold text-center mb-4">Get In Touch</h1>
                    <p className="text-xl text-center text-purple-100">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 p-4 rounded-full">
                                    <Mail className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Email Us</h3>
                                    <p className="text-gray-600">support@talk2me.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="bg-indigo-100 p-4 rounded-full">
                                    <Phone className="text-indigo-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Call Us</h3>
                                    <p className="text-gray-600">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="bg-pink-100 p-4 rounded-full">
                                    <MapPin className="text-pink-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Visit Us</h3>
                                    <p className="text-gray-600">123 Innovation Way<br />San Francisco, CA 94102</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Tell us what's on your mind..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    <Send size={20} />
                                    <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Back to Home Link */}
                <div className="text-center mt-12">
                    <Link
                        to="/"
                        className="inline-block text-purple-600 hover:text-purple-800 font-medium transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
