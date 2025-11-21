import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import TopicSelection from './pages/TopicSelection';
import RecordPage from './pages/RecordPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Admin Components
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTopics from './pages/admin/AdminTopics';
import AdminCategories from './pages/admin/AdminCategories';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAttempts from './pages/admin/AdminAttempts';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('talk2me_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                      Talk2Me
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link to="/leaderboard" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Leaderboard</Link>
                    {user ? (
                      <>
                        {user.is_superadmin && (
                          <Link to="/admin" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Admin</Link>
                        )}
                        <button onClick={handleLogout} className="text-gray-500 hover:text-gray-900 font-medium transition-colors">
                          Logout
                        </button>
                        <Link to="/profile" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md shadow-indigo-200">
                          Profile
                        </Link>
                      </>
                    ) : (
                      <Link to="/login" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Login</Link>
                    )}
                  </div>
                </div>
              </div>
            </nav>
          } />
        </Routes>

        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<TopicSelection />} />
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
