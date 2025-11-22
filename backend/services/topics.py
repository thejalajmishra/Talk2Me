from sqlalchemy.orm import Session
from models import Topic
from schemas import TopicCreate

def get_all_topics(db: Session, include_custom: bool = False):
    """Get all topics from database. By default, excludes custom topics."""
    query = db.query(Topic)
    if not include_custom:
        query = query.filter(Topic.is_custom == False)
    return query.all()

def get_topic_by_id(db: Session, topic_id: int):
    return db.query(Topic).filter(Topic.id == topic_id).first()

def create_topic(db: Session, topic: TopicCreate):
    db_topic = Topic(**topic.dict())
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic

def create_custom_topic(db: Session, title: str, category_id: int, description: str, user_id: int):
    """Create a custom topic created by a user."""
    db_topic = Topic(
        title=title,
        category_id=category_id,
        difficulty="Custom",
        description=description,
        is_custom=True,
        created_by=user_id
    )
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic

def update_topic(db: Session, topic_id: int, topic_data: TopicCreate):
    """Update an existing topic."""
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if topic:
        topic.title = topic_data.title
        topic.category_id = topic_data.category_id
        topic.difficulty = topic_data.difficulty
        topic.description = topic_data.description
        db.commit()
        db.refresh(topic)
        return topic
    return None

def delete_topic(db: Session, topic_id: int):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if topic:
        db.delete(topic)
        db.commit()
        return True
    return False
