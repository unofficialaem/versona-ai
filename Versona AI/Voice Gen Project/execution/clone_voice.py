"""
Voice Cloning using ElevenLabs API
Creates a cloned voice from audio samples
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
BASE_URL = "https://api.elevenlabs.io/v1"


def clone_voice(
    name: str,
    audio_files: list,
    description: str = "Urdu voice clone"
) -> dict:
    """
    Clone a voice from audio samples.
    
    Args:
        name: Name for the cloned voice
        audio_files: List of paths to audio files (minimum 1 minute total)
        description: Description of the voice
        
    Returns:
        Dict with 'voice_id' of the cloned voice
    """
    if not ELEVENLABS_API_KEY:
        raise ValueError("ELEVENLABS_API_KEY not found in .env")
    
    # Validate files exist
    for file_path in audio_files:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Audio file not found: {file_path}")
    
    url = f"{BASE_URL}/voices/add"
    
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    # Prepare multipart form data
    files = []
    for file_path in audio_files:
        files.append(
            ("files", (os.path.basename(file_path), open(file_path, "rb"), "audio/mpeg"))
        )
    
    data = {
        "name": name,
        "description": description
    }
    
    response = requests.post(url, headers=headers, data=data, files=files)
    
    # Close file handles
    for _, file_tuple in files:
        file_tuple[1].close()
    
    if response.status_code != 200:
        raise Exception(f"Clone Error: {response.status_code} - {response.text}")
    
    result = response.json()
    print(f"Voice cloned successfully!")
    print(f"Voice ID: {result.get('voice_id')}")
    
    return result


def list_voices() -> list:
    """
    Get list of all available voices (including cloned ones).
    
    Returns:
        List of voice objects with id, name, category, etc.
    """
    if not ELEVENLABS_API_KEY:
        raise ValueError("ELEVENLABS_API_KEY not found in .env")
    
    url = f"{BASE_URL}/voices"
    
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"List Voices Error: {response.status_code} - {response.text}")
    
    return response.json().get("voices", [])


def get_voice(voice_id: str) -> dict:
    """
    Get details of a specific voice.
    """
    if not ELEVENLABS_API_KEY:
        raise ValueError("ELEVENLABS_API_KEY not found in .env")
    
    url = f"{BASE_URL}/voices/{voice_id}"
    
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"Get Voice Error: {response.status_code} - {response.text}")
    
    return response.json()


def delete_voice(voice_id: str) -> bool:
    """
    Delete a cloned voice.
    
    Args:
        voice_id: ID of the voice to delete
        
    Returns:
        True if successful
    """
    if not ELEVENLABS_API_KEY:
        raise ValueError("ELEVENLABS_API_KEY not found in .env")
    
    url = f"{BASE_URL}/voices/{voice_id}"
    
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    response = requests.delete(url, headers=headers)
    
    if response.status_code != 200:
        raise Exception(f"Delete Voice Error: {response.status_code} - {response.text}")
    
    print(f"Voice {voice_id} deleted successfully")
    return True


# CLI usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Clone: python clone_voice.py clone <name> <audio1.mp3> [audio2.mp3] ...")
        print("  List:  python clone_voice.py list")
        print("  Delete: python clone_voice.py delete <voice_id>")
        print("\nExample:")
        print("  python clone_voice.py clone 'My Voice' sample1.mp3 sample2.mp3")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "list":
        print("Fetching voices...")
        voices = list_voices()
        print(f"\nFound {len(voices)} voices:\n")
        for v in voices:
            print(f"  {v.get('name')}")
            print(f"    ID: {v.get('voice_id')}")
            print(f"    Category: {v.get('category', 'N/A')}")
            print()
    
    elif command == "clone":
        if len(sys.argv) < 4:
            print("Usage: python clone_voice.py clone <name> <audio1.mp3> [audio2.mp3] ...")
            sys.exit(1)
        
        name = sys.argv[2]
        audio_files = sys.argv[3:]
        
        print(f"Cloning voice: {name}")
        print(f"Audio files: {audio_files}")
        
        result = clone_voice(name, audio_files)
        print(f"\nVoice ID: {result.get('voice_id')}")
        print("Save this ID to use in TTS and STS!")
    
    elif command == "delete":
        if len(sys.argv) < 3:
            print("Usage: python clone_voice.py delete <voice_id>")
            sys.exit(1)
        
        voice_id = sys.argv[2]
        delete_voice(voice_id)
    
    else:
        print(f"Unknown command: {command}")
        print("Use 'list', 'clone', or 'delete'")
