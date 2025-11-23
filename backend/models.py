from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey, Float, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    is_superadmin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    attempts = relationship("Attempt", back_populates="user")
    user_achievements = relationship("UserAchievement", back_populates="user")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    topics = relationship("Topic", back_populates="category")

class Topic(Base):
    __tablename__ = "topics"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    difficulty = Column(String) # Easy, Medium, Hard, Custom
    description = Column(Text, nullable=True)
    time_limit = Column(Integer, default=60)  # Time limit in seconds
    is_custom = Column(Boolean, default=False)  # Flag for user-created topics
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # User who created it
    
    category = relationship("Category", back_populates="topics")
    attempts = relationship("Attempt", back_populates="topic")
    creator = relationship("User", foreign_keys=[created_by])

class Attempt(Base):
    __tablename__ = "attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"))
    audio_url = Column(String, nullable=True)
    transcript = Column(Text, nullable=True)
    
    # Analysis Results
    wpm = Column(Float, nullable=True)
    filler_count = Column(Integer, default=0)
    score = Column(Integer, nullable=True)
    feedback_json = Column(JSON, nullable=True) # Detailed AI feedback
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="attempts")
    topic = relationship("Topic", back_populates="attempts")

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False)  # e.g., 'hello_speaker'
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    icon_name = Column(String, nullable=False)  # e.g., 'Award', 'Star', 'Flame'
    gradient = Column(String, nullable=False)  # e.g., 'from-blue-500 to-cyan-500'
    unlock_condition = Column(JSON, nullable=False)  # e.g., {"type": "streak", "threshold": 5}
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user_achievements = relationship("UserAchievement", back_populates="achievement")

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
    
    __table_args__ = (UniqueConstraint('user_id', 'achievement_id', name='_user_achievement_uc'),)
