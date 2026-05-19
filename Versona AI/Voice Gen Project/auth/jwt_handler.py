"""
JWT Authentication Utilities
"""

import os
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "your-super-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days


def create_access_token(user_id: str, email: str) -> str:
    """Create a JWT access token"""
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.now(timezone.utc)
    }
    
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> Optional[dict]:
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_user_id_from_token(token: str) -> Optional[str]:
    """Extract user_id from token"""
    payload = verify_token(token)
    if payload:
        return payload.get("user_id")
    return None


def create_password_reset_token(email: str) -> str:
    """Create a password reset token (expires in 1 hour)"""
    payload = {
        "email": email,
        "type": "password_reset",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
        "iat": datetime.now(timezone.utc)
    }
    
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_password_reset_token(token: str) -> Optional[str]:
    """Verify password reset token and return email"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "password_reset":
            return None
        return payload.get("email")
    except:
        return None
