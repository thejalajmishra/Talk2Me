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
