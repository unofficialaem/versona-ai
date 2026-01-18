"""
TTS Routes - Text to Speech API endpoints
Three modes:
1. Manual - Write Urdu text directly
2. Upload - Upload .txt file with Urdu text
3. Database - Use recent/suggested texts
"""

import os
import re
import base64
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List

from routes.auth_routes import get_current_user
from execution.tts import text_to_speech
from database.connection import get_database
from database.models import increment_credits_used, check_credits_available

router = APIRouter(prefix="/tts", tags=["Text to Speech"])

# Ensure temp directory exists
os.makedirs(".tmp/audio", exist_ok=True)


def is_urdu_text(text: str) -> bool:
    """
    Validate that text is primarily in Urdu/Arabic script
    Allows numbers, punctuation, and spaces
    """
    if not text or not text.strip():
        return False
    
    # Urdu Unicode range: \u0600-\u06FF (Arabic) and \u0750-\u077F (Arabic Supplement)
    text_stripped = text.strip()
    urdu_chars = len(re.findall(r'[\u0600-\u06FF\u0750-\u077F]', text_stripped))
    total_alpha = len(re.findall(r'[a-zA-Z\u0600-\u06FF\u0750-\u077F]', text_stripped))
    
    if total_alpha == 0:
        return False
    
    urdu_ratio = urdu_chars / total_alpha
    return urdu_ratio >= 0.8  # Must be at least 80% Urdu characters


# Suggested texts for the database mode
SUGGESTED_TEXTS = [
    "السلام علیکم، میرا نام ورسونا ہے۔",
    "آج کا دن بہت خوبصورت ہے۔",
    "پاکستان زندہ باد!",
    "آپ کا شکریہ۔",
    "خوش آمدید!",
    "اللہ آپ کو خوش رکھے۔",
    "میں آپ کی مدد کیسے کر سکتا ہوں؟",
    "یہ ایک ٹیسٹ پیغام ہے۔"
]


class TTSGenerateRequest(BaseModel):
    """Request model for TTS generation"""
    text: str
    mode: str = "manual"  # "manual", "upload", "database"
    voice_id: Optional[str] = None


class TextSuggestion(BaseModel):
    """Model for text suggestions"""
    id: str
    text: str
    is_recent: bool = False


@router.get("/suggestions/")
async def get_text_suggestions(user: dict = Depends(get_current_user)):
    """Get suggested and recent texts for the database mode"""
    try:
        db = get_database()
        
        # Get user's recent texts (last 10)
        recent_cursor = db.history.find(
            {"user_id": str(user["_id"]), "action": "tts"}
        ).sort("created_at", -1).limit(10)
        
        recent_items = await recent_cursor.to_list(10)
        
        recent_texts = [
            {
                "id": str(item["_id"]),
                "text": item.get("text", ""),
                "is_recent": True
            }
            for item in recent_items if item.get("text")
        ]
        
        # Add suggested texts
        suggested = [
            {
                "id": f"suggested_{i}",
                "text": text,
                "is_recent": False
            }
            for i, text in enumerate(SUGGESTED_TEXTS)
        ]
        
        return {
            "success": True,
            "recent": recent_texts,
            "suggested": suggested
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tts/generate/")
async def generate_tts(
    request: TTSGenerateRequest,
    user: dict = Depends(get_current_user)
):
    """
    Generate speech from text
    Modes: manual, upload, database
    """
    try:
        text = request.text.strip()
        
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        # Validate Urdu language
        if not is_urdu_text(text):
            raise HTTPException(
                status_code=400,
                detail="متن صرف اردو میں ہونا چاہیے۔ (Text must be in Urdu only)"
            )
        
        # Check credits
        text_length = len(text)
        db = get_database()
        
        if not await check_credits_available(db, str(user["_id"]), text_length):
            raise HTTPException(
                status_code=403,
                detail="کریڈٹس کم ہیں۔ پلان اپگریڈ کریں۔ (Not enough credits)"
            )
        
        # Generate audio
        audio_bytes = text_to_speech(text=text, voice_id=request.voice_id)
        
        # Save audio file
        audio_id = uuid.uuid4().hex
        audio_filename = f"tts_{audio_id}.mp3"
        audio_path = f".tmp/audio/{audio_filename}"
        
        with open(audio_path, "wb") as f:
            f.write(audio_bytes)
        
        # Calculate duration estimate
        estimated_duration = len(text) / 15
        
        # Deduct credits
        await increment_credits_used(db, str(user["_id"]), text_length)
        
        # Save to history
        await save_tts_history(
            db,
            user_id=str(user["_id"]),
            mode=request.mode,
            text=text,
            audio_path=audio_path,
            duration=estimated_duration,
            credits_used=text_length
        )
        
        return {
            "success": True,
            "audio_url": f"http://127.0.0.1:8000/tts/audio/{audio_filename}",
            "audio_id": audio_id,
            "duration": round(estimated_duration, 2),
            "sample_rate": 44100,
            "text_length": text_length,
            "credits_used": text_length,
            "spectrogram_url": None,
            "alignment_url": None,
            "visualization_url": None
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload/")
async def upload_text_file(
    file: UploadFile = File(...),
    voice_id: Optional[str] = Form(None),
    user: dict = Depends(get_current_user)
):
    """
    Generate speech from uploaded .txt file
    File must contain Urdu text
    """
    try:
        # Validate file type
        if not file.filename.endswith('.txt'):
            raise HTTPException(
                status_code=400, 
                detail="Only .txt files are allowed"
            )
        
        # Read file content
        content = await file.read()
        
        # File size limit (1MB)
        if len(content) > 1024 * 1024:
            raise HTTPException(
                status_code=400, 
                detail="File too large. Max 1MB allowed."
            )
        
        # Decode text (try UTF-8 first, then UTF-16)
        try:
            text = content.decode('utf-8')
        except UnicodeDecodeError:
            try:
                text = content.decode('utf-16')
            except UnicodeDecodeError:
                raise HTTPException(
                    status_code=400,
                    detail="Could not decode file. Please use UTF-8 encoding."
                )
        
        text = text.strip()
        
        if not text:
            raise HTTPException(status_code=400, detail="File is empty")
        
        # Validate Urdu language
        if not is_urdu_text(text):
            raise HTTPException(
                status_code=400,
                detail="فائل میں صرف اردو متن ہونا چاہیے۔ (File must contain Urdu text only)"
            )
        
        # Check credits
        text_length = len(text)
        db = get_database()
        
        if not await check_credits_available(db, str(user["_id"]), text_length):
            raise HTTPException(
                status_code=403,
                detail="کریڈٹس کم ہیں۔ (Not enough credits)"
            )
        
        # Generate audio
        audio_bytes = text_to_speech(text=text, voice_id=voice_id)
        
        # Save audio file
        audio_id = uuid.uuid4().hex
        audio_filename = f"tts_{audio_id}.mp3"
        audio_path = f".tmp/audio/{audio_filename}"
        
        with open(audio_path, "wb") as f:
            f.write(audio_bytes)
        
        estimated_duration = len(text) / 15
        
        # Deduct credits
        await increment_credits_used(db, str(user["_id"]), text_length)
        
        # Save to history
        await save_tts_history(
            db,
            user_id=str(user["_id"]),
            mode="upload",
            text=text,
            audio_path=audio_path,
            duration=estimated_duration,
            credits_used=text_length
        )
        
        return {
            "success": True,
            "audio_url": f"http://127.0.0.1:8000/tts/audio/{audio_filename}",
            "audio_id": audio_id,
            "duration": round(estimated_duration, 2),
            "text_length": text_length,
            "credits_used": text_length
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/audio/{filename}")
async def get_audio_file(filename: str):
    """Serve generated audio files"""
    file_path = f".tmp/audio/{filename}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(
        file_path,
        media_type="audio/mpeg",
        filename=filename
    )


@router.post("/validate/")
async def validate_urdu_text(text: str):
    """Validate if text is in Urdu"""
    is_valid = is_urdu_text(text)
    
    return {
        "success": True,
        "is_urdu": is_valid,
        "message": "متن درست ہے۔" if is_valid else "متن صرف اردو میں ہونا چاہیے۔"
    }


async def save_tts_history(db, user_id: str, mode: str, text: str,
                           audio_path: str, duration: float, credits_used: int):
    """Save TTS generation to user history"""
    history_doc = {
        "user_id": user_id,
        "action": "tts",
        "mode": mode,
        "text": text[:200] + "..." if len(text) > 200 else text,
        "full_text_length": len(text),
        "audio_path": audio_path,
        "duration": duration,
        "credits_used": credits_used,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.history.insert_one(history_doc)
