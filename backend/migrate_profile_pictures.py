"""
Migration script to assign default profile pictures to existing users
"""
from sqlalchemy import create_engine, text
from database import SQLALCHEMY_DATABASE_URL

def migrate_profile_pictures():
    """Assign default profile picture (avatar1) to all users who don't have one"""
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={'check_same_thread': False})
    
    with engine.connect() as conn:
        # Update all users with NULL profile_picture to 'avatar1'
        result = conn.execute(
            text("UPDATE users SET profile_picture = 'avatar1' WHERE profile_picture IS NULL")
        )
        conn.commit()
        
        rows_updated = result.rowcount
        print(f"✓ Updated {rows_updated} users with default profile picture (avatar1)")
        
        # Show total users with profile pictures
        total_result = conn.execute(text("SELECT COUNT(*) FROM users"))
        total_users = total_result.fetchone()[0]
        print(f"✓ Total users in database: {total_users}")
        
        # Show breakdown by avatar
        avatar_breakdown = conn.execute(
            text("SELECT profile_picture, COUNT(*) as count FROM users GROUP BY profile_picture")
        )
        print("\nProfile picture distribution:")
        for row in avatar_breakdown:
            print(f"  - {row[0]}: {row[1]} users")

if __name__ == "__main__":
    print("Starting profile picture migration...")
    migrate_profile_pictures()
    print("\n✅ Migration complete!")
