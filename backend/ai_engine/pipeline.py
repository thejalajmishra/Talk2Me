import os
import shutil
import random
from fastapi import UploadFile
from sqlalchemy.orm import Session
from models import Attempt, User
from dotenv import load_dotenv
from openai import OpenAI
from .audio import analyze_audio_features
from .transcribe import transcribe_audio
from .coach import generate_feedback

# Load environment variables
load_dotenv()

# Initialize OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

async def process_attempt(file: UploadFile, topic_id: int, user_id: int, db: Session):
    """
    Orchestrates the full AI analysis pipeline.
    """
    # 1. Save Temp File
    temp_filename = f"temp_{random.randint(1000, 9999)}.webm"
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2. Audio Analysis
        audio_metrics = analyze_audio_features(temp_filename)
        duration = audio_metrics.get("duration", 0)

        # 3. Transcription
        transcript = transcribe_audio(client, temp_filename)
        
        # 4. Feedback Generation
        word_count = len(transcript.split())
        wpm = (word_count / duration) * 60 if duration > 0 else 0
        
        feedback_result = generate_feedback(client, transcript, duration, wpm)
        
        # Extract results
        filler_count = feedback_result.get("filler_count", 0)
        overall_score = feedback_result.get("score", 0)
        feedback_data = {
            "tone": feedback_result.get("tone", "Unknown"),
            "improvement_plan": feedback_result.get("improvement_plan", [])
        }

        # 5. Save to DB
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return {"error": "User not found"}

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
                "clarity": feedback_result.get("metrics", {}).get("clarity", 0),
                "confidence": feedback_result.get("metrics", {}).get("confidence", 0)
            },
            "feedback": feedback_data
        }

    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
