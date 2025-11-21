from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    name: Optional[str] = None

class Category(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Topic Schemas
class TopicBase(BaseModel):
    title: str
    category_id: Optional[int] = None
    difficulty: str
    description: Optional[str] = None

class TopicCreate(TopicBase):
    pass

class Topic(TopicBase):
    id: int
    category: Optional[Category] = None

    class Config:
        from_attributes = True

# User Auth Schemas

class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_superadmin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    is_superadmin: Optional[bool] = None

# Attempt Schemas
class AttemptResponse(BaseModel):
    id: int
    user_id: int
    topic_id: int
    audio_url: Optional[str] = None
    transcript: Optional[str] = None
    wpm: Optional[float] = None
    filler_count: int
    score: Optional[int] = None
    feedback_json: Optional[dict] = None
    created_at: datetime
    user: Optional[UserResponse] = None
    topic: Optional[Topic] = None

    class Config:
        from_attributes = True
