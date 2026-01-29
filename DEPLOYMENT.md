# Versona AI - Deployment Guide

Complete step-by-step guide to deploy Versona AI to the cloud.

---

## 📋 Prerequisites

- GitHub account with the repository: `unofficialaem/versona-ai`
- MongoDB Atlas account (already set up)
- Render.com account (free)
- Vercel.com account (free)

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (recommended)

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account if not already connected
3. Find and select **`unofficialaem/versona-ai`** repository
4. Click **"Connect"**

### Step 3: Configure Web Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `versona-ai-backend` |
| **Region** | Oregon (US West) or closest to you |
| **Branch** | `main` |
| **Root Directory** | *(leave empty)* |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn server:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | `Free` |

### Step 4: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add each of these:

```
ELEVENLABS_API_KEY = sk_d29652b82dfdbd0429b70aca330aa02b53168e93ef0708e3

MONGODB_URI = mongodb+srv://versonaadmin:TIHRBCjj7Jon6ui4@versonacluster.pftdn34.mongodb.net/versona_ai?retryWrites=true&w=majority&appName=VersonaCluster

DATABASE_NAME = versona_ai

JWT_SECRET = ce5b6333b2594fd97239f69384520fb490934a32ad7e79373e72710595f3d3c5

ADMIN_KEY = versona_admin_2026_secure

ELEVENLABS_MALE_VOICE_ID = k7nOSUCadIEwB6fdJmbw

ELEVENLABS_FEMALE_VOICE_ID = SZfY4K69FwXus87eayHK

VOICE_MAREEB_ID = cJWCY8N55FntgO1P8ZXY

VOICE_ALEEZA_ID = uRqri6e0Eu8ZB0B3xbm5

VOICE_EIZA_ID = 4popaoOvaukQ72VMpEfN
```

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once complete, you'll get a URL like: `https://versona-ai-backend.onrender.com`

### Step 6: Verify Backend
Visit: `https://YOUR-BACKEND-URL.onrender.com/docs`
You should see the Swagger API documentation.

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Sign up with **GitHub** (recommended)

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find and select **`unofficialaem/versona-ai`** repository
3. Click **"Import"**

### Step 3: Configure Project
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Project Name** | `versona-ai` |
| **Framework Preset** | `Vite` |
| **Root Directory** | `versonawebapp/frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add:

```
VITE_API_URL = https://versona-ai-backend.onrender.com
```

⚠️ **Important:** Replace the URL with your actual Render backend URL from Part 1!

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait for deployment (2-3 minutes)
3. Once complete, you'll get a URL like: `https://versona-ai.vercel.app`

---

## ✅ Part 3: Final Verification

### Test Your Deployed App

1. **Open Frontend:** `https://versona-ai.vercel.app`
2. **Try to Register:** Create a new account
3. **Try to Login:** Login with the new account
4. **Generate Audio:** Test Text-to-Speech
5. **Check History:** Verify generation appears

### Common Issues

| Issue | Solution |
|-------|----------|
| "Network Error" | Check `VITE_API_URL` is correct in Vercel |
| Backend not responding | Check Render deployment logs |
| "Unauthorized" | Check JWT_SECRET is same on Render |
| Database errors | Verify MONGODB_URI is correct |

---

## 📝 Environment Variables Summary

### Backend (Render)

| Variable | Description |
|----------|-------------|
| `ELEVENLABS_API_KEY` | ElevenLabs API key for TTS |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `DATABASE_NAME` | Database name: `versona_ai` |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `ADMIN_KEY` | Admin dashboard access key |
| `ELEVENLABS_MALE_VOICE_ID` | Male voice for STS |
| `ELEVENLABS_FEMALE_VOICE_ID` | Female voice for STS |
| `VOICE_MAREEB_ID` | Mareeb cloned voice ID |
| `VOICE_ALEEZA_ID` | Aleeza cloned voice ID |
| `VOICE_EIZA_ID` | Eiza cloned voice ID |

### Frontend (Vercel)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL from Render |

---

## 🔄 Updating Deployment

### After Code Changes:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **Render:** Auto-deploys on push (free tier may take a few minutes)

3. **Vercel:** Auto-deploys on push (usually within 1-2 minutes)

---

## ⚠️ Important Notes

1. **Render Free Tier:** Backend may "sleep" after 15 minutes of inactivity. First request after sleep may take 30-60 seconds.

2. **Keep Secrets Safe:** Never commit `.env` files to GitHub. They're already in `.gitignore`.

3. **MongoDB Atlas:** Your database is already cloud-hosted, so it works for both local development and production.

---

## 🎉 You're Done!

Your Versona AI app is now live on the internet!

- **Frontend:** `https://versona-ai.vercel.app`
- **Backend:** `https://versona-ai-backend.onrender.com`
- **API Docs:** `https://versona-ai-backend.onrender.com/docs`
