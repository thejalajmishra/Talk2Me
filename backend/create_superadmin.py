#!/usr/bin/env python3
"""
Script to create a superadmin user in the database.
Usage: python create_superadmin.py
"""

from database import SessionLocal
from models import User
from auth import get_password_hash

def create_superadmin():
    db = SessionLocal()
    try:
        # Check if superadmin already exists
        existing_admin = db.query(User).filter(User.is_superadmin == True).first()
        if existing_admin:
            print(f"Superadmin already exists: {existing_admin.username} ({existing_admin.email})")
            return
        
        # Create superadmin
        username = input("Enter superadmin username: ")
        email = input("Enter superadmin email: ")
        password = input("Enter superadmin password: ")
        
        # Check if user with this email/username exists
        existing_user = db.query(User).filter(
            (User.email == email) | (User.username == username)
        ).first()
        
        if existing_user:
            # Upgrade existing user to superadmin
            existing_user.is_superadmin = True
            db.commit()
            print(f"Upgraded existing user '{existing_user.username}' to superadmin!")
        else:
            # Create new superadmin
            superadmin = User(
                username=username,
                email=email,
                hashed_password=get_password_hash(password),
                is_superadmin=True
            )
            db.add(superadmin)
            db.commit()
            print(f"Superadmin '{username}' created successfully!")
            
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_superadmin()
