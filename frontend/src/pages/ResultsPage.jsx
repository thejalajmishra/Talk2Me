import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Activity, Mic, Award } from 'lucide-react';
import SEO from '../components/SEO';

const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { results, topic } = location.state || {};

    if (!results) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Go back to Topics
                    </button>
                </div>
            </div>
        );
    }

    const { score, wpm, filler_count, feedback, metrics, transcript } = results;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <SEO
                title="Analysis Results"
                description="View your speech analysis results with detailed feedback on pace, clarity, tone, and improvement suggestions."
            />
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Topics
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="bg-indigo-600 p-8 text-white text-center">
                        <h1 className="text-3xl font-bold mb-2">Analysis Complete!</h1>
                        <p className="opacity-90">Here is how you performed on "{topic?.title}"</p>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12">
                            {/* Overall Score */}
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        className="text-gray-100"
                                    />
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="88"
                                        stroke="currentColor"
                                        strokeWidth="12"
                                        fill="transparent"
                                        strokeDasharray={2 * Math.PI * 88}
                                        strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
                                        className="text-indigo-500 transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-5xl font-bold text-gray-900">{score}</span>
                                    <span className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Score</span>
                                </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 gap-6 w-full max-w-md">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <Activity size={18} />
                                        <span className="text-sm font-medium">Pace (WPM)</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">{wpm}</div>
                                    <div className="text-xs text-gray-400 mt-1">Target: 100-150</div>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <AlertCircle size={18} />
                                        <span className="text-sm font-medium">Filler Words</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">{filler_count}</div>
                                    <div className="text-xs text-gray-400 mt-1">Target: &lt; 5</div>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <Mic size={18} />
                                        <span className="text-sm font-medium">Tone</span>
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">{feedback.tone}</div>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <Award size={18} />
                                        <span className="text-sm font-medium">Clarity</span>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900">{metrics.clarity}%</div>
                                </div>
                            </div>
                        </div>

                        {/* AI Feedback */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle className="text-green-500" /> Improvement Plan
                                </h3>
                                <ul className="space-y-3">
                                    {feedback.improvement_plan.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 bg-green-50 p-4 rounded-xl text-green-800 text-sm font-medium">
                                            <span className="bg-green-200 text-green-700 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{idx + 1}</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Transcript</h3>
                                <div className="bg-gray-50 p-6 rounded-2xl text-gray-600 text-sm leading-relaxed italic border border-gray-100 h-full">
                                    "{transcript}"
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
