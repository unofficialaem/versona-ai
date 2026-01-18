"""
Authentication Routes - Login, Signup, Password Reset
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional

from database.models import (
    UserCreate, UserLogin, 
    create_user, get_user_by_email, update_last_login,
    verify_password, user_to_response, hash_password, update_user
)
from database.connection import get_database
from auth.jwt_handler import (
    create_access_token, verify_token, 
    create_password_reset_token, verify_password_reset_token
)

router = APIRouter(prefix="/api", tags=["Authentication"])


async def get_current_user(authorization: Optional[str] = Header(None)):
    """Dependency to get current authenticated user"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Extract token from "Bearer <token>"
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    db = get_database()
    from database.models import get_user_by_id
    user = await get_user_by_id(db, payload["user_id"])
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user


@router.post("/signup/")
@router.post("/register/")  # Alias for frontend compatibility
async def signup(user_data: UserCreate):
    """Register a new user"""
    try:
        db = get_database()
        user = await create_user(db, user_data)
        
        # Create token
        token = create_access_token(str(user["_id"]), user["email"])
        
        return {
            "success": True,
            "message": "Account created successfully",
            "token": token,
            "user_info": user_to_response(user)
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login/")
async def login(credentials: UserLogin):
    """Login user and return token"""
    try:
        db = get_database()
        
        # Get user by email (frontend sends 'Email' with capital E)
        user = await get_user_by_email(db, credentials.Email)
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        if not verify_password(credentials.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Check if user is active
        if not user.get("is_active", True):
            raise HTTPException(status_code=401, detail="Account is deactivated")
        
        # Update last login
        await update_last_login(db, str(user["_id"]))
        
        # Create token
        token = create_access_token(str(user["_id"]), user["email"])
        
        return {
            "success": True,
            "message": "Login successful",
            "token": token,
            "user_info": user_to_response(user)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/forgot-password/")
async def forgot_password(email: str):
    """Request password reset link"""
    try:
        db = get_database()
        user = await get_user_by_email(db, email)
        
        # Always return success (don't reveal if email exists)
        if user:
            reset_token = create_password_reset_token(email)
            # In production, send this via email
            # For now, we'll just return it
            print(f"Password reset token for {email}: {reset_token}")
        
        return {
            "success": True,
            "message": "If an account exists for this email, a password reset link has been sent."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/reset-password/")
async def reset_password(token: str, new_password: str):
    """Reset password using token"""
    try:
        email = verify_password_reset_token(token)
        if not email:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
        db = get_database()
        user = await get_user_by_email(db, email)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update password
        new_hash = hash_password(new_password)
        await update_user(db, str(user["_id"]), {"password": new_hash})
        
        return {
            "success": True,
            "message": "Password has been reset successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile/")
async def get_profile(user: dict = Depends(get_current_user)):
    """Get current user's profile with all details"""
    return {
        "success": True,
        "user": user_to_response(user),
        "account": {
            "plan": user.get("plan", "free"),
            "credits_used": user.get("credits_used", 0),
            "credits_limit": user.get("credits_limit", 1000),
            "credits_remaining": user.get("credits_limit", 1000) - user.get("credits_used", 0),
            "email_verified": user.get("email_verified", False),
            "created_at": user["created_at"].isoformat() if user.get("created_at") else None,
            "last_login": user["last_login"].isoformat() if user.get("last_login") else None
        }
    }


@router.put("/profile/")
@router.put("/updateprofile/")  # Alias for frontend compatibility
async def update_profile(
    updates: dict,
    user: dict = Depends(get_current_user)
):
    """Update user profile"""
    try:
        db = get_database()
        
        # Only allow updating certain fields
        allowed_fields = ["username", "avatar_url"]
        safe_updates = {k: v for k, v in updates.items() if k in allowed_fields}
        
        if not safe_updates:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        # Check if username is being changed and if it's already taken
        if "username" in safe_updates:
            existing = await db.users.find_one({
                "username": safe_updates["username"].lower(),
                "_id": {"$ne": user["_id"]}
            })
            if existing:
                raise HTTPException(status_code=400, detail="Username already taken")
        
        await update_user(db, str(user["_id"]), safe_updates)
        
        # Get updated user
        from database.models import get_user_by_id
        updated_user = await get_user_by_id(db, str(user["_id"]))
        
        return {
            "success": True,
            "message": "Profile updated",
            "user": user_to_response(updated_user)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/profile/change-password/")
@router.post("/change_password/")  # Alias for frontend
async def change_password(
    data: dict,  # Expecting old_password, new_password, confirm_password
    user: dict = Depends(get_current_user)
):
    """Change user's password"""
    try:
        old_password = data.get("old_password")
        new_password = data.get("new_password")
        confirm_password = data.get("confirm_password")

        if not old_password or not new_password:
            raise HTTPException(status_code=400, detail="Missing required fields")

        if new_password != confirm_password:
            raise HTTPException(status_code=400, detail="New passwords do not match")

        # Verify current password
        if not verify_password(old_password, user["password"]):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Validate new password
        if len(new_password) < 6:
            raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
        
        # Update password
        db = get_database()
        new_hash = hash_password(new_password)
        await update_user(db, str(user["_id"]), {"password": new_hash})
        
        return {
            "success": True,
            "message": "Password changed successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/profile/")
async def delete_account(
    password: str,
    user: dict = Depends(get_current_user)
):
    """Delete user's account (requires password confirmation)"""
    try:
        # Verify password
        if not verify_password(password, user["password"]):
            raise HTTPException(status_code=400, detail="Password is incorrect")
        
        db = get_database()
        user_id = str(user["_id"])
        
        # Delete user's history
        await db.history.delete_many({"user_id": user_id})
        
        # Delete user's voices
        await db.voices.delete_many({"user_id": user_id})
        
        # Delete user
        from bson import ObjectId
        await db.users.delete_one({"_id": ObjectId(user_id)})
        
        return {
            "success": True,
            "message": "Account deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
