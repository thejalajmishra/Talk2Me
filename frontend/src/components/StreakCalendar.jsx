import React from 'react';
import { motion } from 'framer-motion';

const StreakCalendar = ({ activityData, className = "bg-white" }) => {
  // Mock data for the last 365 days if no data provided
  const generateMockData = () => {
    const data = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
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
      default: return 'bg-gray-200/50'; // Lighter gray for empty days in compact mode
    }
  };

  return (
    <div className={`rounded-xl p-4 ${className}`}>
      <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-1 min-w-max">
          {/* We'll display weeks as columns */}
          {Array.from({ length: 53 }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const dataIndex = weekIndex * 7 + dayIndex;
                const dayData = data[dataIndex];

                if (!dayData) return null;

                return (
                  <motion.div
                    key={dataIndex}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: dataIndex * 0.001 }}
                    className={`w-2.5 h-2.5 rounded-sm ${getColor(dayData.level)}`}
                    title={`${dayData.date.toDateString()}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center">
          <span className="w-2.5 h-2.5 bg-gray-200/50 rounded-sm mr-1.5"></span>
          <span>No Activity</span>
        </div>
        <div className="flex items-center">
          <span className="w-2.5 h-2.5 bg-indigo-400 rounded-sm mr-1.5"></span>
          <span>Activity</span>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;
