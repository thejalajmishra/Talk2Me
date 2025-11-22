from sqlalchemy.orm import Session
from models import ContactMessage
from datetime import datetime

def create_contact_message(db: Session, name: str, email: str, subject: str, message: str):
    contact = ContactMessage(
        name=name,
        email=email,
        subject=subject,
        message=message,
        created_at=datetime.utcnow()
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

def get_all_contact_messages(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ContactMessage).offset(skip).limit(limit).all()
