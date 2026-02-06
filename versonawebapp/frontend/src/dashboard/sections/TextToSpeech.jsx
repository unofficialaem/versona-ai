// import { useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Keyboard,
//   Upload,
//   Database,
//   Sparkles,
//   Play,
//   Pause,
//   FileText,
// } from "lucide-react";

// export default function TextToSpeech() {
//   const [mode, setMode] = useState("manual");
//   const [text, setText] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [audioReady, setAudioReady] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const fileInputRef = useRef(null);

//   // Mock database texts (backend will replace)
//   const savedTexts = [
//     "یہ ایک محفوظ شدہ اردو متن ہے۔",
//     "یہ دوسرا محفوظ شدہ پیراگراف ہے۔",
//     "اردو زبان کی خوبصورتی بیان کرتی تحریر۔",
//   ];

//   const handleGenerate = () => {
//     if (!text.trim()) return;
//     setIsGenerating(true);
//     setAudioReady(false);

//     setTimeout(() => {
//       setIsGenerating(false);
//       setAudioReady(true);
//     }, 1400);
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setSelectedFile(file);
//     setText("📄 " + file.name);
//   };

//   return (
//     <div className="h-full flex flex-col overflow-hidden">

//       {/* ================= OUTPUT / CONTEXT AREA ================= */}
//       <div className="flex-1 overflow-y-auto px-2 pb-36">

//         <AnimatePresence>
//           {mode === "database" && !audioReady && (
//             <motion.div
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="max-w-3xl mx-auto mt-8 space-y-2"
//             >
//               {savedTexts.map((item, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setText(item)}
//                   className="
//                     w-full text-right rounded-xl border border-white/10
//                     bg-white/[0.03] px-4 py-3 text-sm text-white/70
//                     hover:border-iris-500/40 hover:bg-white/[0.05]
//                     transition
//                   "
//                 >
//                   {item}
//                 </button>
//               ))}
//             </motion.div>
//           )}

//           {audioReady && (
//             <motion.div
//               initial={{ opacity: 0, y: 12 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="max-w-3xl mx-auto mt-10 rounded-2xl border border-iris-500/30 bg-white/[0.03] p-5"
//             >
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setIsPlaying(!isPlaying)}
//                   className="h-12 w-12 rounded-full bg-white text-iris-600 flex items-center justify-center"
//                 >
//                   {isPlaying ? <Pause size={20} /> : <Play size={20} />}
//                 </button>

//                 <div>
//                   <p className="text-sm font-medium text-white">
//                     Urdu voice generated
//                   </p>
//                   <p className="text-xs text-white/40">Preview • 0:24</p>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* ================= GPT-STYLE INPUT BAR ================= */}
//       <div className="sticky bottom-0 bg-jet-black pt-4">
//         <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-3">

//           {/* MODE SELECTOR */}
//           <div className="flex gap-2 mb-2">
//             {[
//               { id: "manual", icon: Keyboard, label: "Type" },
//               { id: "upload", icon: Upload, label: "Upload .txt" },
//               { id: "database", icon: Database, label: "Database" },
//             ].map(({ id, icon: Icon, label }) => (
//               <button
//                 key={id}
//                 onClick={() => setMode(id)}
//                 className={`
//                   flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition
//                   ${
//                     mode === id
//                       ? "bg-iris-600/20 text-white border border-iris-500/40"
//                       : "text-white/50 hover:text-white hover:bg-white/5"
//                   }
//                 `}
//               >
//                 <Icon size={14} />
//                 {label}
//               </button>
//             ))}
//           </div>

//           {/* INPUT ROW */}
//           <div className="flex items-end gap-3">
//             {mode === "upload" && (
//               <>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".txt"
//                   hidden
//                   onChange={handleFileSelect}
//                 />
//                 <button
//                   onClick={() => fileInputRef.current.click()}
//                   className="
//                     flex items-center gap-2 rounded-lg border border-white/10
//                     bg-black/30 px-3 py-2 text-sm text-white/70
//                     hover:border-iris-500/50 transition
//                   "
//                 >
//                   <FileText size={16} />
//                   {selectedFile ? selectedFile.name : "Choose .txt file"}
//                 </button>
//               </>
//             )}

//             <textarea
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder={
//                 mode === "manual"
//                   ? "یہاں اردو متن درج کریں..."
//                   : mode === "upload"
//                   ? "Selected file will appear here"
//                   : "Select text from database above"
//               }
//               dir={mode === "manual" ? "rtl" : "ltr"}
//               rows={1}
//               disabled={mode !== "manual"}
//               className="
//                 flex-1 resize-none bg-transparent px-2 py-2
//                 text-sm text-white placeholder:text-white/30
//                 focus:outline-none
//               "
//             />

//             <button
//               onClick={handleGenerate}
//               disabled={!text.trim() || isGenerating}
//               className="
//                 flex items-center gap-2 rounded-xl
//                 bg-gradient-to-r from-iris-600 to-indigo-600
//                 px-4 py-2 text-sm font-medium text-white
//                 hover:brightness-110
//                 disabled:opacity-40
//                 transition shadow-md shadow-iris-600/30
//               "
//             >
//               {isGenerating ? (
//                 <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
//               ) : (
//                 <Sparkles size={16} />
//               )}
//             </button>
//           </div>
//         </div>

//         <p className="mt-2 text-center text-xs text-white/35">
//           Text to Speech • UI preview
//         </p>
//       </div>
//     </div>
//   );
// }


import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Keyboard,
  Upload,
  Database,
  Sparkles,
  Play,
  Pause,
  FileText,
  Loader2,
  Volume2,
  Download,
  Image as ImageIcon,
  X,
  Check
} from "lucide-react";
import toast from 'react-hot-toast';
import { TTS_API } from '../../config/api';

// API fetch helper
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    ...options
  };

  if (options.body && typeof options.body !== 'string') {
    defaultOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${TTS_API}${endpoint}`, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message || 'Something went wrong'
    };
  }
};

export default function TextToSpeech() {
  const [mode, setMode] = useState("manual");
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [generationResult, setGenerationResult] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [spectrogramImage, setSpectrogramImage] = useState(null);
  const [alignmentImage, setAlignmentImage] = useState(null);
  const [visualizationImage, setVisualizationImage] = useState(null);

  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  // Mock database texts
  const savedTexts = [
    "یہ ایک محفوظ شدہ اردو متن ہے۔",
    "یہ دوسرا محفوظ شدہ پیراگراف ہے۔",
    "اردو زبان کی خوبصورتی بیان کرتی تحریر۔",
    "آج کا دن بہت خوبصورت ہے۔",
    " السلام علیکم",
    "میری کتاب میز پر رکھی ہے۔"
  ];

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current && audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
    }
  }, [audioBlob]);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter Urdu text");
      return;
    }

    setIsGenerating(true);
    setAudioReady(false);
    setGenerationResult(null);
    setAudioBlob(null);
    setSpectrogramImage(null);
    setAlignmentImage(null);
    setVisualizationImage(null);

    try {
      const result = await apiFetch('/tts/generate/', {
        method: 'POST',
        body: {
          text: text.trim(),
          mode: mode
        }
      });

      if (result.success) {
        setGenerationResult(result.data);

        // Download all files
        await downloadGeneratedFiles(result.data);

        setAudioReady(true);
        toast.success("Speech generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate speech");
      }
    } catch (error) {
      toast.error("Error generating speech");
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // const downloadGeneratedFiles = async (result) => {
  //   try {
  //     // Download audio
  //     const audioResponse = await fetch(`http://127.0.0.1:8000${result.audio_url}`);
  //     const audioBlob = await audioResponse.blob();
  //     setAudioBlob(audioBlob);

  //     // Download spectrogram
  //     const spectrogramResponse = await fetch(`http://127.0.0.1:8000${result.spectrogram_url}`);
  //     const spectrogramBlob = await spectrogramResponse.blob();
  //     setSpectrogramImage(URL.createObjectURL(spectrogramBlob));

  //     // Download alignment
  //     const alignmentResponse = await fetch(`http://127.0.0.1:8000${result.alignment_url}`);
  //     const alignmentBlob = await alignmentResponse.blob();
  //     setAlignmentImage(URL.createObjectURL(alignmentBlob));

  //     // Download visualization
  //     const visualizationResponse = await fetch(`http://127.0.0.1:8000${result.visualization_url}`);
  //     const visualizationBlob = await visualizationResponse.blob();
  //     setVisualizationImage(URL.createObjectURL(visualizationBlob));

  //   } catch (error) {
  //     console.error("Error downloading files:", error);
  //     toast.error("Error downloading generated files");
  //   }
  // };

  // In your TextToSpeech component, update the downloadGeneratedFiles function:

  const downloadGeneratedFiles = async (result) => {
    try {
      // The backend now returns direct URLs, so we can use them directly
      // Download audio
      const audioResponse = await fetch(result.audio_url);
      if (!audioResponse.ok) {
        throw new Error(`Audio download failed: ${audioResponse.status}`);
      }
      const audioBlob = await audioResponse.blob();
      setAudioBlob(audioBlob);

      // Note: ElevenLabs doesn't provide spectrogram/alignment images
      // These are only available with custom TTS models

    } catch (error) {
      console.error("Error downloading files:", error);
      toast.error("Error downloading generated files");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/plain" && !file.name.endsWith('.txt')) {
      toast.error("Please select a .txt file");
      return;
    }

    setSelectedFile(file);

    // Read text from file
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      setText(fileContent);
    };
    reader.readAsText(file);
  };

  const handleTextFromDatabase = (dbText) => {
    setText(dbText);
    toast.success("Text loaded from database");
  };

  const downloadAudio = () => {
    if (!audioBlob) return;

    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urdu_tts_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Audio downloaded");
  };

  const clearAll = () => {
    setText("");
    setSelectedFile(null);
    setAudioReady(false);
    setGenerationResult(null);
    setAudioBlob(null);
    setSpectrogramImage(null);
    setAlignmentImage(null);
    setVisualizationImage(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* ================= OUTPUT / CONTEXT AREA ================= */}
      <div className="flex-1 overflow-y-auto px-2 pb-36">
        <AnimatePresence>
          {/* Database texts */}
          {mode === "database" && !audioReady && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mt-4 space-y-2"
            >
              <div className="mb-2 px-3 py-2 rounded-lg bg-iris-500/10 border border-iris-500/20">
                <p className="text-xs text-iris-300 flex items-center gap-2">
                  <Database size={12} />
                  Select text from database
                </p>
              </div>
              {savedTexts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTextFromDatabase(item)}
                  className="
                    w-full text-right rounded-xl border border-white/10
                    bg-white/[0.03] px-4 py-3 text-sm text-white/70
                    hover:border-iris-500/40 hover:bg-white/[0.05]
                    transition group
                  "
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-iris-400/70 opacity-0 group-hover:opacity-100 transition">
                      Click to load
                    </span>
                    <span>{item}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {/* Generation results */}
          {audioReady && generationResult && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto space-y-6 mt-6"
            >
              {/* Stats card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-iris-500/10">
                    <p className="text-xs text-iris-300">Text Length</p>
                    <p className="text-lg font-semibold text-white">{text.length} chars</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <p className="text-xs text-green-300">Audio Duration</p>
                    <p className="text-lg font-semibold text-white">
                      {generationResult.duration.toFixed(2)}s
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <p className="text-xs text-purple-300">Sample Rate</p>
                    <p className="text-lg font-semibold text-white">{generationResult.sample_rate} Hz</p>
                  </div>
                </div>
              </div>

              {/* Audio player */}
              <div className="rounded-2xl border border-iris-500/30 bg-white/[0.03] p-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <button
                    onClick={togglePlayback}
                    className="h-12 w-12 rounded-full bg-gradient-to-r from-iris-600 to-purple-600 text-white flex items-center justify-center hover:scale-105 transition"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Volume2 size={16} className="text-iris-400" />
                      <p className="text-sm font-medium text-white">Urdu Speech Generated</p>
                      <span className="text-xs bg-iris-500/20 text-iris-300 px-2 py-0.5 rounded-full">
                        Ready
                      </span>
                    </div>
                    <p className="text-xs text-white/40">
                      Duration: {generationResult.duration.toFixed(2)}s •
                      Sample Rate: {generationResult.sample_rate}Hz
                    </p>

                    {/* Progress bar */}
                    <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-iris-500 to-purple-500 rounded-full"
                        style={{
                          width: audioRef.current ?
                            `${(audioRef.current.currentTime / audioRef.current.duration) * 100}%` : '0%'
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={downloadAudio}
                      className="
                        flex items-center gap-2 px-3 py-2 rounded-lg
                        bg-white/5 border border-white/10
                        text-sm text-white/70 hover:text-white hover:bg-white/10
                        transition
                      "
                    >
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>
              </div>

              {/* Images grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {spectrogramImage && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-iris-500/20 flex items-center justify-center">
                        <ImageIcon size={14} className="text-iris-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Mel-Spectrogram</p>
                        <p className="text-xs text-white/40">Frequency vs Time</p>
                      </div>
                    </div>
                    <img
                      src={spectrogramImage}
                      alt="Mel-Spectrogram"
                      className="w-full rounded-lg border border-white/10"
                    />
                  </div>
                )}

                {alignmentImage && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <ImageIcon size={14} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Attention Alignment</p>
                        <p className="text-xs text-white/40">Text vs Audio alignment</p>
                      </div>
                    </div>
                    <img
                      src={alignmentImage}
                      alt="Attention Alignment"
                      className="w-full rounded-lg border border-white/10"
                    />
                  </div>
                )}
              </div>

              {visualizationImage && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <ImageIcon size={14} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Full Visualization</p>
                        <p className="text-xs text-white/40">Complete output analysis</p>
                      </div>
                    </div>
                    <button
                      onClick={() => window.open(visualizationImage, '_blank')}
                      className="text-xs text-iris-400 hover:text-iris-300"
                    >
                      Open in new tab
                    </button>
                  </div>
                  <img
                    src={visualizationImage}
                    alt="Full Visualization"
                    className="w-full rounded-lg border border-white/10"
                  />
                </div>
              )}
            </motion.div>
          )}

          {/* Generation in progress */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-3xl mx-auto mt-10 rounded-2xl border border-iris-500/30 bg-white/[0.03] p-8"
            >
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="h-16 w-16 rounded-full border-4 border-iris-500/20">
                    <div className="h-full w-full rounded-full border-4 border-transparent border-t-iris-500 animate-spin" />
                  </div>
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-iris-400 animate-pulse" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">Generating Urdu Speech</h3>
                <p className="mt-2 text-sm text-white/60">
                  This may take a few moments...
                </p>
                <div className="mt-4 flex justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-iris-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-iris-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full bg-iris-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= GPT-STYLE INPUT BAR ================= */}
      <div className="sticky bottom-0 bg-jet-black pt-4 pb-4">
        <div className="max-w-4xl mx-auto">
          {/* Mode selector */}
          <div className="flex gap-2 mb-3 px-2">
            {[
              { id: "manual", icon: Keyboard, label: "Type" },
              { id: "upload", icon: Upload, label: "Upload .txt" },
              { id: "database", icon: Database, label: "Database" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition
                  ${mode === id
                    ? "bg-iris-600/20 text-white border border-iris-500/40"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
            {(text || audioReady) && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white hover:bg-white/5 transition ml-auto"
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>

          {/* Input area */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-3">
            <div className="flex items-end gap-3">
              {mode === "upload" && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt"
                    hidden
                    onChange={handleFileSelect}
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className={`
                      flex items-center gap-2 rounded-lg border
                      px-3 py-2 text-sm transition whitespace-nowrap
                      ${selectedFile
                        ? "border-green-500/30 bg-green-500/10 text-green-300"
                        : "border-white/10 bg-black/30 text-white/70 hover:border-iris-500/50"
                      }
                    `}
                  >
                    <FileText size={16} />
                    {selectedFile ? (
                      <span className="flex items-center gap-1">
                        <Check size={12} />
                        {selectedFile.name}
                      </span>
                    ) : (
                      "Choose .txt file"
                    )}
                  </button>
                </>
              )}

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  mode === "manual"
                    ? "یہاں اردو متن درج کریں..."
                    : mode === "upload"
                      ? "Selected file content will appear here..."
                      : "Select text from database above..."
                }
                dir={text ? "rtl" : "ltr"}
                rows={1}
                className="
                  flex-1 resize-none bg-transparent px-2 py-2
                  text-sm text-white placeholder:text-white/30
                  focus:outline-none min-h-[40px] max-h-[120px]
                "
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
              />

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={!text.trim() || isGenerating || text.length > 2000}
                  className="
                    flex items-center gap-2 rounded-xl
                    bg-gradient-to-r from-iris-600 to-indigo-600
                    px-4 py-2 text-sm font-medium text-white
                    hover:brightness-110 active:scale-95
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition shadow-md shadow-iris-600/30
                    min-w-[100px] justify-center
                  "
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate
                    </>
                  )}
                </button>

                {text && (
                  <div className={`text-xs text-center ${text.length > 2000 ? 'text-red-400' : 'text-white/40'}`}>
                    {text.length} / 2000 chars
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="mt-2 text-center text-xs text-white/35">
            Urdu Text-to-Speech • Powered by Tacotron2
          </p>
        </div>
      </div>
    </div>
  );
}
