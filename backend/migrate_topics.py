"""
Migration script to add is_custom and created_by fields to existing topics
"""
from sqlalchemy import create_engine, text
from database import SQLALCHEMY_DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)

def migrate():
    with engine.connect() as conn:
        # Check if columns exist
        try:
            # Try to add is_custom column
            conn.execute(text("ALTER TABLE topics ADD COLUMN is_custom BOOLEAN DEFAULT FALSE"))
            print("Added is_custom column")
        except Exception as e:
            print(f"is_custom column might already exist: {e}")
        
        try:
            # Try to add created_by column
            conn.execute(text("ALTER TABLE topics ADD COLUMN created_by INTEGER"))
            print("Added created_by column")
        except Exception as e:
            print(f"created_by column might already exist: {e}")
        
        # Update existing topics to have is_custom = False
        try:
            conn.execute(text("UPDATE topics SET is_custom = FALSE WHERE is_custom IS NULL"))
            conn.commit()
            print("Updated existing topics with is_custom = FALSE")
        except Exception as e:
            print(f"Error updating topics: {e}")

if __name__ == "__main__":
    migrate()
    print("Migration completed!")
