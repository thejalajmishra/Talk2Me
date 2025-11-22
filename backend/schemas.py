from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserSignup(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    token: str

class GitHubAuthRequest(BaseModel):
    code: str

class UserResponse(UserBase):
    id: int
    is_superadmin: bool
    
    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class TopicBase(BaseModel):
    title: str
    difficulty: str
    description: Optional[str] = None
    category_id: Optional[int] = None

class TopicCreate(TopicBase):
    pass

class CustomTopicCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: Optional[int] = None

class Topic(TopicBase):
    id: int
    is_custom: bool
    created_by: Optional[int] = None
    
    class Config:
        orm_mode = True

class AttemptBase(BaseModel):
    topic_id: int
    
class AttemptResponse(AttemptBase):
    id: int
    user_id: int
    audio_url: Optional[str]
    transcript: Optional[str]
    wpm: Optional[float]
    filler_count: Optional[int]
    score: Optional[int]
    feedback_json: Optional[Dict[str, Any]]
    created_at: datetime
    
    class Config:
        orm_mode = True

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str

class ContactMessageResponse(ContactMessageCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
