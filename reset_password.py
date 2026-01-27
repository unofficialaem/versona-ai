"""Reset password for a user in MongoDB - uses SHA256 (same as app)"""
from motor.motor_asyncio import AsyncIOMotorClient
import hashlib
import secrets
import asyncio

def hash_password(password: str) -> str:
    """Hash password using SHA256 with salt (same as user.py)"""
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}:{hashed}"

async def reset_password():
    # Connect to MongoDB Atlas
    client = AsyncIOMotorClient("mongodb+srv://versonaadmin:TIHRBCjj7Jon6ui4@versonacluster.pftdn34.mongodb.net/versona_ai?retryWrites=true&w=majority&appName=VersonaCluster")
    db = client.versona_ai
    
    # === CHANGE THESE VALUES ===
    email = "painthe09@gmail.com"  # Which user to reset
    new_password = "test123"        # New password
    # ===========================
    
    # Hash the password using SHA256 (same method as app)
    hashed = hash_password(new_password)
    
    # Update in database
    result = await db.users.update_one(
        {"email": email},
        {"$set": {"password": hashed}}
    )
    
    if result.modified_count > 0:
        print(f"Password reset SUCCESS!")
        print(f"Email: {email}")
        print(f"Password: {new_password}")
    else:
        # Check if user exists
        user = await db.users.find_one({"email": email})
        if user:
            print("User found but password not changed (may already be set)")
        else:
            print(f"User not found: {email}")
            print("Available users:")
            users = await db.users.find().to_list(100)
            for u in users:
                print(f"  - {u.get('email')}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(reset_password())
