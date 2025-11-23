import sqlite3

def migrate_db():
    conn = sqlite3.connect('talk2me.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE topics ADD COLUMN time_limit INTEGER DEFAULT 60")
        print("✅ Successfully added 'time_limit' column to 'topics' table.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("⚠️ Column 'time_limit' already exists.")
        else:
            print(f"❌ Error adding column: {e}")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate_db()
