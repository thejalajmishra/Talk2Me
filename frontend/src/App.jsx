import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import WelcomePage from './pages/WelcomePage';
import InsightsPage from './pages/InsightsPage';
import LearningPage from './pages/LearningPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GitHubCallback from './pages/GitHubCallback';

function App() {
  const storedUser = localStorage.getItem('talk2me_user');
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.is_superadmin) {
      if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
        navigate('/admin');
      }
    }
  }, [user, location.pathname, navigate]);

  const handleLogin = (userData) => {
    // If updating profile, preserve the existing token if not provided in new data
    const updatedUser = {
      ...userData,
      token: userData.token || user?.token || userData.access_token
    };

    setUser(updatedUser);
    localStorage.setItem('talk2me_user', JSON.stringify(updatedUser));
    if (updatedUser.is_superadmin) {
      navigate('/admin');
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
      {showNav && <Navbar user={user} onLogout={handleLogout} />}

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
          <Route path="/welcome" element={<WelcomePage user={user} />} />
          <Route path="/insights" element={<InsightsPage user={user} />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/profile" element={<ProfilePage user={user} onUpdate={handleLogin} />} />
          <Route path="/profile/edit" element={<EditProfilePage user={user} onUpdate={handleLogin} />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
          <Route path="/auth/github/callback" element={<GitHubCallback />} />

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
