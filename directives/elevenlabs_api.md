# ElevenLabs API Reference

## Authentication
All requests require an API key in the header:
```
xi-api-key: YOUR_API_KEY
```

---

## 1. Voice Cloning - Add New Voice

**Endpoint:** `POST https://api.elevenlabs.io/v1/voices/add`

**Content-Type:** `multipart/form-data`

**Body Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Name for the cloned voice |
| `description` | string | Description of the voice |
| `files` | binary | Audio file(s) for cloning |

**Example Response:**
```json
{
    "voice_id": "Fgk4TfwyUJIUGvE1DLu8"
}
```

---

## 2. Speech to Speech (STS)

**Endpoint:** `POST https://api.elevenlabs.io/v1/speech-to-speech/{voice_id}/stream`

**Content-Type:** `multipart/form-data`

**Path Parameters:**
| Parameter | Description |
|-----------|-------------|
| `voice_id` | The ID of the target voice |

**Body Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `model_id` | string | `eleven_english_sts_v2` (or appropriate model) |
| `voice_settings` | JSON string | Voice configuration settings |
| `audio` | binary | Source audio file |

**Voice Settings JSON:**
```json
{
    "stability": 0.5,
    "similarity_boost": 0.8,
    "style": 0.0,
    "use_speaker_boost": true
}
```

**Response:** Audio stream (MP3)

---

## 3. Text to Speech (TTS)

**Endpoint:** `POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}`

**Content-Type:** `application/json`

**Body:**
```json
{
    "text": "اردو متن یہاں لکھیں",
    "model_id": "eleven_multilingual_v2",
    "voice_settings": {
        "stability": 0.5,
        "similarity_boost": 0.75
    }
}
```

**Response:** Audio stream (MP3)

---

## 4. List Available Voices

**Endpoint:** `GET https://api.elevenlabs.io/v1/voices`

**Response:**
```json
{
    "voices": [
        {
            "voice_id": "...",
            "name": "...",
            "category": "cloned"
        }
    ]
}
```

---

## 5. Delete Voice

**Endpoint:** `DELETE https://api.elevenlabs.io/v1/voices/{voice_id}`

---

## Notes for Urdu

- Use `eleven_multilingual_v2` model for Urdu TTS
- Voice cloning works for any language including Urdu
- Minimum 1 minute of clear audio recommended for cloning
- Higher stability = more consistent output
- Higher similarity_boost = closer to original voice
