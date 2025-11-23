"""
Service layer for achievement management.
"""
from sqlalchemy.orm import Session
from models import Achievement, UserAchievement, Attempt, User
from datetime import datetime, timedelta
import json

def get_all_achievements(db: Session):
    """Get all achievements."""
    return db.query(Achievement).all()

def get_user_achievements(db: Session, user_id: int):
    """
    Get all achievements with unlock status for a user.
    Returns list of dicts with achievement data and unlock status.
    """
    achievements = db.query(Achievement).all()
    user_unlocked = db.query(UserAchievement).filter(
        UserAchievement.user_id == user_id
    ).all()
    
    unlocked_achievement_ids = {ua.achievement_id for ua in user_unlocked}
    unlocked_dict = {ua.achievement_id: ua.unlocked_at for ua in user_unlocked}
    
    result = []
    for achievement in achievements:
        is_unlocked = achievement.id in unlocked_achievement_ids
        result.append({
            "id": achievement.id,
            "key": achievement.key,
            "title": achievement.title,
            "description": achievement.description,
            "icon_name": achievement.icon_name,
            "gradient": achievement.gradient,
            "unlocked": is_unlocked,
            "unlocked_at": unlocked_dict.get(achievement.id),
            "unlock_condition": json.loads(achievement.unlock_condition) if isinstance(achievement.unlock_condition, str) else achievement.unlock_condition
        })
    
    return result

def calculate_user_stats(db: Session, user_id: int):
    """Calculate user statistics for achievement checking."""
    attempts = db.query(Attempt).filter(Attempt.user_id == user_id).all()
    
    if not attempts:
        return {
            "total_attempts": 0,
            "easy_count": 0,
            "medium_count": 0,
            "hard_count": 0,
            "current_streak": 0,
            "longest_streak": 0
        }
    
    # Count by difficulty
    easy_count = sum(1 for a in attempts if a.topic and a.topic.difficulty and a.topic.difficulty.lower() == 'easy')
    medium_count = sum(1 for a in attempts if a.topic and a.topic.difficulty and a.topic.difficulty.lower() == 'medium')
    hard_count = sum(1 for a in attempts if a.topic and a.topic.difficulty and a.topic.difficulty.lower() == 'hard')
    
    # Calculate streaks
    sorted_dates = sorted(set(a.created_at.date() for a in attempts))
    
    current_streak = 0
    longest_streak = 0
    
    if sorted_dates:
        # Check current streak
        today = datetime.utcnow().date()
        yesterday = today - timedelta(days=1)
        
        if sorted_dates[-1] == today or sorted_dates[-1] == yesterday:
            current_streak = 1
            check_date = sorted_dates[-1] - timedelta(days=1)
            
            for i in range(len(sorted_dates) - 2, -1, -1):
                if sorted_dates[i] == check_date:
                    current_streak += 1
                    check_date -= timedelta(days=1)
                else:
                    break
        
        # Calculate longest streak
        streak = 1
        for i in range(1, len(sorted_dates)):
            if (sorted_dates[i] - sorted_dates[i-1]).days == 1:
                streak += 1
                longest_streak = max(longest_streak, streak)
            else:
                streak = 1
        longest_streak = max(longest_streak, streak)
    
    return {
        "total_attempts": len(attempts),
        "easy_count": easy_count,
        "medium_count": medium_count,
        "hard_count": hard_count,
        "current_streak": current_streak,
        "longest_streak": longest_streak
    }

def check_and_unlock_achievements(db: Session, user_id: int):
    """
    Check all achievements and unlock any that meet the criteria.
    Returns list of newly unlocked achievements.
    """
    achievements = db.query(Achievement).all()
    already_unlocked = {ua.achievement_id for ua in db.query(UserAchievement).filter(
        UserAchievement.user_id == user_id
    ).all()}
    
    stats = calculate_user_stats(db, user_id)
    newly_unlocked = []
    
    for achievement in achievements:
        if achievement.id in already_unlocked:
            continue
        
        condition = json.loads(achievement.unlock_condition) if isinstance(achievement.unlock_condition, str) else achievement.unlock_condition
        should_unlock = False
        
        if condition["type"] == "login":
            should_unlock = True  # User exists, so they've logged in
        elif condition["type"] == "total_attempts":
            should_unlock = stats["total_attempts"] >= condition["threshold"]
        elif condition["type"] == "streak":
            should_unlock = stats["longest_streak"] >= condition["threshold"]
        elif condition["type"] == "difficulty_count":
            difficulty = condition["difficulty"].lower()
            count = stats.get(f"{difficulty}_count", 0)
            should_unlock = count >= condition["threshold"]
        
        if should_unlock:
            user_achievement = UserAchievement(
                user_id=user_id,
                achievement_id=achievement.id
            )
            db.add(user_achievement)
            newly_unlocked.append({
                "id": achievement.id,
                "key": achievement.key,
                "title": achievement.title,
                "description": achievement.description,
                "icon_name": achievement.icon_name,
                "gradient": achievement.gradient
            })
    
    if newly_unlocked:
        db.commit()
    
    return newly_unlocked

def unlock_hello_speaker(db: Session, user_id: int):
    """Unlock the 'Hello Speaker' achievement for a new user."""
    hello_achievement = db.query(Achievement).filter(Achievement.key == "hello_speaker").first()
    if not hello_achievement:
        return None
    
    # Check if already unlocked
    existing = db.query(UserAchievement).filter(
        UserAchievement.user_id == user_id,
        UserAchievement.achievement_id == hello_achievement.id
    ).first()
    
    if existing:
        return None
    
    user_achievement = UserAchievement(
        user_id=user_id,
        achievement_id=hello_achievement.id
    )
    db.add(user_achievement)
    db.commit()
    
    return {
        "id": hello_achievement.id,
        "key": hello_achievement.key,
        "title": hello_achievement.title,
        "description": hello_achievement.description,
        "icon_name": hello_achievement.icon_name,
        "gradient": hello_achievement.gradient
    }
