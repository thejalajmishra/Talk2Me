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

  // Protected User Route Component
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
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
              <div className="hidden md:flex items-center space-x-6">
                {user && (
                  <Link to="/welcome" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Home</Link>
                )}
                <Link to="/topics" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Topics</Link>
                <Link to="/about" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">About</Link>
                <Link to="/contact" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Contact</Link>
                {user ? (
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 focus:outline-none transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="font-medium">{user.username}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5 transform opacity-100 scale-100 transition-all duration-200 origin-top-right z-50">
                        <div className="px-4 py-3 border-b border-gray-50">
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            onClick={() => setProfileOpen(false)}
                          >
                            <UserCircle className="w-4 h-4 mr-2" />
                            Your Profile
                          </Link>

                          {user.is_superadmin && (
                            <Link
                              to="/admin"
                              className="flex items-center px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition-colors"
                              onClick={() => setProfileOpen(false)}
                            >
                              <div className="w-4 h-4 mr-2 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-[10px] font-bold">A</span>
                              </div>
                              Admin Dashboard
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-gray-50 py-1">
                          <button
                            onClick={() => {
                              handleLogout();
                              setProfileOpen(false);
                            }}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Login</Link>
                    <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium">Sign Up</Link>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-3 space-y-3">
                {user && (
                  <Link to="/welcome" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Home</Link>
                )}
                <Link to="/topics" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Topics</Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">About</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Contact</Link>
                {user ? (
                  <div className="pt-4 pb-2 border-t border-gray-100">
                    <div className="flex items-center px-2 mb-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          <User className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">{user.username}</div>
                        <div className="text-sm font-medium text-gray-500">{user.email}</div>
                      </div>
                    </div>

                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-2 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md">
                      <UserCircle className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-500" />
                      Your Profile
                    </Link>

                    {user.is_superadmin && (
                      <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center px-2 py-2 text-base font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md">
                        <div className="mr-3 h-5 w-5 flex items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold">A</div>
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full flex items-center px-2 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                    >
                      <LogOut className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Login</Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center">Sign Up</Link>
                  </>
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

            {/* Protected User Routes */}
            <Route path="/welcome" element={<ProtectedRoute><WelcomeHome user={user} /></ProtectedRoute>} />
            <Route path="/learning" element={<ProtectedRoute><LearningMaterial /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />

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
