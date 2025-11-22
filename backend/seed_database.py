import requests
import json

BASE_URL = "http://localhost:8000"

# First, create superadmin
print("Creating superadmin...")
try:
    response = requests.post(f"{BASE_URL}/auth/signup", json={
        "username": "admin",
        "email": "admin@talk2me.com",
        "password": "admin123"
    })
    if response.status_code == 200:
        print("✅ Superadmin created")
        admin_data = response.json()
        token = admin_data['access_token']
    else:
        # Try to login if already exists
        response = requests.post(f"{BASE_URL}/auth/login", json={
            "email": "admin@talk2me.com",
            "password": "admin123"
        })
        admin_data = response.json()
        token = admin_data['access_token']
        print("✅ Logged in as admin")
except Exception as e:
    print(f"Error with admin: {e}")
    exit(1)

# Update user to superadmin via database
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User

db = SessionLocal()
admin_user = db.query(User).filter(User.email == "admin@talk2me.com").first()
if admin_user:
    admin_user.is_superadmin = True
    db.commit()
    print("✅ User promoted to superadmin")
db.close()

headers = {"Authorization": f"Bearer {token}"}

# Create categories
categories_data = [
    {"name": "Business", "description": "Professional and business communication topics"},
    {"name": "Technology", "description": "Tech and innovation discussions"},
    {"name": "Education", "description": "Learning and teaching topics"},
    {"name": "Lifestyle", "description": "Daily life and personal topics"},
]

category_ids = {}
print("\nCreating categories...")
for cat in categories_data:
    try:
        response = requests.post(f"{BASE_URL}/categories", json=cat, headers=headers)
        if response.status_code == 200:
            cat_data = response.json()
            category_ids[cat['name']] = cat_data['id']
            print(f"✅ Created category: {cat['name']}")
    except Exception as e:
        print(f"Error creating category {cat['name']}: {e}")

# Create topics
topics_data = [
    {
        "title": "Elevator Pitch",
        "category_id": category_ids.get("Business", 1),
        "difficulty": "Easy",
        "description": "Practice delivering a 30-second pitch about yourself or your business"
    },
    {
        "title": "Product Presentation",
        "category_id": category_ids.get("Business", 1),
        "difficulty": "Medium",
        "description": "Present a product or service to potential clients"
    },
    {
        "title": "AI and Machine Learning",
        "category_id": category_ids.get("Technology", 2),
        "difficulty": "Hard",
        "description": "Discuss the impact of AI on modern society"
    },
    {
        "title": "Remote Work Benefits",
        "category_id": category_ids.get("Lifestyle", 4),
        "difficulty": "Easy",
        "description": "Talk about the advantages of working from home"
    },
    {
        "title": "Climate Change Solutions",
        "category_id": category_ids.get("Education", 3),
        "difficulty": "Medium",
        "description": "Discuss practical solutions to address climate change"
    },
    {
        "title": "Effective Study Techniques",
        "category_id": category_ids.get("Education", 3),
        "difficulty": "Easy",
        "description": "Share your best study methods and learning strategies"
    },
]

print("\nCreating topics...")
for topic in topics_data:
    try:
        response = requests.post(f"{BASE_URL}/topics", json=topic, headers=headers)
        if response.status_code == 200:
            print(f"✅ Created topic: {topic['title']}")
    except Exception as e:
        print(f"Error creating topic {topic['title']}: {e}")

print("\n✅ Database seeded successfully!")
print(f"\nAdmin credentials:")
print(f"Email: admin@talk2me.com")
print(f"Password: admin123")
