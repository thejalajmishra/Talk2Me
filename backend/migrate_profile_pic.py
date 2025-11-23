import sqlite3

# Connect to the database
conn = sqlite3.connect('talk2me.db')
cursor = conn.cursor()

try:
    # Add profile_picture column to users table
    cursor.execute("ALTER TABLE users ADD COLUMN profile_picture TEXT")
    print("Successfully added profile_picture column to users table.")
except sqlite3.OperationalError as e:
    print(f"Error: {e}")
    print("Column might already exist.")

# Commit changes and close connection
conn.commit()
conn.close()
