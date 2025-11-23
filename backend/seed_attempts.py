from sqlalchemy import create_engine, text
from database import SQLALCHEMY_DATABASE_URL
import random
from datetime import datetime, timedelta

def seed_attempts():
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    
    user_id = 1
    topic_id = 9
    
    with engine.connect() as conn:
        print(f"Seeding attempts for user {user_id}...")
        for i in range(12):
            score = random.randint(60, 95)
            wpm = random.randint(100, 160)
            filler_count = random.randint(0, 10)
            created_at = datetime.utcnow() - timedelta(days=i)
            
            sql = text("""
                INSERT INTO attempts (user_id, topic_id, score, wpm, filler_count, transcript, feedback_json, created_at)
                VALUES (:user_id, :topic_id, :score, :wpm, :filler_count, :transcript, :feedback_json, :created_at)
            """)
            
            conn.execute(sql, {
                "user_id": user_id,
                "topic_id": topic_id,
                "score": score,
                "wpm": wpm,
                "filler_count": filler_count,
                "transcript": f"This is a dummy transcript for attempt {i+1}.",
                "feedback_json": '{"tone": "Confident", "metrics": {"clarity": 85}, "content_match_score": 90}',
                "created_at": created_at
            })
            
        conn.commit()
        print("✅ Seeded 12 attempts.")

if __name__ == "__main__":
    seed_attempts()
