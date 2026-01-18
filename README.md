# Versona AI - Urdu Voice Generation Platform

A premium text-to-speech platform specialized for Urdu language, powered by ElevenLabs AI.

## 🎯 Features

- **Text to Speech (TTS)** - Convert Urdu text to natural speech
- **Audio to Audio (STS)** - Transform audio with premium male/female voices
- **Voice Cloning** - Generate speech using 3 premium cloned voices (Mareeb, Aleeza, Eiza)
- **History & Analytics** - Track all generations with playback and download

## 📁 Project Structure

```
Versona AI/
├── server.py              # FastAPI backend server
├── cli.py                 # Command-line interface
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (API keys)
│
├── auth/                  # JWT authentication
│   └── jwt_handler.py
│
├── database/              # MongoDB integration
│   ├── connection.py
│   └── models/
│       └── user.py
│
├── execution/             # ElevenLabs API wrappers
│   ├── tts.py             # Text-to-Speech
│   ├── sts.py             # Speech-to-Speech
│   ├── clone_voice.py     # Voice cloning
│   └── analytics.py
│
├── routes/                # API endpoints
│   ├── auth_routes.py     # Login, signup, profile
│   ├── tts_routes.py      # TTS generation
│   ├── sts_routes.py      # Audio transformation
│   ├── voice_routes.py    # Voice cloning
│   └── history_routes.py  # User history & stats
│
├── versonawebapp/         # React frontend
│   └── frontend/
│       ├── src/
│       │   ├── pages/     # Login, Signup, Landing
│       │   └── dashboard/ # Main app sections
│       └── public/
│
├── directives/            # Project documentation
│   ├── elevenlabs_api.md
│   └── voice_gen_saas.md
│
└── .tmp/                  # Temporary audio files
    └── audio/
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB (local or Atlas)
- ElevenLabs API Key

### 1. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Edit `.env` with your API keys:
```env
ELEVENLABS_API_KEY=your_key_here
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=your_secret_here
```

### 3. Start Backend Server
```bash
python server.py
```
Backend runs at: http://localhost:8000

### 4. Start Frontend (in new terminal)
```bash
cd versonawebapp/frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:3000

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/login/` | POST | User authentication |
| `/api/signup/` | POST | User registration |
| `/api/profile/` | GET/PUT | Profile management |
| `/tts/generate/` | POST | Generate TTS audio |
| `/sts/convert/` | POST | Convert audio voice |
| `/voice-cloning/generate/` | POST | Clone voice generation |
| `/history/` | GET | User generation history |
| `/history/stats` | GET | Usage analytics |

## 📚 Documentation

- **API Docs:** http://localhost:8000/docs (Swagger UI)
- **Admin Dashboard:** http://localhost:8000/api/admin/analytics?admin_key=admin123

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Urdu text validation (80%+ Urdu characters required)
- Credit-based usage limiting

## 📄 License

Private project - All rights reserved.
