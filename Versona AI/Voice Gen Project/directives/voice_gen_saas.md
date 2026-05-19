# Directive: Urdu Voice Gen SaaS

## Goal
Build a SaaS product for Urdu language voice generation with TTS, STT, STS, and Voice Cloning capabilities.

## Target Users
- Content creators needing Urdu voiceovers
- Businesses wanting Urdu voice automation
- Developers integrating Urdu voice into apps

## Features

### 1. Text to Speech (TTS)
- Input: Urdu text
- Output: Audio file (MP3/WAV)
- API: ElevenLabs TTS
- User selects voice (cloned or preset)

### 2. Speech to Text (STT)
- Input: Audio file or microphone recording
- Output: Urdu text transcription
- API: OpenAI Whisper (ElevenLabs doesn't support STT)

### 3. Speech to Speech (STS)
- Input: Audio file + target voice ID
- Output: Converted audio in target voice
- API: ElevenLabs Voice Changer
- User selects from: cloned voices OR preset female voices (3)

### 4. Voice Cloning
- Input: Audio samples (minimum 1 minute)
- Output: Unique voice_id stored in user account
- API: ElevenLabs Voice Cloning
- Voice ID can be used in TTS, STS

## Tech Stack

### Frontend (Phase 1 - Prototype)
- HTML, CSS, JavaScript
- Single page application
- ElevenLabs-inspired UI

### Frontend (Phase 2 - Production)
- React (built by team member)
- Component-based architecture

### Backend
- Python (FastAPI) or Node.js (Express)
- JWT authentication
- Rate limiting per user

### Database
- MongoDB
- Collections: users, voices, usage_logs

### External APIs
- ElevenLabs: TTS, STS, Voice Cloning
- OpenAI Whisper: STT

## Execution Scripts

| Script | Purpose |
|--------|---------|
| `execution/tts.py` | Text to Speech conversion |
| `execution/stt.py` | Speech to Text transcription |
| `execution/sts.py` | Speech to Speech conversion |
| `execution/clone_voice.py` | Voice cloning |
| `execution/list_voices.py` | Get available voices |

## Environment Variables (.env)
```
ELEVENLABS_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here (for Whisper STT)
MONGODB_URI=mongodb://localhost:27017/voicegen
JWT_SECRET=your_secret_here
```

## User Flow
1. User visits website → Login/Register
2. Dashboard shows: TTS, STT, STS, Voice Clone options
3. User selects feature
4. User provides input (text/audio) + voice selection
5. System processes via API
6. User downloads/plays result
7. Usage logged to database

## Cost Management
- Track characters/minutes per user per month
- Enforce limits based on subscription tier
- Alert admins when approaching ElevenLabs quota

## Edge Cases
- **Large text input**: Chunk into segments < 5000 chars
- **Invalid audio format**: Convert to supported format before API call
- **API rate limit**: Queue requests, retry with backoff
- **Urdu text encoding**: Ensure UTF-8 throughout

## Learnings
<!-- Updated as the system learns -->
