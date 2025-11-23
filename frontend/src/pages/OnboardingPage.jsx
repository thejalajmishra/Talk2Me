import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Check } from 'lucide-react';

const OnboardingPage = ({ onLogin }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        motivation: '',
        proficiency: '',
        dailyGoal: '',
        interests: []
    });

    const totalSteps = 4;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('talk2me_user'))?.token;
            if (!token) {
                navigate('/login');
                return;
            }

            // Submit onboarding data
            await axios.post('http://localhost:8000/users/onboarding', {
                onboarding_data: formData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Fetch updated user data from backend
            const userResponse = await axios.get('http://localhost:8000/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Get original user data to preserve some fields
            const userStr = localStorage.getItem('talk2me_user');
            const originalUser = userStr ? JSON.parse(userStr) : {};

            // Create complete user data including onboarding_data
            const fullUserData = {
                ...userResponse.data, // This includes onboarding_data from backend
                token: token,
                joinedDate: originalUser.joinedDate || new Date().toISOString().split('T')[0],
                totalSpeeches: originalUser.totalSpeeches || 0,
                averageScore: originalUser.averageScore || "N/A",
                recentActivity: originalUser.recentActivity || [],
                onboarding_data: formData // Explicitly add onboarding_data
            };

            onLogin(fullUserData); // Update App.jsx state and localStorage

            navigate('/topics');
        } catch (error) {
            console.error("Onboarding submission failed", error);
        }
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleInterest = (interest) => {
        setFormData(prev => {
            const interests = prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest];
            return { ...prev, interests };
        });
    };

    const isStepValid = () => {
        switch (step) {
            case 1: return !!formData.motivation;
            case 2: return !!formData.proficiency;
            case 3: return !!formData.dailyGoal;
            case 4: return formData.interests.length > 0;
            default: return false;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Step {step} of {totalSteps}</span>
                        <span className="text-sm font-medium text-indigo-600">{Math.round((step / totalSteps) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6">
                    {step === 1 && (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">Why are you learning public speaking?</h1>
                            <p className="text-gray-500 text-center mb-8">Help us personalize your experience</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['Career Advancement', 'Travel & Culture', 'School / University', 'Personal Growth', 'Social Confidence', 'Other'].map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => updateFormData('motivation', option)}
                                        className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between hover:shadow-md ${formData.motivation === option
                                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                            : 'border-gray-200 hover:border-indigo-200'
                                            }`}
                                    >
                                        <span className="font-semibold text-gray-700">{option}</span>
                                        {formData.motivation === option && <Check className="text-indigo-600" size={20} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">What's your current skill level?</h1>
                            <p className="text-gray-500 text-center mb-8">Be honest - we'll tailor content to your level</p>
                            <div className="space-y-4">
                                {[
                                    { label: 'Beginner', desc: 'I struggle to find words and organize thoughts' },
                                    { label: 'Intermediate', desc: 'I can speak but want more confidence' },
                                    { label: 'Advanced', desc: 'I am fluent but want to polish my style' },
                                    { label: 'Expert', desc: 'I want to master advanced techniques' }
                                ].map((option) => (
                                    <button
                                        key={option.label}
                                        onClick={() => updateFormData('proficiency', option.label)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between hover:shadow-md ${formData.proficiency === option.label
                                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                            : 'border-gray-200 hover:border-indigo-200'
                                            }`}
                                    >
                                        <div>
                                            <div className="font-bold text-gray-800">{option.label}</div>
                                            <div className="text-sm text-gray-500">{option.desc}</div>
                                        </div>
                                        {formData.proficiency === option.label && <Check className="text-indigo-600" size={20} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">What's your daily goal?</h1>
                            <p className="text-gray-500 text-center mb-8">Consistency is key to improvement</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: 'Casual', time: '5 min/day', desc: 'Light practice' },
                                    { label: 'Regular', time: '10 min/day', desc: 'Steady progress' },
                                    { label: 'Serious', time: '20 min/day', desc: 'Fast improvement' }
                                ].map((option) => (
                                    <button
                                        key={option.label}
                                        onClick={() => updateFormData('dailyGoal', option.label)}
                                        className={`p-6 rounded-xl border-2 text-center transition-all hover:shadow-md ${formData.dailyGoal === option.label
                                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                            : 'border-gray-200 hover:border-indigo-200'
                                            }`}
                                    >
                                        <div className="font-bold text-lg text-gray-800 mb-1">{option.label}</div>
                                        <div className="text-indigo-600 font-semibold mb-1">{option.time}</div>
                                        <div className="text-sm text-gray-500">{option.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">What topics interest you?</h1>
                            <p className="text-gray-500 text-center mb-8">Select all that apply - we'll suggest relevant topics</p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {['Technology', 'Business', 'Science', 'Arts', 'Politics', 'Health', 'Education', 'Entertainment', 'Sports', 'History'].map((interest) => (
                                    <button
                                        key={interest}
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-5 py-3 rounded-full border-2 transition-all font-medium hover:shadow-md ${formData.interests.includes(interest)
                                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md'
                                            : 'border-gray-200 text-gray-600 hover:border-indigo-200'
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex justify-center">
                    <button
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        className={`w-full md:w-auto px-12 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${isStepValid()
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {step === totalSteps ? 'Complete Setup' : 'Continue'}
                        <ArrowRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
