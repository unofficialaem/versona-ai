// API Configuration
// In development: http://localhost:8000
// In production: Set VITE_API_URL environment variable

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper to build API endpoints
export const apiUrl = (path) => `${API_BASE_URL}${path}`;

// Auth API
export const AUTH_API = {
    login: `${API_BASE_URL}/api/login/`,
    signup: `${API_BASE_URL}/api/signup/`,
    register: `${API_BASE_URL}/api/register/`,
    profile: `${API_BASE_URL}/api/profile/`,
    updateProfile: `${API_BASE_URL}/api/updateprofile/`,
    changePassword: `${API_BASE_URL}/api/change_password/`,
};

// Feature APIs
export const TTS_API = `${API_BASE_URL}/tts`;
export const STS_API = `${API_BASE_URL}/sts`;
export const VOICE_API = `${API_BASE_URL}/voice-cloning`;
export const HISTORY_API = `${API_BASE_URL}/history`;
