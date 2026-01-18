"""
Database Configuration - MongoDB Connection
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection string
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "versona_ai")

# Global database client
client = None
database = None


async def connect_to_mongodb():
    """Connect to MongoDB database"""
    global client, database
    
    try:
        client = AsyncIOMotorClient(MONGODB_URI)
        database = client[DATABASE_NAME]
        
        # Verify connection
        await client.admin.command('ping')
        print(f"✅ Connected to MongoDB: {DATABASE_NAME}")
        
        # Create indexes
        await create_indexes()
        
        return database
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        raise


async def close_mongodb_connection():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("📦 MongoDB connection closed")


async def create_indexes():
    """Create necessary indexes for performance"""
    global database
    
    if database is None:
        return
    
    # Users collection indexes
    await database.users.create_index("email", unique=True)
    await database.users.create_index("created_at")
    
    # History collection indexes
    await database.history.create_index("user_id")
    await database.history.create_index("created_at")
    await database.history.create_index([("user_id", 1), ("created_at", -1)])
    
    # Voices collection indexes
    await database.voices.create_index("user_id")
    await database.voices.create_index("elevenlabs_id", unique=True, sparse=True)
    
    print("📇 Database indexes created")


def get_database():
    """Get database instance"""
    global database
    if database is None:
        raise Exception("Database not connected. Call connect_to_mongodb() first.")
    return database


# Collection shortcuts
def get_users_collection():
    return get_database().users


def get_history_collection():
    return get_database().history


def get_voices_collection():
    return get_database().voices
