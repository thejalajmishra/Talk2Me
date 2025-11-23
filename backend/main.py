from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from database import engine, get_db
from models import Base, User
from schemas import (
    Topic, TopicCreate, CustomTopicCreate,
    Category, CategoryCreate, CategoryUpdate,
    UserSignup, UserLogin, Token, UserResponse, UserUpdate,
    AttemptResponse,
    ContactMessageCreate, ContactMessageResponse,
    GoogleAuthRequest, GitHubAuthRequest
)
from services.topics import get_all_topics, get_topic_by_id, create_topic, delete_topic, create_custom_topic, update_topic
from services.categories import (
    get_all_categories, get_category_by_id, create_category, 
    update_category, delete_category
)
from services.users import get_all_users, get_user_by_id, update_user, delete_user, toggle_admin_status
from services.attempts import get_all_attempts, delete_attempt, get_attempts_by_user
from ai_engine.pipeline import process_attempt
from services.leaderboard import get_leaderboard
from services.contact import create_contact_message, get_all_contact_messages
from auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from dependencies import get_current_user, get_current_admin
from datetime import timedelta

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Talk2Me API", description="AI Communication Coach Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Talk2Me API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/uploads/{filename}")
def get_audio_file(filename: str):
    """Serve audio files from the uploads directory"""
    file_path = os.path.join("uploads", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(file_path, media_type="audio/webm")

# Auth endpoints
@app.post("/auth/signup", response_model=Token)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        is_superadmin=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "is_superadmin": new_user.is_superadmin
        }
    }

@app.post("/auth/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # Find user
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_superadmin": user.is_superadmin
        }
    }

@app.post("/auth/google", response_model=Token)
def google_auth(auth_request: GoogleAuthRequest, db: Session = Depends(get_db)):
    # Verify Google Token
    from auth import verify_google_token
    google_user = verify_google_token(auth_request.token)
    
    if not google_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
    
    email = google_user.get('email')
    name = google_user.get('name')
    
    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Create new user
        # Generate a unique username if needed, for now using email prefix or random
        username = email.split('@')[0]
        # Check if username exists
        if db.query(User).filter(User.username == username).first():
            import random
            username = f"{username}{random.randint(1000, 9999)}"
            
        user = User(
            username=username,
            email=email,
            hashed_password=None, # No password for OAuth users
            is_superadmin=False
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_superadmin": user.is_superadmin
        }
    }

@app.post("/auth/github", response_model=Token)
def github_auth(auth_request: GitHubAuthRequest, db: Session = Depends(get_db)):
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Received GitHub auth request with code: {auth_request.code[:10]}...")
    
    # Verify GitHub Code
    from auth import verify_github_code
    github_user = verify_github_code(auth_request.code)
    
    if not github_user:
        logger.error("GitHub user verification failed")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid GitHub code"
        )
    
    logger.info(f"GitHub user verified: {github_user}")
    
    email = github_user.get('email')
    github_username = github_user.get('login')
    
    if not email:
        logger.error("No email found in GitHub user data")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitHub account must have a verified email"
        )
    
    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        # Create new user
        # Use GitHub username or email prefix
        username = github_username or email.split('@')[0]
        # Check if username exists
        if db.query(User).filter(User.username == username).first():
            import random
            username = f"{username}{random.randint(1000, 9999)}"
            
        user = User(
            username=username,
            email=email,
            hashed_password=None, # No password for OAuth users
            is_superadmin=False
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_superadmin": user.is_superadmin
        }
    }

@app.get("/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.put("/users/me", response_model=UserResponse)
def update_my_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_user = update_user(db, current_user.id, user_update)
    return updated_user

@app.put("/admin/users/{user_id}", response_model=UserResponse)
def admin_update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    updated_user = update_user(db, user_id, user_data)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@app.post("/admin/users", response_model=UserResponse)
def admin_create_user(
    user_data: UserSignup,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Check if user exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        is_superadmin=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/topics", response_model=List[Topic])
def read_topics(db: Session = Depends(get_db)):
    # Exclude custom topics from public listing
    return get_all_topics(db, include_custom=False)

@app.post("/topics", response_model=Topic)
def add_topic(topic: TopicCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return create_topic(db, topic)

@app.post("/topics/custom", response_model=Topic)
def add_custom_topic(
    topic_data: CustomTopicCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Create a custom topic by a user"""
    return create_custom_topic(
        db, 
        title=topic_data.title,
        category_id=topic_data.category_id,
        description=topic_data.description,
        user_id=current_user.id
    )

@app.get("/topics/{topic_id}", response_model=Topic)
def read_topic(topic_id: int, db: Session = Depends(get_db)):
    return get_topic_by_id(db, topic_id)

@app.put("/topics/{topic_id}", response_model=Topic)
def edit_topic(
    topic_id: int, 
    topic: TopicCreate, 
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin)
):
    """Update an existing topic"""
    updated_topic = update_topic(db, topic_id, topic)
    if not updated_topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return updated_topic

@app.delete("/topics/{topic_id}")
def remove_topic(topic_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    success = delete_topic(db, topic_id)
    if not success:
        return {"error": "Topic not found"}
    return {"message": "Topic deleted"}

@app.post("/analyze", response_model=dict)
async def analyze_speech(
    audio: UploadFile = File(...),
    topic_id: int = Form(...),
    user_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    result = await process_attempt(audio, topic_id, user_id, db)
    return result

@app.get("/leaderboard", response_model=List[dict])
def read_leaderboard(db: Session = Depends(get_db)):
    return get_leaderboard(db)

# Category endpoints
@app.get("/categories", response_model=List[Category])
def read_categories(db: Session = Depends(get_db)):
    return get_all_categories(db)

@app.post("/categories", response_model=Category)
def add_category(category: CategoryCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return create_category(db, category)

@app.put("/categories/{category_id}", response_model=Category)
def modify_category(category_id: int, category: CategoryUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    result = update_category(db, category_id, category)
    if not result:
        raise HTTPException(status_code=404, detail="Category not found")
    return result

@app.delete("/categories/{category_id}")
def remove_category(category_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    result = delete_category(db, category_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Category not found")
    if result is False:
        raise HTTPException(status_code=400, detail="Cannot delete category with existing topics")
    return {"message": "Category deleted"}

# Admin Topics endpoint (includes custom topics)
@app.get("/admin/topics/all", response_model=List[Topic])
def read_all_topics_admin(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    """Get all topics including custom ones for admin panel"""
    return get_all_topics(db, include_custom=True)

# User management endpoints
@app.get("/admin/users", response_model=List[UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return get_all_users(db, skip, limit)

@app.put("/admin/users/{user_id}", response_model=UserResponse)
def modify_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    result = update_user(db, user_id, user_update)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result

@app.delete("/admin/users/{user_id}")
def remove_user(user_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    result = delete_user(db, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

@app.post("/admin/users/{user_id}/toggle-admin", response_model=UserResponse)
def toggle_user_admin(user_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    result = toggle_admin_status(db, user_id)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result

# Attempts endpoints
@app.get("/users/me/attempts", response_model=List[AttemptResponse])
def read_my_attempts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_attempts_by_user(db, current_user.id)

@app.get("/admin/attempts", response_model=List[AttemptResponse])
def read_attempts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return get_all_attempts(db, skip, limit)

@app.delete("/admin/attempts/{attempt_id}")
def remove_attempt(attempt_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    result = delete_attempt(db, attempt_id)
    if not result:
        raise HTTPException(status_code=404, detail="Attempt not found")
    return {"message": "Attempt deleted"}

# Contact Message endpoints
@app.post("/contact", response_model=ContactMessageResponse)
def submit_contact(contact_data: ContactMessageCreate, db: Session = Depends(get_db)):
    return create_contact_message(
        db, 
        contact_data.name, 
        contact_data.email, 
        contact_data.subject, 
        contact_data.message
    )

@app.get("/admin/contacts", response_model=List[ContactMessageResponse])
def read_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return get_all_contact_messages(db, skip, limit)

