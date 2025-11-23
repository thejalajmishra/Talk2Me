import React, { useEffect, useState } from 'react';
import { Award, Trophy, Star, Flame, Zap, Target, Crown, X } from 'lucide-react';

const iconMap = {
    'Award': Award,
    'Trophy': Trophy,
    'Star': Star,
    'Flame': Flame,
    'Zap': Zap,
    'Target': Target,
    'Crown': Crown
};

const AchievementUnlockNotification = ({ achievement, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        setTimeout(() => setIsVisible(true), 100);

        // Auto-dismiss after 5 seconds
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300);
    };

    if (!achievement) return null;

    const Icon = iconMap[achievement.icon_name] || Trophy;

    return (
        <div className={`
            fixed top-4 right-4 z-50 max-w-sm
            transition-all duration-300 ease-out
            ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}>
            <div className={`
                bg-gradient-to-br ${achievement.gradient} 
                text-white rounded-2xl shadow-2xl p-6 relative overflow-hidden
                border-2 border-white/20
            `}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black opacity-10 rounded-full blur-xl"></div>

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={18} />
                </button>

                {/* Content */}
                <div className="relative">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
                                <Icon size={32} className="text-white" />
                            </div>
                        </div>

                        {/* Text */}
                        <div className="flex-1 pt-1">
                            <p className="text-sm font-medium text-white/80 mb-1">Achievement Unlocked!</p>
                            <h3 className="text-xl font-bold mb-1">{achievement.title}</h3>
                            <p className="text-sm text-white/90">{achievement.description}</p>
                        </div>
                    </div>

                    {/* Confetti effect */}
                    <div className="absolute -top-2 -right-2 text-4xl animate-ping opacity-75">
                        🎉
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AchievementUnlockNotification;
