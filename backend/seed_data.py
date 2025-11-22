import sys
from database import get_db
from models import Category, Topic

def seed():
    # Get a DB session
    db = next(get_db())
    # Create categories
    cat1 = Category(name="Tech Trends", description="Latest developments in AI, blockchain, cloud.")
    cat2 = Category(name="Health & Wellness", description="Fitness, nutrition, mental health.")
    db.add_all([cat1, cat2])
    db.commit()
    db.refresh(cat1)
    db.refresh(cat2)
    # Create topics linked to categories
    topics = [
        Topic(
            title="AI Ethics",
            description="Discuss moral implications of AI decision‑making.",
            category_id=cat1.id,
            difficulty="Medium",
        ),
        Topic(
            title="Home Workouts",
            description="Share quick exercise routines without equipment.",
            category_id=cat2.id,
            difficulty="Easy",
        ),
        Topic(
            title="Quantum Computing Basics",
            description="Explain qubits, superposition, and potential uses.",
            category_id=cat1.id,
            difficulty="Hard",
        ),
        Topic(
            title="Mindful Eating",
            description="Strategies to eat more consciously and healthily.",
            category_id=cat2.id,
            difficulty="Medium",
        ),
    ]
    db.add_all(topics)
    db.commit()
    print("✅ Seed data inserted: 2 categories, 4 topics")

if __name__ == "__main__":
    try:
        seed()
    except Exception as e:
        print("Error during seeding:", e)
        sys.exit(1)
