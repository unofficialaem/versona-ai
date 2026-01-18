"""
Text to Speech (TTS) using ElevenLabs API
Converts Urdu text to natural-sounding speech
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
BASE_URL = "https://api.elevenlabs.io/v1"

# Default voice IDs (you can get these from ElevenLabs dashboard or /v1/voices)
DEFAULT_VOICES = {
    "female-1": "21m00Tcm4TlvDq8ikWAM",  # Rachel
    "female-2": "AZnzlk1XvdvUeBnXmlld",  # Domi
    "female-3": "EXAVITQu4vr4xnSDxMaL",  # Bella
    "male-1": "VR6AewLTigWG4xSOukaG",    # Arnold
}


def text_to_speech(
    text: str,
    voice_id: str = None,
    model_id: str = "eleven_multilingual_v2",
    stability: float = 0.5,
    similarity_boost: float = 0.75,
    output_path: str = None
) -> bytes:
    """
    Convert text to speech using ElevenLabs API.
    
    Args:
        text: The text to convert (supports Urdu)
        voice_id: ElevenLabs voice ID (use cloned voice ID or preset)
        model_id: Model to use (eleven_multilingual_v2 for Urdu)
        stability: Voice stability (0-1)
        similarity_boost: Similarity to original voice (0-1)
        output_path: Optional path to save the audio file
        
    Returns:
        Audio bytes (MP3 format)
    """
    if not ELEVENLABS_API_KEY:
        raise ValueError("ELEVENLABS_API_KEY not found in .env")
    
    # Use default voice if not specified
    if not voice_id:
        voice_id = DEFAULT_VOICES["female-1"]
    elif voice_id in DEFAULT_VOICES:
        voice_id = DEFAULT_VOICES[voice_id]
    
    url = f"{BASE_URL}/text-to-speech/{voice_id}"
    
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    
    payload = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {
            "stability": stability,
            "similarity_boost": similarity_boost
        }
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"TTS Error: {response.status_code} - {response.text}")
    
    audio_bytes = response.content
    
    # Save to file if path provided
    if output_path:
        with open(output_path, "wb") as f:
            f.write(audio_bytes)
        print(f"Audio saved to: {output_path}")
    
    return audio_bytes


def text_to_speech_stream(
    text: str,
    voice_id: str = None,
    model_id: str = "eleven_multilingual_v2"
):
    """
    Stream TTS for real-time playback.
    Returns a generator of audio chunks.
    """
    if not ELEVENLABS_API_KEY:
        raise ValueError("ELEVENLABS_API_KEY not found in .env")
    
    if not voice_id:
        voice_id = DEFAULT_VOICES["female-1"]
    elif voice_id in DEFAULT_VOICES:
        voice_id = DEFAULT_VOICES[voice_id]
    
    url = f"{BASE_URL}/text-to-speech/{voice_id}/stream"
    
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    
    payload = {
        "text": text,
        "model_id": model_id,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }
    
    response = requests.post(url, json=payload, headers=headers, stream=True)
    
    if response.status_code != 200:
        raise Exception(f"TTS Stream Error: {response.status_code}")
    
    for chunk in response.iter_content(chunk_size=1024):
        if chunk:
            yield chunk


# CLI usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python tts.py 'Your text here' [voice_id] [output.mp3]")
        print("\nExample: python tts.py 'السلام علیکم' female-1 output.mp3")
        sys.exit(1)
    
    text = sys.argv[1]
    voice_id = sys.argv[2] if len(sys.argv) > 2 else None
    output = sys.argv[3] if len(sys.argv) > 3 else ".tmp/tts_output.mp3"
    
    print(f"Converting text to speech...")
    print(f"Text: {text[:50]}...")
    print(f"Voice: {voice_id or 'default'}")
    
    audio = text_to_speech(text, voice_id, output_path=output)
    print(f"Done! Audio size: {len(audio)} bytes")
