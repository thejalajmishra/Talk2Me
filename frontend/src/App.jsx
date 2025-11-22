import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { User, LogOut, UserCircle, ChevronDown, Menu, X } from 'lucide-react';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTopics from './pages/admin/AdminTopics';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAttempts from './pages/admin/AdminAttempts';
import AdminContacts from './pages/admin/AdminContacts';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TopicsPage from './pages/TopicsPage';
import CustomTopicPage from './pages/CustomTopicPage';

import RecordPage from './pages/RecordPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WelcomeHome from './pages/WelcomeHome';
import LearningMaterial from './pages/LearningMaterial';
import InsightsPage from './pages/InsightsPage';
import GitHubCallback from './pages/GitHubCallback';

function App() {
  const storedUser = localStorage.getItem('talk2me_user');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  // Keep useEffect for future updates if needed but remove initial load logic
  useEffect(() => {
    // No need to set user here; already initialized
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('talk2me_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('talk2me_user');
    // Redirect handled by Link or programmatic navigation if needed, 
    // but here we rely on the UI state update to show public nav
  };

  // Protected Admin Route Component
  const AdminRoute = ({ children }) => {
    if (!user || !user.is_superadmin) {
      return <Navigate to="/" replace />;
    }
    return (
      <AdminLayout user={user} onLogout={handleLogout}>
        {children}
      </AdminLayout>
    );
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        {/* Main Navigation - Only show on non-admin pages */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to={user ? "/welcome" : "/"} className="text-2xl font-bold text-indigo-600 flex-shrink-0">
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
                  <div className="relative ml-4" ref={dropdownRef}>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none transition-colors"
                    >
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${profileDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 transform origin-top-right transition-all duration-200 z-50">
                        <div className="px-4 py-3 border-b border-gray-50">
                          <p className="text-sm text-gray-500">Signed in as</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{user.username}</p>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center"
                        >
                          <UserCircle className="w-4 h-4 mr-2" />
                          Your Profile
                        </Link>

                        {user.is_superadmin && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        )}

                        <Link
                          to="/"
                          onClick={() => { handleLogout(); setProfileDropdownOpen(false); }}
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center w-full text-left"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign out
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 ml-4">
                    <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Login</Link>
                    <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg font-medium">Sign Up</Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="flex items-center px-2 mb-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500">Logged in</p>
                      </div>
                    </div>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2 px-2">Profile</Link>
                    {user.is_superadmin && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block text-indigo-600 hover:text-indigo-800 font-medium py-2 px-2">Admin</Link>
                    )}
                    <Link to="/" onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left text-red-600 hover:text-red-700 font-medium py-2 px-2">Logout</Link>
                  </div>
                ) : (
                  <div className="border-t border-gray-100 pt-3 mt-3 flex flex-col space-y-3">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center text-gray-700 hover:text-indigo-600 font-medium py-2">Login</Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>

        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/topics/custom" element={<CustomTopicPage user={user} />} />
            <Route path="/record/:topicId" element={<RecordPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
            <Route path="/auth/github/callback" element={<GitHubCallback />} />

            {/* New User Routes */}
            <Route path="/welcome" element={<WelcomeHome user={user} />} />
            <Route path="/learning" element={<LearningMaterial />} />
            <Route path="/insights" element={<InsightsPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard user={user} /></AdminRoute>} />
            <Route path="/admin/topics" element={<AdminRoute><AdminTopics user={user} /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories user={user} /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers user={user} /></AdminRoute>} />
            <Route path="/admin/attempts" element={<AdminRoute><AdminAttempts user={user} /></AdminRoute>} />
            <Route path="/admin/contacts" element={<AdminRoute><AdminContacts user={user} /></AdminRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
