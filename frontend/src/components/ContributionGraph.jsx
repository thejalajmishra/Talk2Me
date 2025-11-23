import React from 'react';

const ContributionGraph = ({ attempts = [] }) => {
    // Process attempts to get counts per day
    const processData = () => {
        const data = [];
        const today = new Date();
        const attemptsMap = {};

        // Count attempts per day
        attempts.forEach(attempt => {
            const date = new Date(attempt.created_at).toDateString();
            attemptsMap[date] = (attemptsMap[date] || 0) + 1;
        });

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toDateString();

            // Get count for this day
            const count = attemptsMap[dateString] || 0;

            // Determine level based on count
            let level = 0;
            if (count >= 5) level = 4;
            else if (count >= 3) level = 3;
            else if (count >= 2) level = 2;
            else if (count >= 1) level = 1;

            data.push({ date, level, count });
        }
        return data.reverse();
    };

    const data = processData();

    // Color mapping for contribution levels
    const getColor = (level) => {
        switch (level) {
            case 1: return 'bg-indigo-200';
            case 2: return 'bg-indigo-400';
            case 3: return 'bg-indigo-600';
            case 4: return 'bg-indigo-800';
            default: return 'bg-gray-100';
        }
    };

    return (
        <div className="w-full overflow-hidden">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {data.map((day, index) => (
                    <div
                        key={index}
                        className={`w-8 h-8 rounded-md ${getColor(day.level)} transition-all hover:scale-110 hover:ring-2 hover:ring-offset-1 hover:ring-indigo-300 cursor-pointer`}
                        title={`${day.date.toDateString()}: ${day.count} contributions`}
                    />
                ))}
            </div>
            <div className="mt-2 flex items-center justify-end text-xs text-gray-500 gap-1">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                <div className="w-3 h-3 rounded-sm bg-indigo-200"></div>
                <div className="w-3 h-3 rounded-sm bg-indigo-400"></div>
                <div className="w-3 h-3 rounded-sm bg-indigo-600"></div>
                <div className="w-3 h-3 rounded-sm bg-indigo-800"></div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ContributionGraph;
