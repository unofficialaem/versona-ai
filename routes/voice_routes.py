"""
Voice Cloning Routes - TTS with Premium Cloned Voices
User selects one of 3 preset female voices (Mareeb, Aleeza, Eiza),
writes Urdu text, and generates speech
"""

import os
import re
import base64
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

from routes.auth_routes import get_current_user
from execution.tts import text_to_speech
from database.connection import get_database
from database.models import increment_credits_used, check_credits_available

router = APIRouter(prefix="/voice-cloning", tags=["Voice Cloning"])

# Ensure temp directory exists
os.makedirs(".tmp/audio", exist_ok=True)

# Premium cloned voice mappings
# These are the 3 female voices - update with actual ElevenLabs voice IDs
CLONED_VOICES = {
    "mareeb": {
        "id": "mareeb",
        "name": "Mareeb",
        "description": "Warm, confident female voice",
        "elevenlabs_id": os.getenv("VOICE_MAREEB_ID", "21m00Tcm4TlvDq8ikWAM")  # Placeholder
    },
    "aleeza": {
        "id": "aleeza", 
        "name": "Aleeza",
        "description": "Soft, elegant female voice",
        "elevenlabs_id": os.getenv("VOICE_ALEEZA_ID", "21m00Tcm4TlvDq8ikWAM")  # Placeholder
    },
    "eiza": {
        "id": "eiza",
        "name": "Eiza", 
        "description": "Clear, expressive female voice",
        "elevenlabs_id": os.getenv("VOICE_EIZA_ID", "21m00Tcm4TlvDq8ikWAM")  # Placeholder
    }
}


def is_urdu_text(text: str) -> bool:
    """
    Validate that text is primarily in Urdu/Arabic script
    Allows numbers, punctuation, and spaces
    """
    if not text or not text.strip():
        return False
    
    # Urdu Unicode range: \u0600-\u06FF (Arabic) and \u0750-\u077F (Arabic Supplement)
    # Also allow common punctuation, numbers, and spaces
    urdu_pattern = re.compile(r'^[\u0600-\u06FF\u0750-\u077F\s\d.,!?؟،؛:\-\(\)\[\]\"\']+$')
    
    # Check if at least 50% of alphabetic characters are Urdu
    text_stripped = text.strip()
    urdu_chars = len(re.findall(r'[\u0600-\u06FF\u0750-\u077F]', text_stripped))
    total_alpha = len(re.findall(r'[a-zA-Z\u0600-\u06FF\u0750-\u077F]', text_stripped))
    
    if total_alpha == 0:
        return False
    
    urdu_ratio = urdu_chars / total_alpha
    return urdu_ratio >= 0.8  # Must be at least 80% Urdu characters


class VoiceCloningRequest(BaseModel):
    """Request model for voice cloning generation"""
    voice_id: str  # "mareeb", "aleeza", or "eiza"
    text: str


@router.get("/voices/")
async def get_cloned_voices():
    """Get available premium cloned voices"""
    return {
        "success": True,
        "voices": [
            {
                "id": voice["id"],
                "name": voice["name"],
                "description": voice["description"]
            }
            for voice in CLONED_VOICES.values()
        ]
    }


@router.post("/generate/")
async def generate_cloned_voice(
    request: VoiceCloningRequest,
    user: dict = Depends(get_current_user)
):
    """
    Generate speech using a premium cloned voice
    - Must select one of 3 preset voices
    - Text must be in Urdu
    """
    try:
        text = request.text.strip()
        voice_id = request.voice_id.lower()
        
        # Validate voice selection
        if voice_id not in CLONED_VOICES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid voice. Choose from: {', '.join(CLONED_VOICES.keys())}"
            )
        
        # Validate text is not empty
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
        
        # Get ElevenLabs voice ID
        elevenlabs_voice_id = CLONED_VOICES[voice_id]["elevenlabs_id"]
        
        # Generate audio
        audio_bytes = text_to_speech(text=text, voice_id=elevenlabs_voice_id)
        
        # Save audio file
        audio_id = uuid.uuid4().hex
        audio_filename = f"clone_{audio_id}.mp3"
        audio_path = f".tmp/audio/{audio_filename}"
        
        with open(audio_path, "wb") as f:
            f.write(audio_bytes)
        
        # Deduct credits
        await increment_credits_used(db, str(user["_id"]), text_length)
        
        # Save to history
        await save_clone_history(
            db,
            user_id=str(user["_id"]),
            voice_id=voice_id,
            voice_name=CLONED_VOICES[voice_id]["name"],
            text=text,
            audio_path=audio_path,
            credits_used=text_length
        )
        
        return {
            "success": True,
            "audio_url": f"http://127.0.0.1:8000/voice-cloning/audio/{audio_filename}",
            "audio_id": audio_id,
            "voice": CLONED_VOICES[voice_id]["name"],
            "text_length": text_length,
            "credits_used": text_length
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/audio/{filename}")
async def get_cloned_audio(filename: str):
    """Serve generated audio files"""
    file_path = f".tmp/audio/{filename}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    from fastapi.responses import FileResponse
    return FileResponse(
        file_path,
        media_type="audio/mpeg",
        filename=filename
    )


async def save_clone_history(db, user_id: str, voice_id: str, voice_name: str,
                             text: str, audio_path: str, credits_used: int):
    """Save voice cloning generation to user history"""
    history_doc = {
        "user_id": user_id,
        "action": "voice_cloning",
        "voice_id": voice_id,
        "voice_name": voice_name,
        "text": text[:200] + "..." if len(text) > 200 else text,
        "full_text_length": len(text),
        "audio_path": audio_path,
        "credits_used": credits_used,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.history.insert_one(history_doc)
