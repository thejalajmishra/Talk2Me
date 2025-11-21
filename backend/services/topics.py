from sqlalchemy.orm import Session
from models import Topic
from schemas import TopicCreate

def get_all_topics(db: Session):
    """Get all topics from database."""
    topics = db.query(Topic).all()
    return topics

def get_topic_by_id(db: Session, topic_id: int):
    return db.query(Topic).filter(Topic.id == topic_id).first()

def create_topic(db: Session, topic: TopicCreate):
    db_topic = Topic(**topic.dict())
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic

def delete_topic(db: Session, topic_id: int):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if topic:
        db.delete(topic)
        db.commit()
        return True
    return False
