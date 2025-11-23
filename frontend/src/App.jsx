import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { User, ChevronDown } from 'lucide-react';
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
import EditProfilePage from './pages/EditProfilePage';
import InsightsPage from './pages/InsightsPage';
import LearningPage from './pages/LearningPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GitHubCallback from './pages/GitHubCallback';
import OnboardingPage from './pages/OnboardingPage';
import { getAvatarPath } from './utils/avatars';

function App() {
  const storedUser = localStorage.getItem('talk2me_user');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (user?.is_superadmin) {
      if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
        navigate('/admin');
      }
    }
  }, [user, location.pathname, navigate]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('talk2me_user', JSON.stringify(userData));
    if (userData.is_superadmin) {
      navigate('/admin');
    } else if (!userData.onboarding_completed) {
      navigate('/onboarding');
    } else {
      navigate('/topics');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('talk2me_user');
    navigate('/');
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

  const showNav = !user?.is_superadmin;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Main Navigation - Only show on non-admin pages */}
      {showNav && (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="text-2xl font-bold text-indigo-600 flex-shrink-0">
                Talk2Me
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/topics" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Topics</Link>
                <Link to="/learning" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Learning</Link>
                <Link to="/about" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">About</Link>
                <Link to="/contact" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Contact</Link>
                {user ? (
                  <>
                    <Link to="/insights" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Insights</Link>

                    {/* Profile Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-gray-900 font-medium transition-colors p-1 rounded-lg hover:bg-gray-100"
                      >
                        <img
                          src={getAvatarPath(user.profile_picture || 'avatar1')}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                        />
                        <ChevronDown size={16} className={`transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {profileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() => { handleLogout(); setProfileDropdownOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </>
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
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-3 space-y-3">
                <Link to="/topics" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Topics</Link>
                <Link to="/learning" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Learning</Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">About</Link>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Contact</Link>
                {user ? (
                  <>
                    <Link to="/insights" onClick={() => setMobileMenuOpen(false)} className="block text-gray-700 hover:text-indigo-600 font-medium py-2">Insights</Link>

                    {/* Mobile Profile Section */}
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex items-center px-2 py-2 text-gray-700 font-medium">
                        <User size={18} className="mr-2" />
                        <span>{user.username}</span>
                      </div>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block pl-8 py-2 text-gray-600 hover:text-indigo-600">Profile</Link>
                      <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="block w-full text-left pl-8 py-2 text-gray-600 hover:text-indigo-600">Logout</button>
                    </div>
                  </>
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
      )}

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/topics" element={<TopicsPage user={user} />} />
          <Route path="/topics/custom" element={<CustomTopicPage user={user} />} />
          <Route path="/record/:topicId" element={<RecordPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/insights" element={<InsightsPage user={user} />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/profile" element={<ProfilePage user={user} onUpdate={handleLogin} />} />
          <Route path="/profile/edit" element={<EditProfilePage user={user} onUpdate={handleLogin} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
          <Route path="/auth/github/callback" element={<GitHubCallback />} />
          <Route path="/onboarding" element={<OnboardingPage onLogin={handleLogin} />} />

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
  );
}

export default App;
