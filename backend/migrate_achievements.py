"""
Migration script to add Achievement and UserAchievement tables
and seed default achievements.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Achievement
from database import SQLALCHEMY_DATABASE_URL
import json

# Create engine
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_achievements():
    """Seed default achievements into the database."""
    db = SessionLocal()
    
    achievements_data = [
        {
            "key": "hello_speaker",
            "title": "Hello Speaker!",
            "description": "Welcome to Talk2Me",
            "icon_name": "Award",
            "gradient": "from-blue-500 to-cyan-500",
            "unlock_condition": json.dumps({"type": "login", "threshold": 1})
        },
        {
            "key": "starter",
            "title": "Starter",
            "description": "Complete your first topic",
            "icon_name": "Star",
            "gradient": "from-green-500 to-emerald-500",
            "unlock_condition": json.dumps({"type": "total_attempts", "threshold": 1})
        },
        {
            "key": "streak_5",
            "title": "On Fire!",
            "description": "Maintain a 5-day streak",
            "icon_name": "Flame",
            "gradient": "from-orange-500 to-red-500",
            "unlock_condition": json.dumps({"type": "streak", "threshold": 5})
        },
        {
            "key": "easy_5",
            "title": "Easy Rider",
            "description": "Complete 5 easy topics",
            "icon_name": "Zap",
            "gradient": "from-lime-500 to-green-500",
            "unlock_condition": json.dumps({"type": "difficulty_count", "difficulty": "easy", "threshold": 5})
        },
        {
            "key": "medium_5",
            "title": "Medium Master",
            "description": "Complete 5 medium topics",
            "icon_name": "Target",
            "gradient": "from-yellow-500 to-orange-500",
            "unlock_condition": json.dumps({"type": "difficulty_count", "difficulty": "medium", "threshold": 5})
        },
        {
            "key": "hard_5",
            "title": "Hard Hero",
            "description": "Complete 5 hard topics",
            "icon_name": "Trophy",
            "gradient": "from-purple-500 to-pink-500",
            "unlock_condition": json.dumps({"type": "difficulty_count", "difficulty": "hard", "threshold": 5})
        },
        {
            "key": "streak_10",
            "title": "Streak Legend",
            "description": "Maintain a 10-day streak",
            "icon_name": "Crown",
            "gradient": "from-indigo-500 to-purple-500",
            "unlock_condition": json.dumps({"type": "streak", "threshold": 10})
        }
    ]
    
    try:
        # Check if achievements already exist
        existing_count = db.query(Achievement).count()
        if existing_count > 0:
            print(f"Achievements already seeded ({existing_count} found). Skipping...")
            return
        
        # Add achievements
        for achievement_data in achievements_data:
            achievement = Achievement(**achievement_data)
            db.add(achievement)
        
        db.commit()
        print(f"Successfully seeded {len(achievements_data)} achievements!")
        
    except Exception as e:
        print(f"Error seeding achievements: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    print("Creating Achievement and UserAchievement tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
    
    print("\nSeeding default achievements...")
    seed_achievements()
    
    print("\nMigration completed!")

if __name__ == "__main__":
    main()
