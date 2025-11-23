from sqlalchemy.orm import Session
from models import User
from schemas import UserUpdate

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    """Get all users with pagination."""
    return db.query(User).offset(skip).limit(limit).all()

def get_user_by_id(db: Session, user_id: int):
    """Get a user by ID."""
    return db.query(User).filter(User.id == user_id).first()

def update_user(db: Session, user_id: int, user_update: UserUpdate):
    """Update user details."""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    
    update_data = user_update.dict(exclude_unset=True)
    
    # Handle password update
    if 'password' in update_data:
        password = update_data.pop('password')
        if password:
            from auth import get_password_hash
            db_user.hashed_password = get_password_hash(password)
            
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    """Delete a user."""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    
    db.delete(db_user)
    db.commit()
    return True

def toggle_admin_status(db: Session, user_id: int):
    """Toggle user's admin status."""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    
    db_user.is_superadmin = not db_user.is_superadmin
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_streak(db: Session, user_id: int):
    """
    Update user's streak based on practice activity.
    - If last practice was yesterday, increment streak.
    - If last practice was today, do nothing.
    - If last practice was older than yesterday, reset to 1.
    - If no last practice, set to 1.
    """
    from datetime import datetime, timedelta
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None
        
    # Exclude admins from streak tracking
    if user.is_superadmin:
        return user
        
    now = datetime.utcnow()
    today = now.date()
    print(f"DEBUG: Checking streak. Today={today}, Last={user.last_practice_date}")
    
    if user.last_practice_date:
        last_date = user.last_practice_date.date()
        
        if last_date == today:
            # Already practiced today, just update the timestamp
            user.last_practice_date = now
        elif last_date == today - timedelta(days=1):
            # Practiced yesterday, increment streak
            user.current_streak += 1
            user.last_practice_date = now
        else:
            # Missed a day or more, reset streak
            user.current_streak = 1
            user.last_practice_date = now
    else:
        # First time practicing
        user.current_streak = 1
        user.last_practice_date = now
        
    db.commit()
    db.refresh(user)
    return user
