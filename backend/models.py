from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_superadmin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    attempts = relationship("Attempt", back_populates="user")

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
    difficulty = Column(String) # Easy, Medium, Hard
    description = Column(Text, nullable=True)
    
    category = relationship("Category", back_populates="topics")
    attempts = relationship("Attempt", back_populates="topic")

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
