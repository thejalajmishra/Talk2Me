from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, User
from auth import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

def create_superadmin():
    db = SessionLocal()
    try:
        # Check if superadmin already exists
        existing_admin = db.query(User).filter(User.email == "admin@talk2me.com").first()
        if existing_admin:
            print("Superadmin already exists!")
            print(f"Username: {existing_admin.username}")
            print(f"Email: {existing_admin.email}")
            return
        
        # Create superadmin with default credentials
        username = "admin"
        email = "admin@talk2me.com"
        password = "admin123"
        
        hashed_password = get_password_hash(password)
        
        superadmin = User(
            username=username,
            email=email,
            hashed_password=hashed_password,
            is_superadmin=True
        )
        
        db.add(superadmin)
        db.commit()
        db.refresh(superadmin)
        
        print("✅ Superadmin created successfully!")
        print(f"Username: {username}")
        print(f"Email: {email}")
        print(f"Password: {password}")
        print("\n⚠️  Please change the password after first login!")
        
    except Exception as e:
        print(f"Error creating superadmin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_superadmin()
