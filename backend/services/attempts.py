from sqlalchemy.orm import Session
from models import Attempt, User, Topic

def get_all_attempts(db: Session, skip: int = 0, limit: int = 100):
    """Get all attempts with user and topic information."""
    return db.query(Attempt).offset(skip).limit(limit).all()

def get_attempts_by_user(db: Session, user_id: int):
    """Get all attempts for a specific user."""
    return db.query(Attempt).filter(Attempt.user_id == user_id).all()

def delete_attempt(db: Session, attempt_id: int):
    """Delete an attempt."""
    attempt = db.query(Attempt).filter(Attempt.id == attempt_id).first()
    if not attempt:
        return None
    
    db.delete(attempt)
    db.commit()
    return True
