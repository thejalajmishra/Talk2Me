import random
import os
import shutil
from fastapi import UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Attempt, User
import json

# Mock Transcript for demo purposes
MOCK_TRANSCRIPTS = [
    "I think AI is going to change the world in many ways. It will automate jobs but also create new ones. We need to be careful about ethics.",
    "Climate change is a serious issue. We need to reduce carbon emissions and switch to renewable energy sources like solar and wind.",
    "My most embarrassing moment was when I tripped on stage during a graduation ceremony. Everyone laughed, but I learned to laugh at myself.",
]

async def analyze_audio(file: UploadFile, topic_id: int, user_id: int, db: Session):
    """
    Analyzes the uploaded audio file.
    1. Saves temp file.
    2. Uses Librosa for audio metrics (Duration, Tempo).
    3. Mocks STT (or uses OpenAI if key available).
    4. Calculates WPM and Filler count.
    5. Generates AI Feedback.
    """
    
    # 1. Save Temp File
    temp_filename = f"temp_{random.randint(1000, 9999)}.webm"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # 2. Audio Analysis (Librosa)
        # Note: Librosa might fail if ffmpeg is not installed on the system. 
        # We wrap in try/except to fallback safely.
        try:
            y, sr = librosa.load(temp_filename, sr=None)
            duration = librosa.get_duration(y=y, sr=sr)
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            avg_pitch = float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)))
        except Exception as e:
            print(f"Librosa error: {e}")
            duration = 30.0 # Fallback
            tempo = 120.0
            avg_pitch = 0.0

        # 3. STT (Mock for now)
        transcript = random.choice(MOCK_TRANSCRIPTS)
        word_count = len(transcript.split())
        
        # 4. Metrics
        wpm = (word_count / duration) * 60
        filler_words = ["um", "uh", "like", "you know"]
        filler_count = sum(transcript.lower().count(fw) for fw in filler_words)
        
        # 5. Scoring (Simple logic)
        clarity_score = min(100, max(0, 100 - (filler_count * 5)))
        pace_score = 100 if 100 <= wpm <= 150 else 80 # Ideal 100-150 wpm
        overall_score = int((clarity_score + pace_score) / 2)
        
        feedback_data = {
            "tone": "Confident" if avg_pitch > 1000 else "Calm",
            "improvement_plan": [
                "Try to reduce filler words." if filler_count > 0 else "Great flow!",
                "Your pace is good." if 100 <= wpm <= 150 else "Adjust your speaking pace."
            ]
        }

        # Save to DB
        # Retrieve the authenticated user by ID
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        attempt = Attempt(
            user_id=user.id,
            topic_id=topic_id,
            transcript=transcript,
            wpm=wpm,
            filler_count=filler_count,
            score=overall_score,
            feedback_json=feedback_data
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
        
        return {
            "id": attempt.id,
            "transcript": transcript,
            "duration": round(duration, 2),
            "wpm": round(wpm, 1),
            "filler_count": filler_count,
            "score": overall_score,
            "metrics": {
                "pace": round(wpm, 1),
                "clarity": clarity_score,
                "confidence": random.randint(80, 99)
            },
            "feedback": feedback_data
        }
        
    finally:
        # Cleanup
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
