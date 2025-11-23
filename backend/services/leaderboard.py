from sqlalchemy.orm import Session
from models import Attempt, User, Topic
from sqlalchemy import desc, func

def get_leaderboard(db: Session, limit: int = 10, leaderboard_type: str = "top"):
    """
    Returns leaderboard data based on type:
    - "top": Top individual attempts by score.
    - "average": Top users by average score.
    """
    leaderboard_data = []

    if leaderboard_type == "average":
        # Aggregate by user to get average score
        results = db.query(
            User.username,
            func.avg(Attempt.score).label("average_score"),
            func.count(Attempt.id).label("attempt_count")
        ).join(Attempt).group_by(User.id).order_by(desc("average_score")).limit(limit).all()

        for result in results:
            leaderboard_data.append({
                "rank": 0, # To be filled
                "user": result.username,
                "topic": "All Topics", # Average is across all topics
                "score": round(result.average_score, 1),
                "attempts": result.attempt_count,
                "date": "N/A"
            })

    else: # Default to "top"
        results = db.query(Attempt).order_by(desc(Attempt.score)).limit(limit).all()
        
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
