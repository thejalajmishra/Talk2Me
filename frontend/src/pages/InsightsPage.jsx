import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Flame, ChevronLeft, ChevronRight, Lock, Award, Trophy, Star, Zap, Target, Crown } from 'lucide-react';
import SEO from '../components/SEO';
import API_URL from '../config/api';

const iconMap = {
    'Award': Award,
    'Trophy': Trophy,
    'Star': Star,
    'Flame': Flame,
    'Zap': Zap,
    'Target': Target,
    'Crown': Crown
};

const InsightsPage = ({ user }) => {
    const navigate = useNavigate();
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [streakData, setStreakData] = useState({ current: 0, longest: 0, activeDays: new Set() });
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        if (user?.token) {
            fetchData();
        } else {
            setLoading(false);
        }

        // Refresh data when page becomes visible (e.g., navigating back from results)
        const handleVisibilityChange = () => {
            if (!document.hidden && user?.token) {
                fetchData();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [user]);

    const fetchData = async () => {
        try {
            // Fetch attempts and achievements in parallel
            const [attemptsResponse, achievementsResponse] = await Promise.all([
                axios.get('http://localhost:8000/users/me/attempts', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                }),
                axios.get('http://localhost:8000/users/me/achievements', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                })
            ]);

            const attemptsData = attemptsResponse.data;
            const achievementsData = achievementsResponse.data;

            setAttempts(attemptsData);
            const streaks = calculateStreaks(attemptsData);
            setStreakData(streaks); // Set streak data here after calculation

            // Calculate user stats for progress
            const stats = calculateUserStats(attemptsData, streaks);

            // Map achievements from backend with progress calculation
            const mappedAchievements = achievementsData.map(ach => {
                let progress = ach.unlocked ? 100 : 0;

                // Calculate progress for locked achievements
                if (!ach.unlocked && ach.unlock_condition) {
                    const condition = ach.unlock_condition;

                    if (condition.type === 'total_attempts') {
                        progress = Math.min((stats.totalAttempts / condition.threshold) * 100, 100);
                    } else if (condition.type === 'streak') {
                        progress = Math.min((stats.longestStreak / condition.threshold) * 100, 100);
                    } else if (condition.type === 'difficulty_count') {
                        const count = stats[`${condition.difficulty}Count`] || 0;
                        progress = Math.min((count / condition.threshold) * 100, 100);
                    }
                }

                return {
                    id: ach.key,
                    title: ach.title,
                    description: ach.description,
                    icon: iconMap[ach.icon_name] || Trophy,
                    unlocked: ach.unlocked,
                    progress: Math.round(progress),
                    gradient: ach.gradient,
                    unlocked_at: ach.unlocked_at
                };
            });

            setAchievements(mappedAchievements);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch data", error);
            const emptyStreaks = { current: 0, longest: 0, activeDays: new Set() };
            setStreakData(emptyStreaks);
            setAchievements([]); // Set empty array so UI doesn't break
            setLoading(false);
        }
    };

    const calculateUserStats = (attemptsData, streaks) => {
        const easyCount = attemptsData.filter(a => a.topic?.difficulty?.toLowerCase() === 'easy').length;
        const mediumCount = attemptsData.filter(a => a.topic?.difficulty?.toLowerCase() === 'medium').length;
        const hardCount = attemptsData.filter(a => a.topic?.difficulty?.toLowerCase() === 'hard').length;

        return {
            totalAttempts: attemptsData.length,
            easyCount,
            mediumCount,
            hardCount,
            currentStreak: streaks.current,
            longestStreak: streaks.longest
        };
    };

    const calculateStreaks = (data) => {
        if (!data.length) {
            const emptyStreaks = { current: 0, longest: 0, activeDays: new Set() };
            return emptyStreaks;
        }

        const sortedDates = data
            .map(a => new Date(a.created_at).setHours(0, 0, 0, 0))
            .sort((a, b) => a - b);

        const uniqueDates = [...new Set(sortedDates)];
        const activeDaysSet = new Set(uniqueDates.map(d => new Date(d).toDateString()));

        let current = 0;
        let longest = 0;

        // Check current streak (working backwards from today)
        const today = new Date().setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (activeDaysSet.has(new Date(today).toDateString())) {
            current = 1;
            let checkDate = new Date(today);
            while (true) {
                checkDate.setDate(checkDate.getDate() - 1);
                if (activeDaysSet.has(checkDate.toDateString())) {
                    current++;
                } else {
                    break;
                }
            }
        } else if (activeDaysSet.has(yesterday.toDateString())) {
            current = 1;
            let checkDate = new Date(yesterday);
            while (true) {
                checkDate.setDate(checkDate.getDate() - 1);
                if (activeDaysSet.has(checkDate.toDateString())) {
                    current++;
                } else {
                    break;
                }
            }
        }

        // Calculate longest streak
        let streak = 0;
        for (let i = 0; i < uniqueDates.length; i++) {
            if (i > 0) {
                const diff = (uniqueDates[i] - uniqueDates[i - 1]) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    streak++;
                } else {
                    streak = 1;
                }
            } else {
                streak = 1;
            }
            longest = Math.max(longest, streak);
        }

        const streaks = {
            current,
            longest,
            activeDays: activeDaysSet
        };

        setStreakData(streaks);
        return streaks;
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        return { days, firstDay };
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const handleTopicOfTheDay = async () => {
        try {
            const response = await axios.get(`${API_URL}/topics/daily/random`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const topic = response.data;
            if (topic && topic.id) {
                navigate(`/record/${topic.id}`);
            }
        } catch (error) {
            console.error("Failed to fetch topic of the day", error);
        }
    };

    const renderCalendar = () => {
        const { days, firstDay } = getDaysInMonth(currentDate);
        const daysArray = [];
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Empty slots for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            daysArray.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
        }

        // Days of the month
        for (let i = 1; i <= days; i++) {
            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toDateString();
            const isActive = streakData.activeDays.has(dateStr);

            daysArray.push(
                <div key={i} className="flex items-center justify-center h-10 w-10 mb-2">
                    <div className={`
                        h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                        ${isActive
                            ? 'bg-orange-100 text-orange-600 shadow-sm ring-2 ring-orange-200'
                            : 'text-gray-400 hover:bg-gray-100'}
                    `}>
                        {isActive ? <Flame size={20} fill="currentColor" /> : i}
                    </div>
                </div>
            );
        }

        return (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-wider h-8 flex items-center justify-center">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 place-items-center">
                    {daysArray}
                </div>
            </div>
        );
    };

    // Safelist gradient classes so Tailwind generates them
    const SAFELIST_GRADIENTS = [
        "from-blue-500", "to-cyan-500",
        "from-green-500", "to-emerald-500",
        "from-orange-500", "to-red-500",
        "from-lime-500", "to-green-500",
        "from-yellow-500", "to-orange-500",
        "from-purple-500", "to-pink-500",
        "from-indigo-500", "to-purple-500"
    ];

    const BadgeCard = ({ badge }) => {
        const Icon = badge.icon;
        return (
            <div className={`
                relative rounded-2xl p-6 transition-all duration-300 hover:scale-105 flex flex-col items-center
                ${badge.unlocked
                    ? `bg-gradient-to-br ${badge.gradient} text-white shadow-lg`
                    : 'bg-white text-gray-600 border-2 border-dashed border-gray-200'}
            `}>
                {/* Lock icon for locked badges */}
                {!badge.unlocked && (
                    <div className="absolute top-4 right-4">
                        <Lock size={18} className="text-gray-400" />
                    </div>
                )}

                <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center mb-4
                    ${badge.unlocked
                        ? 'bg-white/20 backdrop-blur-sm'
                        : 'bg-gray-100'}
                `}>
                    <Icon size={32} className={badge.unlocked ? 'text-white' : 'text-gray-400'} />
                </div>

                <h3 className={`text-lg font-bold text-center mb-1 ${!badge.unlocked && 'text-gray-800'}`}>
                    {badge.title}
                </h3>
                <p className={`text-sm text-center mb-4 ${badge.unlocked ? 'text-white/90' : 'text-gray-500'}`}>
                    {badge.description}
                </p>

                {/* Progress bar for locked badges */}
                {!badge.unlocked && badge.progress < 100 && (
                    <div className="w-full mt-auto">
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${badge.progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-1 font-medium">
                            {Math.round(badge.progress)}% Complete
                        </p>
                    </div>
                )}
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <SEO
                title="Insights"
                description="Track your learning progress and streaks."
            />
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to Home
                    </button>
                </div>

                {/* Action Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Start Practice Tile */}
                    <div
                        onClick={() => navigate('/topics')}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Start Your Practice</h2>
                                <p className="text-indigo-100">Choose a topic and improve your skills</p>
                            </div>
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                <Zap size={32} className="text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Topic of the Day Tile */}
                    <div
                        onClick={handleTopicOfTheDay}
                        className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl hover:border-orange-200 hover:scale-[1.02] transition-all relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>

                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h2 className="text-2xl font-bold text-gray-900">Topic of the Day</h2>
                                    <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Daily</span>
                                </div>
                                <p className="text-gray-500">Random challenge for everyone</p>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-2xl group-hover:bg-orange-100 transition-colors">
                                <Target size={32} className="text-orange-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Streak Stats and Calendar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Streak Stats */}
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black opacity-10 rounded-full blur-xl"></div>

                            <div className="flex items-center gap-2 mb-2">
                                <Flame size={20} className="text-orange-100" fill="currentColor" />
                                <span className="text-sm font-medium text-orange-100">Current Streak</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold">{streakData.current}</span>
                                <span className="text-lg text-orange-100">days</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/20 flex justify-between items-center text-xs text-orange-100">
                                <span>Longest Streak</span>
                                <span className="font-bold text-white text-sm">{streakData.longest} days</span>
                            </div>
                        </div>

                        {/* Calendar */}
                        <div>
                            {renderCalendar()}
                        </div>
                    </div>

                    {/* Right Column - Achievements */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Trophy size={24} className="text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {achievements.map(badge => (
                                <BadgeCard key={badge.id} badge={badge} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InsightsPage;

