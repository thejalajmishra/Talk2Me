import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTopics from './pages/admin/AdminTopics';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAttempts from './pages/admin/AdminAttempts';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TopicsPage from './pages/TopicsPage';

import RecordPage from './pages/RecordPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

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

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        {/* Main Navigation - Only show on non-admin pages */}
        <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">Talk2Me</Link>
          <div className="space-x-6">
            <Link to="/topics" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Topics</Link>
            <Link to="/about" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Contact</Link>
            {user ? (
              <>
                <Link to="/profile" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Profile</Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Login</Link>
                <Link to="/signup" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Signup</Link>
              </>
            )}
            {user && user.is_superadmin && (
              <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Admin</Link>
            )}
          </div>
        </nav>
        <Routes>
          {/* Removed placeholder admin route that blocked admin pages */}
          {/* Added fallback redirect for unknown routes */}
// Removed placeholder fallback route

        </Routes>

        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/record/:topicId" element={<RecordPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard user={user} /></AdminRoute>} />
            <Route path="/admin/topics" element={<AdminRoute><AdminTopics user={user} /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories user={user} /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers user={user} /></AdminRoute>} />
            <Route path="/admin/attempts" element={<AdminRoute><AdminAttempts user={user} /></AdminRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
