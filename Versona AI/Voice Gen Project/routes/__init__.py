"""
Routes Package - All API routes
"""

from .auth_routes import router as auth_router
from .tts_routes import router as tts_router
from .sts_routes import router as sts_router
from .voice_routes import router as voice_router
from .history_routes import router as history_router

__all__ = [
    "auth_router",
    "tts_router", 
    "sts_router",
    "voice_router",
    "history_router"
]
