import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Calendar, User } from 'lucide-react';

const AdminContacts = ({ user }) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/admin/contacts', {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            setContacts(response.data);
        } catch (error) {
            console.error('Failed to fetch contacts', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading contact messages...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                <p className="text-gray-600 mt-2">View all messages from the contact form</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    All Messages ({contacts.length})
                </h2>

                {contacts.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Mail size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>No contact messages yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {contacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="border border-gray-200 rounded-lg p-6 hover:border-indigo-300 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-indigo-100 p-2 rounded-full">
                                            <User size={20} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                                            <p className="text-sm text-gray-600">{contact.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar size={16} className="mr-1" />
                                        {new Date(contact.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                {contact.subject && (
                                    <div className="mb-3">
                                        <span className="text-sm font-medium text-gray-700">Subject: </span>
                                        <span className="text-sm text-gray-900">{contact.subject}</span>
                                    </div>
                                )}

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminContacts;
