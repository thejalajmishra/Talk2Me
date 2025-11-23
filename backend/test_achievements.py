"""
Test script to verify achievement system works correctly.
Creates a test user, makes an attempt, and checks if achievements unlock.
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_achievement_system():
    print("=== Testing Achievement System ===\n")
    
    # Step 1: Create a new user
    print("Step 1: Creating test user...")
    signup_data = {
        "username": "test_achievement_user",
        "email": "test_achievement@example.com",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        if response.status_code == 200:
            auth_data = response.json()
            token = auth_data["access_token"]
            user_id = auth_data["user"]["id"]
            print(f"✓ User created successfully! User ID: {user_id}")
        else:
            print(f"✗ Signup failed: {response.text}")
            # Try to login instead (user might already exist)
            print("\nTrying to login with existing user...")
            login_data = {
                "email": signup_data["email"],
                "password": signup_data["password"]
            }
            response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
            if response.status_code == 200:
                auth_data = response.json()
                token = auth_data["access_token"]
                user_id = auth_data["user"]["id"]
                print(f"✓ Logged in successfully! User ID: {user_id}")
            else:
                print(f"✗ Login failed: {response.text}")
                return
    except Exception as e:
        print(f"✗ Error during signup/login: {e}")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 2: Check initial achievements
    print("\nStep 2: Checking initial achievements...")
    try:
        response = requests.get(f"{BASE_URL}/users/me/achievements", headers=headers)
        if response.status_code == 200:
            achievements = response.json()
            print(f"✓ Found {len(achievements)} achievements")
            
            # Check Hello Speaker
            hello_speaker = next((a for a in achievements if a["key"] == "hello_speaker"), None)
            if hello_speaker and hello_speaker["unlocked"]:
                print("  ✓ 'Hello Speaker!' achievement is UNLOCKED")
            else:
                print("  ✗ 'Hello Speaker!' achievement is LOCKED")
            
            # Check Starter
            starter = next((a for a in achievements if a["key"] == "starter"), None)
            if starter:
                if starter["unlocked"]:
                    print("  ✓ 'Starter' achievement is UNLOCKED")
                else:
                    print("  ✗ 'Starter' achievement is LOCKED (expected)")
        else:
            print(f"✗ Failed to fetch achievements: {response.text}")
            return
    except Exception as e:
        print(f"✗ Error fetching achievements: {e}")
        return
    
    # Step 3: Get a topic to practice
    print("\nStep 3: Getting a topic...")
    try:
        response = requests.get(f"{BASE_URL}/topics")
        if response.status_code == 200:
            topics = response.json()
            if topics:
                topic = topics[0]
                topic_id = topic["id"]
                print(f"✓ Using topic: '{topic['title']}' (ID: {topic_id})")
            else:
                print("✗ No topics available")
                return
        else:
            print(f"✗ Failed to fetch topics: {response.text}")
            return
    except Exception as e:
        print(f"✗ Error fetching topics: {e}")
        return
    
    # Step 4: Create a mock attempt directly in database
    print("\nStep 4: Creating an attempt...")
    print("(Note: We'll use the database directly since we need audio file)")
    
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from models import Attempt
    from database import SQLALCHEMY_DATABASE_URL
    
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Create a mock attempt
        attempt = Attempt(
            user_id=user_id,
            topic_id=topic_id,
            transcript="This is a test transcript",
            wpm=120.0,
            score=85,
            filler_count=2
        )
        db.add(attempt)
        db.commit()
        print(f"✓ Attempt created successfully!")
    except Exception as e:
        print(f"✗ Error creating attempt: {e}")
        db.rollback()
        db.close()
        return
    finally:
        db.close()
    
    # Step 5: Manually trigger achievement check
    print("\nStep 5: Checking for new achievements...")
    try:
        response = requests.post(f"{BASE_URL}/users/me/achievements/check", headers=headers)
        if response.status_code == 200:
            result = response.json()
            newly_unlocked = result.get("newly_unlocked", [])
            if newly_unlocked:
                print(f"✓ {len(newly_unlocked)} new achievement(s) unlocked!")
                for ach in newly_unlocked:
                    print(f"  🎉 {ach['title']}: {ach['description']}")
            else:
                print("  ℹ No new achievements unlocked")
        else:
            print(f"✗ Failed to check achievements: {response.text}")
    except Exception as e:
        print(f"✗ Error checking achievements: {e}")
    
    # Step 6: Verify final achievements
    print("\nStep 6: Verifying final achievements...")
    try:
        response = requests.get(f"{BASE_URL}/users/me/achievements", headers=headers)
        if response.status_code == 200:
            achievements = response.json()
            
            unlocked_count = sum(1 for a in achievements if a["unlocked"])
            print(f"✓ Total unlocked: {unlocked_count}/{len(achievements)}")
            
            for ach in achievements:
                status = "✓ UNLOCKED" if ach["unlocked"] else "✗ LOCKED"
                print(f"  {status}: {ach['title']}")
        else:
            print(f"✗ Failed to fetch achievements: {response.text}")
    except Exception as e:
        print(f"✗ Error fetching achievements: {e}")
    
    print("\n=== Test Complete ===")

if __name__ == "__main__":
    test_achievement_system()
