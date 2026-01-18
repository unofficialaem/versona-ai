import React from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import LandingPage from "./pages/LandingPage";
import ResetPasswordPage from './pages/ResetPasswordPage';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// Dashboard
import DashboardLayout from "./dashboard/DashboardLayout";
import Overview from "./dashboard/sections/Overview";
import Profile from "./dashboard/sections/Profile";
import TextToSpeech from "./dashboard/sections/TextToSpeech";
import AudioToAudio from "./dashboard/sections/AudioToAudio";
import VoiceCloning from "./dashboard/sections/VoiceCloning";
import History from "./dashboard/sections/History";

function App() {
  return (
    <div className="min-h-screen bg-jet-black text-white">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset_password/:token" element={<ResetPasswordPage />} />
          {/* ================= DASHBOARD ================= */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="profile" element={<Profile />} />
            <Route path="text-to-speech" element={<TextToSpeech />} />
            <Route path="audio-to-audio" element={<AudioToAudio />} />
            <Route path="voice-cloning" element={<VoiceCloning />} />
            <Route path="history" element={<History />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;

