import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
        onLogout();
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-indigo-600 flex-shrink-0 flex items-center gap-2">
                        Talk2Me
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user && (
                            <Link to="/welcome" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Home</Link>
                        )}
                        <Link to="/topics" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Topics</Link>
                        <Link to="/about" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">About</Link>
                        <Link to="/contact" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Contact</Link>

                        {user ? (
                            <div className="flex items-center gap-6">
                                {/* Profile Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 focus:outline-none group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200 group-hover:bg-indigo-200 transition-colors">
                                            <User size={20} />
                                        </div>
                                        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 transform origin-top-right transition-all">
                                            <div className="px-4 py-3 border-b border-gray-50">
                                                <p className="text-sm font-medium text-gray-900 truncate">{user.username || 'User'}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>

                                            <Link
                                                to="/profile"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                            >
                                                <Settings size={16} className="mr-2" />
                                                Profile
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                                            >
                                                <LogOut size={16} className="mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-500 hover:text-indigo-600 font-medium transition-colors">Login</Link>
                                <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg font-medium">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white absolute w-full shadow-lg">
                    <div className="px-4 py-3 space-y-3">
                        {user && (
                            <Link to="/welcome" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Home</Link>
                        )}
                        <Link to="/topics" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Topics</Link>
                        <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">About</Link>
                        <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Contact</Link>
                        {user ? (
                            <>
                                <div className="border-t border-gray-100 my-2 pt-2">
                                    <div className="flex items-center gap-3 px-2 py-2 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{user.username}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center text-gray-700 hover:text-indigo-600 font-medium py-2 px-2 rounded-lg hover:bg-gray-50">
                                        <Settings size={16} className="mr-2" /> Profile
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center text-red-600 hover:text-red-700 font-medium py-2 px-2 rounded-lg hover:bg-red-50 text-left">
                                        <LogOut size={16} className="mr-2" /> Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-2 flex flex-col gap-3">
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center text-gray-700 hover:text-indigo-600 font-medium py-2 border border-gray-200 rounded-lg">Login</Link>
                                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
