"""
STS Routes - Audio to Audio (Speech to Speech)
User selects male/female voice, uploads audio, generates converted audio
"""

import os
import base64
import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import FileResponse
from typing import Optional

from routes.auth_routes import get_current_user
from execution.sts import speech_to_speech
from database.connection import get_database

router = APIRouter(prefix="/sts", tags=["Audio to Audio"])

# Ensure temp directories exist
os.makedirs(".tmp/audio", exist_ok=True)
os.makedirs(".tmp/sts_input", exist_ok=True)

# Voice ID mappings for male/female voices
# These should be ElevenLabs voice IDs - update with your actual voice IDs
VOICE_MAPPINGS = {
    "male": os.getenv("ELEVENLABS_MALE_VOICE_ID", "pNInz6obpgDQGcFmaJgB"),  # Default: Adam
    "female": os.getenv("ELEVENLABS_FEMALE_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Default: Rachel
}


@router.get("/voices/")
async def get_sts_voices():
    """Get available voices for STS (male/female options)"""
    return {
        "success": True,
        "voices": [
            {
                "id": "male",
                "name": "Male Voice",
                "description": "Deep, clear male narration"
            },
            {
                "id": "female", 
                "name": "Female Voice",
                "description": "Soft, expressive female voice"
            }
        ]
    }


@router.post("/convert/")
async def convert_audio(
    file: UploadFile = File(...),
    voice_type: str = Form(...),  # "male" or "female"
    user: dict = Depends(get_current_user)
):
    """
    Convert audio from one voice to another
    - voice_type: "male" or "female"
    """
    try:
        # Validate voice type
        if voice_type not in VOICE_MAPPINGS:
            raise HTTPException(
                status_code=400, 
                detail="Invalid voice type. Must be 'male' or 'female'"
            )
        
        # Validate file type
        if not file.content_type or not file.content_type.startswith("audio/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an audio file.")
        
        # Save uploaded file
        input_id = uuid.uuid4().hex
        input_path = f".tmp/sts_input/{input_id}.mp3"
        
        content = await file.read()
        
        # File size limit (10MB)
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Max 10MB allowed.")
        
        with open(input_path, "wb") as f:
            f.write(content)
        
        # Get actual ElevenLabs voice ID
        voice_id = VOICE_MAPPINGS[voice_type]
        
        # Convert using ElevenLabs STS
        audio_bytes = speech_to_speech(input_path, voice_id)
        
        # Clean up input file
        os.remove(input_path)
        
        # Save output audio
        output_id = uuid.uuid4().hex
        output_filename = f"sts_{output_id}.mp3"
        output_path = f".tmp/audio/{output_filename}"
        
        with open(output_path, "wb") as f:
            f.write(audio_bytes)
        
        # Save to history
        db = get_database()
        await save_sts_history(
            db,
            user_id=str(user["_id"]),
            voice_type=voice_type,
            input_size=len(content),
            output_size=len(audio_bytes),
            output_path=output_path
        )
        
        return {
            "success": True,
            "audio_url": f"http://127.0.0.1:8000/sts/audio/{output_filename}",
            "audio_id": output_id,
            "voice_type": voice_type,
            "input_size": len(content),
            "output_size": len(audio_bytes)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/audio/{filename}")
async def get_sts_audio(filename: str):
    """Serve converted audio files"""
    file_path = f".tmp/audio/{filename}"
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(
        file_path,
        media_type="audio/mpeg",
        filename=filename
    )


async def save_sts_history(db, user_id: str, voice_type: str, 
                           input_size: int, output_size: int, output_path: str):
    """Save STS conversion to user history"""
    history_doc = {
        "user_id": user_id,
        "action": "sts",
        "voice_type": voice_type,
        "input_size": input_size,
        "output_size": output_size,
        "audio_path": output_path,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.history.insert_one(history_doc)
