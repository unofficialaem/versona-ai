import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Play, Wand2, Pause, Download, Trash2, CheckCircle2 } from "lucide-react";
import toast from 'react-hot-toast';
import { STS_API } from '../../config/api';

// Gender icons (SVGs placed in assets folder)
import maleIcon from "../../assets/male.svg";
import femaleIcon from "../../assets/female.svg";

/* ======================================================
   AUDIO TO AUDIO
   - Input: Audio file (MP3 / WAV)
   - Output: Enhanced / transformed audio
   - Backend will later handle processing
 ====================================================== */

/**
 * Available output voice options
 */
const voices = [
  {
    id: "male",
    name: "Male Voice",
    desc: "Deep, clear male narration",
    icon: maleIcon,
  },
  {
    id: "female",
    name: "Female Voice",
    desc: "Soft, expressive female voice",
    icon: femaleIcon,
  },
];

export default function AudioToAudio() {
  const [selectedVoice, setSelectedVoice] = useState("male");
  const [file, setFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  /**
   * Handle audio upload
   */
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const validTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/x-wav"];
    if (!validTypes.includes(selected.type) && !selected.name.endsWith('.mp3') && !selected.name.endsWith('.wav')) {
      toast.error("Only MP3 and WAV files are supported.");
      return;
    }

    setFile(selected);
    setGenerationResult(null); // Clear previous result
  };

  /**
   * Handle generation
   */
  const handleGenerate = async () => {
    if (!file) {
      toast.error("Please upload an audio file first.");
      return;
    }

    setIsGenerating(true);
    setGenerationResult(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('voice_type', selectedVoice);

      const response = await fetch(`${STS_API}/convert/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || `HTTP ${response.status}`);
      }

      setGenerationResult({
        audio_url: data.audio_url,
        id: data.audio_id,
        voice_type: data.voice_type,
        input_size: data.input_size,
        output_size: data.output_size
      });

      toast.success("Audio transformed successfully!");
    } catch (error) {
      console.error('STS Error:', error);
      toast.error(error.message || "Failed to transform audio");
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
    link.download = `transformed_audio_${generationResult.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearSelection = () => {
    setFile(null);
    setGenerationResult(null);
    setIsPlaying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex h-full flex-col gap-6"
    >
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Audio to Audio
        </h1>
        <p className="mt-1 text-sm text-white/55">
          Enhance or transform existing audio using premium voices.
        </p>
      </div>

      {/* ================= VOICE SELECTION ================= */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-white">
          Select output voice
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {voices.map((voice) => {
            const active = selectedVoice === voice.id;

            return (
              <motion.button
                key={voice.id}
                onClick={() => setSelectedVoice(voice.id)}
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
                {/* Active glow */}
                {active && (
                  <motion.div
                    aria-hidden
                    className="absolute inset-0 rounded-xl bg-iris-500/20 blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}

                <div className="relative flex items-center gap-3">
                  <div
                    className={`
                      h-9 w-9 rounded-lg flex items-center justify-center
                      ${active ? "bg-iris-500/25" : "bg-white/10"}
                    `}
                  >
                    <img
                      src={voice.icon}
                      alt={voice.name}
                      className="h-5 w-5 opacity-90"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {voice.name}
                    </p>
                    <p className="text-xs text-white/50">
                      {voice.desc}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ================= AUDIO UPLOAD ================= */}
      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-white">
            Upload audio file
          </h2>
          {file && (
            <button
              onClick={clearSelection}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 size={12} />
              Remove
            </button>
          )}
        </div>

        {!file ? (
          <label
            className="
              flex cursor-pointer flex-col items-center justify-center
              rounded-lg border border-dashed border-white/15
              bg-black/30 px-4 py-8 text-center
              hover:border-iris-500/50 transition
            "
          >
            <Upload size={20} className="mb-2 text-white/50" />
            <p className="text-sm text-white/70">
              Click to upload or drag & drop
            </p>
            <p className="mt-1 text-xs text-white/40">
              MP3 or WAV only
            </p>

            <input
              type="file"
              accept=".mp3,.wav"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-iris-500/10 border border-iris-500/20">
            <CheckCircle2 size={20} className="text-iris-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate font-medium">
                {file.name}
              </p>
              <p className="text-xs text-white/40">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ================= GENERATE BUTTON ================= */}
      <button
        onClick={handleGenerate}
        disabled={!file || isGenerating}
        className="
          inline-flex items-center justify-center gap-2
          rounded-lg bg-iris-600 px-4 py-3
          text-sm font-semibold text-white
          hover:bg-iris-500 transition
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-[0_20px_50px_rgba(139,92,246,0.2)]
        "
      >
        {isGenerating ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full"
            />
            Processing...
          </>
        ) : (
          <>
            <Wand2 size={16} />
            Generate transformed audio
          </>
        )}
      </button>

      {/* ================= PREVIEW / RESULT ================= */}
      <section className={`
        rounded-xl border border-white/10 bg-white/[0.03] p-4 
        ${generationResult ? "border-iris-500/30 bg-iris-500/5" : ""}
      `}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              {generationResult ? "Output Ready" : "Preview output"}
            </p>
            <p className="text-xs text-white/50">
              {generationResult
                ? `${(generationResult.output_size / 1024 / 1024).toFixed(2)} MB • MP3`
                : "Available after generation"
              }
            </p>
          </div>

          <div className="flex items-center gap-2">
            {generationResult && (
              <button
                onClick={downloadResult}
                className="
                  h-9 px-3 rounded-lg
                  bg-white/10 text-white hover:bg-white/20
                  flex items-center gap-2 text-xs transition
                "
              >
                <Download size={14} />
                Download
              </button>
            )}

            <button
              onClick={togglePlayback}
              disabled={!generationResult}
              className={`
                h-10 w-10 rounded-full
                flex items-center justify-center transition
                ${generationResult
                  ? "bg-white text-black hover:scale-105"
                  : "bg-white/10 text-white/20 cursor-not-allowed"
                }
              `}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
          </div>
        </div>

        {generationResult && (
          <audio
            ref={audioRef}
            src={generationResult.audio_url}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        )}
      </section>
    </motion.div>
  );
}
