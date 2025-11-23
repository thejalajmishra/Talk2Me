from sqlalchemy import create_engine, text
import os

# Database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./talk2me.db"

def migrate():
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    with engine.connect() as conn:
        print("Running migration to add streak columns...")
        try:
            # Add current_streak column
            conn.execute(text("ALTER TABLE users ADD COLUMN current_streak INTEGER DEFAULT 0"))
            print("Added current_streak column.")
        except Exception as e:
            print(f"Error adding current_streak (might already exist): {e}")

        try:
            # Add last_practice_date column
            conn.execute(text("ALTER TABLE users ADD COLUMN last_practice_date DATETIME"))
            print("Added last_practice_date column.")
        except Exception as e:
            print(f"Error adding last_practice_date (might already exist): {e}")
            
        print("Migration complete.")

if __name__ == "__main__":
    migrate()
