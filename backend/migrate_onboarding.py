import sqlite3

def migrate_db():
    conn = sqlite3.connect('talk2me.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT 0")
        print("✅ Successfully added 'onboarding_completed' column to 'users' table.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("⚠️  Column 'onboarding_completed' already exists.")
        else:
            print(f"❌ Error adding column 'onboarding_completed': {e}")

    try:
        cursor.execute("ALTER TABLE users ADD COLUMN onboarding_data JSON")
        print("✅ Successfully added 'onboarding_data' column to 'users' table.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("⚠️  Column 'onboarding_data' already exists.")
        else:
            print(f"❌ Error adding column 'onboarding_data': {e}")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate_db()
