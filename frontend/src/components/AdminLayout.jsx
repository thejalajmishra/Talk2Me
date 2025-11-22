import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, FolderOpen, Users, Mic, Home, LogOut, Mail, Menu, X } from 'lucide-react';

const AdminLayout = ({ children, user, onLogout }) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { path: '/admin', icon: LayoutGrid, label: 'Dashboard', exact: true },
        { path: '/admin/topics', icon: LayoutGrid, label: 'Topics' },
        { path: '/admin/categories', icon: FolderOpen, label: 'Categories' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/attempts', icon: Mic, label: 'Voice Analysis' },
        { path: '/admin/contacts', icon: Mail, label: 'Contact Messages' },
    ];

    const isActive = (path, exact = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <h1 className="text-xl font-bold text-indigo-600">Talk2Me Admin</h1>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed h-full flex flex-col">
                    {/* Logo/Brand */}
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-indigo-600">Talk2Me</h1>
                        <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path, item.exact);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${active
                                            ? 'bg-indigo-50 text-indigo-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Info & Actions */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <Link
                            to="/"
                            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full mb-1"
                        >
                            <Home size={18} />
                            <span className="text-sm">Back to Home</span>
                        </Link>
                        <button
                            onClick={onLogout}
                            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                        >
                            <LogOut size={18} />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="lg:hidden fixed inset-0 z-40">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-gray-600 bg-opacity-75"
                            onClick={closeSidebar}
                        ></div>

                        {/* Sidebar */}
                        <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col">
                            {/* Logo/Brand */}
                            <div className="p-6 border-b border-gray-200">
                                <h1 className="text-2xl font-bold text-indigo-600">Talk2Me</h1>
                                <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path, item.exact);

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={closeSidebar}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${active
                                                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <Icon size={20} />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* User Info & Actions */}
                            <div className="p-4 border-t border-gray-200">
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <Link
                                    to="/"
                                    onClick={closeSidebar}
                                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full mb-1"
                                >
                                    <Home size={18} />
                                    <span className="text-sm">Back to Home</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        onLogout();
                                        closeSidebar();
                                    }}
                                    className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                                >
                                    <LogOut size={18} />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </div>
                        </aside>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 w-full">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
