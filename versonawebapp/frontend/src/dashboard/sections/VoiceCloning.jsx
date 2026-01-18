import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Wand2, Pause, Download, Volume2 } from "lucide-react";
import toast from 'react-hot-toast';

import mareebAvatar from "../../assets/mareeb.svg";
import aleezaAvatar from "../../assets/aleeza.svg";
import eizaAvatar from "../../assets/eiza.svg";

/* ======================================================
   VOICE MODELS (TEXT-BASED CLONING)
====================================================== */

const voices = [
  {
    id: "mareeb",
    name: "Mareeb",
    desc: "Warm, confident female voice",
    avatar: mareebAvatar,
  },
  {
    id: "aleeza",
    name: "Aleeza",
    desc: "Soft, elegant female voice",
    avatar: aleezaAvatar,
  },
  {
    id: "eiza",
    name: "Eiza",
    desc: "Clear, expressive female voice",
    avatar: eizaAvatar,
  },
];

export default function VoiceCloning() {
  const [selected, setSelected] = useState("mareeb");
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text first.");
      return;
    }

    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://127.0.0.1:8000/voice-cloning/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          voice_id: selected,
          text: text
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || `HTTP ${response.status}`);
      }

      setGenerationResult({
        audio_url: data.audio_url,
        id: data.audio_id,
        voice: data.voice,
        credits_used: data.credits_used
      });

      toast.success("Voice generated successfully!");
    } catch (error) {
      console.error('Cloning Error:', error);
      toast.error(error.message || "Failed to generate voice");
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const downloadResult = () => {
    if (!generationResult?.audio_url) return;
    const link = document.createElement("a");
    link.href = generationResult.audio_url;
    link.download = `cloned_voice_${generationResult.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col gap-6"
    >
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Voice Cloning
        </h1>
        <p className="mt-1 text-sm text-white/55">
          Generate speech using premium cloned voices.
        </p>
      </div>

      {/* ================= VOICE SELECTION ================= */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-white">
          Select voice model
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {voices.map((voice) => {
            const active = selected === voice.id;

            return (
              <motion.button
                key={voice.id}
                onClick={() => setSelected(voice.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  relative rounded-xl border p-4 text-left transition
                  ${active
                    ? "border-iris-500/60 bg-iris-600/15"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                  }
                `}
              >
                {/* soft glow for selected */}
                {active && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 rounded-xl bg-iris-500/20 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}

                <div className="relative flex items-center gap-3">
                  <motion.div
                    animate={{ scale: active ? 1.05 : 1 }}
                    transition={{ duration: 0.2 }}
                    className={`
                      flex h-11 w-11 items-center justify-center rounded-full
                      ${active
                        ? "bg-gradient-to-br from-iris-400 to-iris-600 ring-2 ring-iris-400/60 shadow-lg shadow-iris-500/40"
                        : "bg-white/10 ring-1 ring-white/15"
                      }
                    `}
                  >
                    <img
                      src={voice.avatar}
                      alt={voice.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </motion.div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {voice.name}
                    </p>
                    <p className="text-xs text-white/50 truncate max-w-[120px]">
                      {voice.desc}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ================= TEXT INPUT ================= */}
      <section className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col">
        <h2 className="mb-2 text-sm font-medium text-white">
          Enter text for voice cloning
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="یہاں اردو متن درج کریں... (Type Urdu text here)"
          dir="rtl"
          className="
            flex-1 resize-none rounded-lg
            bg-black/40 border border-white/10
            px-4 py-3 text-lg text-white font-medium
            placeholder:text-white/20
            focus:outline-none focus:border-iris-500/60
            transition-all duration-300
          "
        />

        <button
          onClick={handleGenerate}
          disabled={!text.trim() || isGenerating}
          className="
            mt-4 inline-flex items-center justify-center gap-2
            rounded-lg bg-iris-600 px-4 py-3
            text-sm font-semibold text-white
            hover:bg-iris-500 transition
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-[0_20px_50px_rgba(139,92,246,0.15)]
          "
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full"
              />
              Generating...
            </>
          ) : (
            <>
              <Wand2 size={16} />
              Generate voice
            </>
          )}
        </button>
      </section>

      {/* ================= PREVIEW / RESULT ================= */}
      <section className={`
        rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between
        ${generationResult ? "border-iris-500/30 bg-iris-500/5 shadow-inner" : ""}
      `}>
        <div className="flex items-center gap-3">
          <div className={`
            h-10 w-10 rounded-full flex items-center justify-center
            ${generationResult ? "bg-iris-500/20 text-iris-400" : "bg-white/5 text-white/30"}
          `}>
            <Volume2 size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {generationResult ? `Generated by ${generationResult.voice}` : "Preview output"}
            </p>
            <p className="text-xs text-white/50">
              {generationResult ? "Audio is ready to play" : "Available after generation"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {generationResult && (
            <button
              onClick={downloadResult}
              className="
                h-9 px-3 rounded-lg
                bg-white/5 text-white hover:bg-white/10
                flex items-center gap-2 text-xs transition
              "
            >
              <Download size={14} />
              Save
            </button>
          )}

          <button
            onClick={togglePlayback}
            disabled={!generationResult}
            className={`
              h-10 w-10 rounded-full flex items-center justify-center transition
              ${generationResult
                ? "bg-white text-black hover:scale-105"
                : "bg-white/5 text-white/20 cursor-not-allowed"
              }
            `}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
        </div>
      </section>

      {generationResult && (
        <audio
          ref={audioRef}
          src={generationResult.audio_url}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </motion.div>
  );
}
