"""
History Routes - User generation history and analytics
"""

from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional

from routes.auth_routes import get_current_user
from database.connection import get_database

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/")
async def get_history(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    action: Optional[str] = Query(None, description="Filter: tts, sts, voice_cloning"),
    user: dict = Depends(get_current_user)
):
    """Get user's generation history with pagination"""
    try:
        db = get_database()
        
        # Build query
        query = {"user_id": str(user["_id"])}
        if action:
            query["action"] = action
        
        # Get total count
        total = await db.history.count_documents(query)
        
        # Get paginated results
        skip = (page - 1) * limit
        cursor = db.history.find(query).sort("created_at", -1).skip(skip).limit(limit)
        items = await cursor.to_list(limit)
        
        return {
            "success": True,
            "items": [
                {
                    "id": str(item["_id"]),
                    "action": item["action"],
                    "text": item.get("text"),
                    "voice_name": item.get("voice_name"),
                    "voice_type": item.get("voice_type"),
                    "duration": item.get("duration"),
                    "credits_used": item.get("credits_used", 0),
                    "mode": item.get("mode"),
                    "audio_path": item.get("audio_path"),
                    "created_at": item["created_at"].isoformat() if item.get("created_at") else None
                }
                for item in items
            ],
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit if total > 0 else 0
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def get_history_stats(user: dict = Depends(get_current_user)):
    """Get user's usage statistics for Overview dashboard"""
    try:
        db = get_database()
        user_id = str(user["_id"])
        
        # Count by action type
        tts_count = await db.history.count_documents({"user_id": user_id, "action": "tts"})
        sts_count = await db.history.count_documents({"user_id": user_id, "action": "sts"})
        clone_count = await db.history.count_documents({"user_id": user_id, "action": "voice_cloning"})
        
        # Get total credits used from user document
        credits_used = user.get("credits_used", 0)
        credits_limit = user.get("credits_limit", 1000)
        credits_remaining = credits_limit - credits_used
        
        # Get recent activity (last 7 days)
        week_ago = datetime.now(timezone.utc) - timedelta(days=7)
        recent_count = await db.history.count_documents({
            "user_id": user_id,
            "created_at": {"$gte": week_ago}
        })
        
        # Get activity by day for the last 7 days
        daily_activity = []
        for i in range(7):
            day_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=i)
            day_end = day_start + timedelta(days=1)
            
            count = await db.history.count_documents({
                "user_id": user_id,
                "created_at": {"$gte": day_start, "$lt": day_end}
            })
            
            daily_activity.append({
                "date": day_start.strftime("%Y-%m-%d"),
                "day": day_start.strftime("%a"),
                "count": count
            })
        
        daily_activity.reverse()  # Oldest to newest
        
        # Get most used feature
        features = [
            ("Text to Speech", tts_count),
            ("Audio to Audio", sts_count),
            ("Voice Cloning", clone_count)
        ]
        most_used = max(features, key=lambda x: x[1]) if any(x[1] > 0 for x in features) else ("None", 0)
        
        return {
            "success": True,
            "stats": {
                "tts_generations": tts_count,
                "sts_conversions": sts_count,
                "voice_cloning": clone_count,
                "total_generations": tts_count + sts_count + clone_count,
                "credits_used": credits_used,
                "credits_limit": credits_limit,
                "credits_remaining": credits_remaining,
                "credits_percentage": round((credits_used / credits_limit) * 100, 1) if credits_limit > 0 else 0,
                "recent_activity_7d": recent_count,
                "most_used_feature": most_used[0],
                "daily_activity": daily_activity
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/recent")
async def get_recent_generations(
    limit: int = Query(5, ge=1, le=20),
    user: dict = Depends(get_current_user)
):
    """Get user's most recent generations for quick access"""
    try:
        db = get_database()
        
        cursor = db.history.find(
            {"user_id": str(user["_id"])}
        ).sort("created_at", -1).limit(limit)
        
        items = await cursor.to_list(limit)
        
        return {
            "success": True,
            "items": [
                {
                    "id": str(item["_id"]),
                    "action": item["action"],
                    "text": item.get("text", "")[:50] + "..." if len(item.get("text", "")) > 50 else item.get("text", ""),
                    "voice_name": item.get("voice_name"),
                    "created_at": item["created_at"].isoformat() if item.get("created_at") else None,
                    "audio_path": item.get("audio_path")
                }
                for item in items
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{item_id}")
async def delete_history_item(
    item_id: str,
    user: dict = Depends(get_current_user)
):
    """Delete a history item"""
    try:
        from bson import ObjectId
        
        db = get_database()
        
        # Verify ownership and delete
        result = await db.history.delete_one({
            "_id": ObjectId(item_id),
            "user_id": str(user["_id"])
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="History item not found")
        
        return {
            "success": True,
            "message": "History item deleted"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/")
async def clear_history(user: dict = Depends(get_current_user)):
    """Clear all user's history"""
    try:
        db = get_database()
        
        result = await db.history.delete_many({"user_id": str(user["_id"])})
        
        return {
            "success": True,
            "message": f"Deleted {result.deleted_count} history items"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
