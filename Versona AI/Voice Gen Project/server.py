"""
Versona AI - Backend API Server
FastAPI server connecting frontend to ElevenLabs APIs with MongoDB
"""

import os
import io
import base64
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our execution scripts
from execution.tts import text_to_speech
from execution.clone_voice import clone_voice, list_voices, delete_voice

# Database connection
from database.connection import connect_to_mongodb, close_mongodb_connection

# Auth routes
from routes.auth_routes import router as auth_router
from routes.tts_routes import router as tts_router
from routes.sts_routes import router as sts_router
from routes.voice_routes import router as voice_router
from routes.history_routes import router as history_router


# Lifespan handler for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await connect_to_mongodb()
    except Exception as e:
        print(f"⚠️ MongoDB not connected: {e}")
        print("   Auth features will not work until MongoDB is running")
    yield
    # Shutdown
    await close_mongodb_connection()


app = FastAPI(
    title="Versona AI", 
    description="Urdu Voice Generation Platform",
    lifespan=lifespan
)

# Enable CORS for frontend - MUST be before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes
app.include_router(auth_router)
app.include_router(tts_router)
app.include_router(sts_router)
app.include_router(voice_router)
app.include_router(history_router)

# Static files for audio
from fastapi.staticfiles import StaticFiles
app.mount("/static/audio", StaticFiles(directory=".tmp/audio"), name="static_audio")


# ==================== Models ====================

class TTSRequest(BaseModel):
    text: str
    voice_id: str = None
    speed: float = 1.0


class STSRequest(BaseModel):
    voice_id: str


# ==================== Routes ====================

@app.get("/")
def root():
    return {"message": "Awaaz AI API", "status": "running"}


@app.get("/api/health")
def health_check():
    """Check if API keys are configured"""
    return {
        "status": "ok",
        "elevenlabs": bool(os.getenv("ELEVENLABS_API_KEY")),
        "mongodb": bool(os.getenv("MONGODB_URI"))
    }


# ==================== TTS ====================

@app.post("/api/tts")
async def generate_tts(request: TTSRequest):
    """Convert text to speech"""
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        # Generate audio
        audio_bytes = text_to_speech(
            text=request.text,
            voice_id=request.voice_id
        )
        
        # Return as base64 for easy frontend handling
        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
        
        return {
            "success": True,
            "audio": audio_base64,
            "format": "mp3",
            "size": len(audio_bytes)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/tts/stream")
async def stream_tts(request: TTSRequest):
    """Stream TTS audio"""
    try:
        audio_bytes = text_to_speech(
            text=request.text,
            voice_id=request.voice_id
        )
        
        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "attachment; filename=speech.mp3"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# ==================== STS ====================

@app.post("/api/sts")
async def convert_voice(
    file: UploadFile = File(...),
    voice_id: str = Form(...)
):
    """Convert speech from one voice to another"""
    try:
        # Save uploaded file temporarily
        temp_path = f".tmp/sts_input_{uuid.uuid4().hex}.mp3"
        
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Import and use STS
        from execution.sts import speech_to_speech
        
        audio_bytes = speech_to_speech(temp_path, voice_id)
        
        # Cleanup
        os.remove(temp_path)
        
        # Return as base64
        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
        
        return {
            "success": True,
            "audio": audio_base64,
            "format": "mp3",
            "size": len(audio_bytes)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Voice Cloning ====================

@app.post("/api/clone")
async def clone_new_voice(
    name: str = Form(...),
    file: UploadFile = File(...)
):
    """Clone a voice from audio sample"""
    try:
        # Save uploaded file temporarily
        temp_path = f".tmp/clone_{uuid.uuid4().hex}.mp3"
        
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Clone voice
        result = clone_voice(name, [temp_path])
        
        # Cleanup
        os.remove(temp_path)
        
        return {
            "success": True,
            "voice_id": result.get("voice_id"),
            "name": name
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/voices")
async def get_voices():
    """Get list of all available voices"""
    try:
        voices = list_voices()
        
        # Format for frontend
        formatted = []
        for v in voices:
            formatted.append({
                "id": v.get("voice_id"),
                "name": v.get("name"),
                "category": v.get("category", "premade"),
                "preview_url": v.get("preview_url")
            })
        
        return {
            "success": True,
            "voices": formatted
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/voices/{voice_id}")
async def remove_voice(voice_id: str):
    """Delete a cloned voice"""
    try:
        delete_voice(voice_id)
        return {"success": True, "message": f"Voice {voice_id} deleted"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Admin Analytics (Protected) ====================

# Simple admin key check (in production, use proper auth)
ADMIN_KEY = os.getenv("ADMIN_KEY", "admin123")

def verify_admin(key: str):
    """Verify admin access"""
    if key != ADMIN_KEY:
        raise HTTPException(status_code=403, detail="Admin access required")


@app.get("/api/admin/analytics")
async def get_analytics(admin_key: str = ""):
    """Get complete admin analytics dashboard"""
    verify_admin(admin_key)
    
    try:
        from execution.analytics import get_admin_dashboard
        return get_admin_dashboard()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/admin/elevenlabs")
async def get_elevenlabs_usage(admin_key: str = ""):
    """Get ElevenLabs usage and subscription info"""
    verify_admin(admin_key)
    
    try:
        from execution.analytics import get_elevenlabs_analytics
        return get_elevenlabs_analytics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Gemini endpoint removed - STT not used


@app.get("/api/admin/usage")
async def get_local_usage(admin_key: str = ""):
    """Get local usage statistics"""
    verify_admin(admin_key)
    
    try:
        from execution.analytics import get_local_usage_stats
        return get_local_usage_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== Run ====================

if __name__ == "__main__":
    import uvicorn
    print("\n🎤 Starting Versona AI Backend Server...")
    print("📍 API: http://localhost:8000")
    print("📚 Docs: http://localhost:8000/docs")
    print("📊 Admin: http://localhost:8000/api/admin/analytics?admin_key=admin123\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
