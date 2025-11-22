import React from 'react';
import { motion } from 'framer-motion';

const StreakCalendar = ({ activityData, className = "bg-white" }) => {
    // Mock data for the last 30 days (1 month) if no data provided
    const generateMockData = () => {
        const data = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            // Randomly assign activity level (0-4)
            const level = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
            data.push({ date, level });
        }
        return data;
    };

    const data = activityData || generateMockData();

    // Helper to get color based on activity level
    const getColor = (level) => {
        switch (level) {
            case 1: return 'bg-indigo-200';
            case 2: return 'bg-indigo-400';
            case 3: return 'bg-indigo-600';
            case 4: return 'bg-indigo-800';
            default: return 'bg-gray-200/50';
        }
    };

    return (
        <div className={`${className}`}>
            <div className="w-full flex justify-center">
                <div className="flex gap-1.5">
                    {/* Display 30 days in a row */}
                    {data.map((dayData, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.01 }}
                            className={`w-4 h-4 rounded-md ${getColor(dayData.level)}`}
                            title={`${dayData.date.toDateString()}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StreakCalendar;
