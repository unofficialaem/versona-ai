"""Quick test script for all APIs"""
import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

# Test text
URDU_TEXT = "ہیلو زوہیر آپ کیسے ہیں؟"
ENGLISH_TEXT = "Hello Zohair, how are you?"

def test_tts():
    """Test Text to Speech"""
    print("\n" + "="*50)
    print("Testing TTS (Text to Speech)")
    print("="*50)
    
    from execution.tts import text_to_speech
    
    try:
        # Test with English first
        print(f"Text: {ENGLISH_TEXT}")
        audio = text_to_speech(ENGLISH_TEXT, output_path=".tmp/test_english.mp3")
        print(f"✓ English TTS Success! Audio size: {len(audio)} bytes")
        print(f"  Saved to: .tmp/test_english.mp3")
        
        # Test with Urdu
        print(f"\nText: {URDU_TEXT}")
        audio = text_to_speech(URDU_TEXT, output_path=".tmp/test_urdu.mp3")
        print(f"✓ Urdu TTS Success! Audio size: {len(audio)} bytes")
        print(f"  Saved to: .tmp/test_urdu.mp3")
        
        return True
    except Exception as e:
        print(f"✗ TTS Error: {e}")
        return False

def test_voices():
    """Test listing voices"""
    print("\n" + "="*50)
    print("Testing Voice List")
    print("="*50)
    
    from execution.clone_voice import list_voices
    
    try:
        voices = list_voices()
        print(f"✓ Found {len(voices)} voices:")
        for v in voices[:5]:  # Show first 5
            print(f"  - {v.get('name')} ({v.get('voice_id')[:8]}...)")
        if len(voices) > 5:
            print(f"  ... and {len(voices) - 5} more")
        return True
    except Exception as e:
        print(f"✗ Voice List Error: {e}")
        return False

if __name__ == "__main__":
    print("\n🎤 Awaaz AI - API Test\n")
    
    # Check API keys
    if not os.getenv("ELEVENLABS_API_KEY") or os.getenv("ELEVENLABS_API_KEY") == "your_elevenlabs_api_key_here":
        print("⚠️  ELEVENLABS_API_KEY not set in .env")
        sys.exit(1)
    
    print("✓ ElevenLabs API key found")
    
    if os.getenv("GEMINI_API_KEY") and os.getenv("GEMINI_API_KEY") != "your_gemini_api_key_here":
        print("✓ Gemini API key found")
    else:
        print("⚠️  GEMINI_API_KEY not set (STT won't work)")
    
    # Run tests
    test_voices()
    test_tts()
    
    print("\n" + "="*50)
    print("Test Complete!")
    print("="*50)
    print("\nCheck .tmp/ folder for generated audio files.")
