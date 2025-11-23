import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Info, BookOpen, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="text-2xl font-bold text-white mb-4 inline-block">
                            Talk2Me
                        </Link>
                        <p className="text-gray-400 mb-4 max-w-md">
                            Your AI-powered communication coach. Improve your speaking skills, track your progress, and achieve your communication goals.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/topics" className="text-gray-400 hover:text-white transition-colors flex items-center">
                                    Topics
                                </Link>
                            </li>
                            <li>
                                <Link to="/leaderboard" className="text-gray-400 hover:text-white transition-colors flex items-center">
                                    Leaderboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/learning" className="text-gray-400 hover:text-white transition-colors flex items-center">
                                    <BookOpen size={16} className="mr-2" />
                                    Learning
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                                    <Info size={16} className="mr-2" />
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                                    <Mail size={16} className="mr-2" />
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Talk2Me. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
