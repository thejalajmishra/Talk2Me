from sqlalchemy.orm import Session
from models import Attempt, User, Topic
from sqlalchemy import desc

def get_leaderboard(db: Session, limit: int = 10):
    """
    Returns top attempts by score.
    """
    results = db.query(Attempt).order_by(desc(Attempt.score)).limit(limit).all()
    
    leaderboard_data = []
    for attempt in results:
        leaderboard_data.append({
            "rank": 0, # To be filled
            "user": attempt.user.username,
            "topic": attempt.topic.title,
            "score": attempt.score,
            "date": attempt.created_at.strftime("%Y-%m-%d")
        })
    
    # Add ranks
    for i, item in enumerate(leaderboard_data):
        item["rank"] = i + 1
        
    return leaderboard_data
