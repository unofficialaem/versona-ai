"""
Speech to Speech (STS) using ElevenLabs API
Converts voice from one speaker to another voice
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
BASE_URL = "https://api.elevenlabs.io/v1"


def speech_to_speech(
    audio_path: str,
    voice_id: str,
    model_id: str = "eleven_english_sts_v2",
    stability: float = 0.5,
    similarity_boost: float = 0.8,
    style: float = 0.0,
    use_speaker_boost: bool = True,
    output_path: str = None
) -> bytes:
    """
    Convert speech from one voice to another using ElevenLabs STS.
    
    Args:
        audio_path: Path to the source audio file
        voice_id: Target voice ID (cloned or preset)
        model_id: STS model to use
        stability: Voice stability (0-1)
        similarity_boost: Similarity to target voice (0-1)
        style: Style exaggeration (0-1)
        use_speaker_boost: Enhance speaker similarity
        output_path: Optional path to save output audio
        
    Returns:
        Audio bytes (MP3 format)
    """
    if not ELEVENLABS_API_KEY:
        raise ValueError("ELEVENLABS_API_KEY not found in .env")
    
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")
    
    url = f"{BASE_URL}/speech-to-speech/{voice_id}/stream"
    
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    # Voice settings as JSON string
    voice_settings = {
        "stability": stability,
        "similarity_boost": similarity_boost,
        "style": style,
        "use_speaker_boost": use_speaker_boost
    }
    
    with open(audio_path, "rb") as audio_file:
        files = {
            "audio": audio_file
        }
        data = {
            "model_id": model_id,
            "voice_settings": str(voice_settings).replace("'", '"').replace("True", "true").replace("False", "false")
        }
        
        response = requests.post(url, headers=headers, files=files, data=data)
    
    if response.status_code != 200:
        raise Exception(f"STS Error: {response.status_code} - {response.text}")
    
    audio_bytes = response.content
    
    # Save to file if path provided
    if output_path:
        with open(output_path, "wb") as f:
            f.write(audio_bytes)
        print(f"Audio saved to: {output_path}")
    
    return audio_bytes


def speech_to_speech_stream(
    audio_path: str,
    voice_id: str,
    model_id: str = "eleven_english_sts_v2"
):
    """
    Stream STS for real-time conversion.
    Returns a generator of audio chunks.
    """
    if not ELEVENLABS_API_KEY:
        raise ValueError("ELEVENLABS_API_KEY not found in .env")
    
    url = f"{BASE_URL}/speech-to-speech/{voice_id}/stream"
    
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    voice_settings = {
        "stability": 0.5,
        "similarity_boost": 0.8,
        "style": 0.0,
        "use_speaker_boost": True
    }
    
    with open(audio_path, "rb") as audio_file:
        files = {
            "audio": audio_file
        }
        data = {
            "model_id": model_id,
            "voice_settings": str(voice_settings).replace("'", '"').replace("True", "true").replace("False", "false")
        }
        
        response = requests.post(url, headers=headers, files=files, data=data, stream=True)
    
    if response.status_code != 200:
        raise Exception(f"STS Stream Error: {response.status_code}")
    
    for chunk in response.iter_content(chunk_size=1024):
        if chunk:
            yield chunk


# CLI usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python sts.py <source_audio> <voice_id> [output.mp3]")
        print("\nExample: python sts.py input.mp3 Fgk4TfwyUJIUGvE1DLu8 converted.mp3")
        sys.exit(1)
    
    source_audio = sys.argv[1]
    voice_id = sys.argv[2]
    output = sys.argv[3] if len(sys.argv) > 3 else ".tmp/sts_output.mp3"
    
    print(f"Converting voice...")
    print(f"Source: {source_audio}")
    print(f"Target Voice ID: {voice_id}")
    
    audio = speech_to_speech(source_audio, voice_id, output_path=output)
    print(f"Done! Audio size: {len(audio)} bytes")
