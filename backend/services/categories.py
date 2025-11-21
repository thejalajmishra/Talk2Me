from sqlalchemy.orm import Session
from models import Category
from schemas import CategoryCreate, CategoryUpdate

def get_all_categories(db: Session):
    """Get all categories."""
    return db.query(Category).order_by(Category.name).all()

def get_category_by_id(db: Session, category_id: int):
    """Get a category by ID."""
    return db.query(Category).filter(Category.id == category_id).first()

def create_category(db: Session, category: CategoryCreate):
    """Create a new category."""
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: int, category: CategoryUpdate):
    """Update a category."""
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        return None
    
    update_data = category.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_category, key, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    """Delete a category. Returns False if category has topics."""
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        return None
    
    # Check if category has topics
    if db_category.topics:
        return False
    
    db.delete(db_category)
    db.commit()
    return True
