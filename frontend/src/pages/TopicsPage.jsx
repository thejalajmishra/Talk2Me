import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PAGE_SIZE = 10;

const TopicsPage = () => {
    const [topics, setTopics] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tRes, cRes] = await Promise.all([
                    axios.get('http://localhost:8000/topics'),
                    axios.get('http://localhost:8000/categories'),
                ]);
                setTopics(tRes.data);
                setCategories(cRes.data);
            } catch (e) {
                console.error('Failed to load topics/categories', e);
            }
        };
        fetchData();
    }, []);

    const filtered = selectedCat
        ? topics.filter(t => t.category?.id === Number(selectedCat))
        : topics;

    const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
    const displayed = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleCatChange = e => {
        setSelectedCat(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
                <ArrowLeft size={20} className="mr-2" /> Back
            </button>

            <div className="flex items-center space-x-4 mb-6">
                <select
                    value={selectedCat}
                    onChange={handleCatChange}
                    className="px-4 py-2 border rounded"
                >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayed.map(topic => (
                    <div key={topic.id} className="bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-lg mb-2">{topic.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                        <p className="text-xs text-gray-500">
                            Category: {topic.category?.name || 'Uncategorized'}
                        </p>
                        <Link
                            to={`/record/${topic.id}`}
                            className="inline-block mt-3 text-indigo-600 hover:underline"
                        >
                            Start Recording
                        </Link>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {pageCount > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    {[...Array(pageCount)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded ${i + 1 === currentPage ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopicsPage;
