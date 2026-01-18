"""
User Model - Schema and operations for user management
"""

from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
import hashlib
import secrets


# ==================== Pydantic Models ====================

class UserCreate(BaseModel):
    """Schema for creating a new user - matches frontend"""
    username: str = Field(..., min_length=2)
    Email: EmailStr  # Frontend sends 'Email' with capital E
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    """Schema for user login"""
    Email: EmailStr  # Frontend sends 'Email' with capital E
    password: str


class UserResponse(BaseModel):
    """Schema for user response (no password)"""
    id: str
    email: str
    username: str
    plan: str = "free"
    credits_used: int = 0
    credits_limit: int = 1000
    created_at: datetime
    

class UserProfile(BaseModel):
    """Schema for user profile update"""
    username: Optional[str] = None
    avatar_url: Optional[str] = None


# ==================== Password Utilities ====================

def hash_password(password: str) -> str:
    """Hash password using SHA256 with salt"""
    salt = secrets.token_hex(16)
    hashed = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}:{hashed}"


def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    try:
        salt, hash_value = hashed.split(":")
        return hashlib.sha256((password + salt).encode()).hexdigest() == hash_value
    except:
        return False


# ==================== User Database Operations ====================

async def create_user(db, user_data: UserCreate) -> dict:
    """Create a new user in the database"""
    
    # Check if email already exists
    existing = await db.users.find_one({"email": user_data.Email.lower()})
    if existing:
        raise ValueError("Email already registered")
    
    # Check if username already exists
    existing_username = await db.users.find_one({"username": user_data.username.lower()})
    if existing_username:
        raise ValueError("Username already taken")
    
    # Create user document
    user_doc = {
        "email": user_data.Email.lower(),
        "username": user_data.username,
        "password": hash_password(user_data.password),
        "avatar_url": None,
        "plan": "free",
        "credits_used": 0,
        "credits_limit": 1000,  # Free tier: 1000 chars/month
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
        "last_login": None,
        "is_active": True,
        "email_verified": False
    }
    
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    
    return user_doc


async def get_user_by_email(db, email: str) -> Optional[dict]:
    """Get user by email"""
    return await db.users.find_one({"email": email.lower()})


async def get_user_by_id(db, user_id: str) -> Optional[dict]:
    """Get user by ID"""
    from bson import ObjectId
    try:
        return await db.users.find_one({"_id": ObjectId(user_id)})
    except:
        return None


async def update_user(db, user_id: str, updates: dict) -> bool:
    """Update user document"""
    from bson import ObjectId
    
    updates["updated_at"] = datetime.now(timezone.utc)
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": updates}
    )
    
    return result.modified_count > 0


async def update_last_login(db, user_id: str):
    """Update user's last login timestamp"""
    from bson import ObjectId
    
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"last_login": datetime.now(timezone.utc)}}
    )


async def increment_credits_used(db, user_id: str, amount: int) -> bool:
    """Increment user's credits used"""
    from bson import ObjectId
    
    result = await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$inc": {"credits_used": amount}}
    )
    
    return result.modified_count > 0


async def check_credits_available(db, user_id: str, required: int) -> bool:
    """Check if user has enough credits"""
    user = await get_user_by_id(db, user_id)
    if not user:
        return False
    
    # Use 1000 as default limit if missing for backward compatibility
    limit = user.get("credits_limit")
    if limit is None: limit = 1000
    
    used = user.get("credits_used")
    if used is None: used = 0
    
    available = limit - used
    return available >= required


def user_to_response(user: dict) -> dict:
    """Convert user document to response format"""
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "username": user.get("username", ""),
        "avatar_url": user.get("avatar_url"),
        "plan": user.get("plan", "free"),
        "credits_used": user.get("credits_used", 0),
        "credits_limit": user.get("credits_limit", 1000),
        "created_at": user["created_at"].isoformat() if user.get("created_at") else None
    }
