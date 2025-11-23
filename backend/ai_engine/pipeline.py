import os
import shutil
import random
from fastapi import UploadFile
from sqlalchemy.orm import Session
from models import Attempt, User, Topic
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
        avg_volume = audio_metrics.get("avg_volume", 0)

        # Silence Detection (Threshold: 0.005 is very quiet)
        if avg_volume < 0.005:
            return {
                "id": None,
                "transcript": "No speech detected (Audio too quiet)",
                "duration": round(duration, 2),
                "wpm": 0,
                "filler_count": 0,
                "score": 0,
                "metrics": {"pace": 0, "clarity": 0, "confidence": 0},
                "feedback": {
                    "tone": "Silent",
                    "improvement_plan": ["Please speak louder or check your microphone."]
                }
            }

        # 3. Transcription
        transcript = transcribe_audio(client, temp_filename)
        
        # 4. Feedback Generation
        word_count = len(transcript.split())
        wpm = (word_count / duration) * 60 if duration > 0 else 0
        
        # Manual filler count (backup)
        fillers = ["um", "uh", "like", "you know", "so", "actually", "basically", "literally"]
        manual_filler_count = sum(transcript.lower().count(f) for f in fillers)
        
        # Diff Analysis (Target vs Spoken)
        diff_result = []
        topic = db.query(Topic).filter(Topic.id == topic_id).first()
        target_text = topic.description if topic else ""
        
        if target_text:
            import difflib
            target_words = target_text.split()
            spoken_words = transcript.split()
            
            # Case-insensitive comparison
            matcher = difflib.SequenceMatcher(None, [w.lower() for w in target_words], [w.lower() for w in spoken_words])
            
            for tag, i1, i2, j1, j2 in matcher.get_opcodes():
                segment_text = " ".join(target_words[i1:i2])
                if not segment_text: continue
                
                if tag == 'equal':
                    diff_result.append({"status": "matched", "text": segment_text})
                elif tag == 'replace' or tag == 'delete':
                    diff_result.append({"status": "missed", "text": segment_text})
        
        
        feedback_result = generate_feedback(client, transcript, duration, wpm, manual_filler_count, target_text)
        
        # Extract results
        filler_count = feedback_result.get("filler_count", manual_filler_count)
        overall_score = feedback_result.get("score", 0)
        content_match_score = feedback_result.get("content_match_score", 0)
        feedback_data = {
            "tone": feedback_result.get("tone", "Unknown"),
            "improvement_plan": feedback_result.get("improvement_plan", []),
            "diff_analysis": diff_result,
            "content_match_score": content_match_score
        }

        # 5. Save to DB (Only for logged-in users)
        attempt_id = None
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return {"error": "User not found"}

            # Save audio permanently
            import uuid
            from datetime import datetime
            
            uploads_dir = "uploads"
            os.makedirs(uploads_dir, exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_id = str(uuid.uuid4())[:8]
            audio_filename = f"audio_{timestamp}_{unique_id}.webm"
            audio_filepath = os.path.join(uploads_dir, audio_filename)
            shutil.copy(temp_filename, audio_filepath)

            attempt = Attempt(
                user_id=user.id,
                topic_id=topic_id,
                audio_url=audio_filename,
                transcript=transcript,
                wpm=wpm,
                filler_count=filler_count,
                score=overall_score,
                feedback_json=feedback_data
            )
            db.add(attempt)
            db.commit()
            db.refresh(attempt)
            attempt_id = attempt.id
        
        return {
            "id": attempt_id,
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
