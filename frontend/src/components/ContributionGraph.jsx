import React from 'react';

const ContributionGraph = () => {
    // Generate mock data for the last 365 days
    const generateData = () => {
        const data = [];
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            // Random intensity: 0 (no contribution) to 4 (high contribution)
            // Weighted towards 0 to look realistic
            const rand = Math.random();
            let level = 0;
            if (rand > 0.9) level = 4;
            else if (rand > 0.8) level = 3;
            else if (rand > 0.6) level = 2;
            else if (rand > 0.4) level = 1;

            data.push({ date, level });
        }
        return data.reverse();
    };

    const data = generateData();

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
            <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                {data.map((day, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-sm ${getColor(day.level)} transition-all hover:scale-125 hover:ring-2 hover:ring-offset-1 hover:ring-indigo-300 cursor-pointer`}
                        title={`${day.date.toDateString()}: ${day.level === 0 ? 'No' : day.level} contributions`}
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
