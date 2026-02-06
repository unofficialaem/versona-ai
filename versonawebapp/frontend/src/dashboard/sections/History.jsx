import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Trash2, Download, Clock, Headphones, Wand2, MessageSquare, Volume2 } from "lucide-react";
import toast from 'react-hot-toast';
import { HISTORY_API, API_BASE_URL } from '../../config/api';

/* ======================================================
   HISTORY - Unified Data and Audio Access
====================================================== */

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${HISTORY_API}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setHistory(data.items);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${HISTORY_API}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setHistory(history.filter(item => item.id !== id));
        toast.success("Item deleted");
      }
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const grouped = groupByDate(history);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col gap-6"
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">History</h1>
          <p className="mt-1 text-sm text-white/55">
            Manage and play your previous generations.
          </p>
        </div>
        <button
          onClick={fetchHistory}
          className="text-xs text-iris-400 hover:text-iris-300 flex items-center gap-1 bg-iris-500/5 px-2 py-1 rounded border border-iris-500/20 transition-all"
        >
          <Clock size={12} />
          Refresh
        </button>
      </div>

      <div className="h-px bg-white/10" />

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-8 w-8 border-2 border-iris-500/20 border-t-iris-500 rounded-full"
          />
        </div>
      ) : history.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-8 pb-10">
          {Object.entries(grouped).map(([label, items]) => (
            <DateGroup key={label} label={label} items={items} onDelete={deleteItem} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function DateGroup({ label, items, onDelete }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30">
          {label}
        </h2>
        <div className="h-px flex-1 bg-white/[0.05]" />
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <HistoryRow key={item.id} item={item} onDelete={onDelete} />
        ))}
      </div>
    </section>
  );
}

function HistoryRow({ item, onDelete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Build static URL
  const backendUrl = API_BASE_URL;
  const filename = item.audio_path ? item.audio_path.split(/[\\/]/).pop() : null;
  const audioUrl = filename ? `${backendUrl}/static/audio/${filename}` : null;

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.error("Playback failed:", e);
        toast.error("Could not play audio");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const download = () => {
    if (!audioUrl) return;
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = filename || `generation_${item.id}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getIcon = () => {
    switch (item.action) {
      case 'tts': return <MessageSquare size={16} className="text-blue-400" />;
      case 'sts': return <Headphones size={16} className="text-green-400" />;
      case 'voice_cloning': return <Wand2 size={16} className="text-iris-400" />;
      default: return <Clock size={16} className="text-white/40" />;
    }
  };

  const getActionName = () => {
    switch (item.action) {
      case 'tts': return 'Text to Speech';
      case 'sts': return 'Audio to Audio';
      case 'voice_cloning': return 'Voice Cloning';
      default: return item.action;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileHover={{ scale: 1.005 }}
      animate={{ opacity: 1, x: 0 }}
      className="
        group relative overflow-hidden
        rounded-xl border border-white/5
        bg-white/[0.02] hover:bg-white/[0.05] 
        px-4 py-4 transition-all duration-300
      "
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white/90">
                {getActionName()}
              </p>
              {item.voice_name && (
                <span className="px-1.5 py-0.5 rounded bg-iris-500/20 text-[10px] text-iris-300 font-bold uppercase tracking-widest">
                  {item.voice_name}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-3">
              <p className="text-[11px] text-white/40 font-medium whitespace-nowrap">
                {formatTime(item.created_at)}
              </p>
              {item.text && (
                <p className="text-xs text-white/25 italic truncate dir-rtl flex-1">
                  "{item.text}"
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* PLAY BUTTON */}
          <button
            onClick={togglePlayback}
            className={`
              h-9 w-9 rounded-full flex items-center justify-center transition-all
              ${isPlaying
                ? "bg-iris-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                : "bg-white/10 text-white hover:bg-white hover:text-black"
              }
            `}
          >
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
          </button>

          {/* ACTIONS ON HOVER */}
          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <IconButton title="Download" onClick={download}>
              <Download size={14} />
            </IconButton>

            <IconButton danger title="Delete" onClick={() => onDelete(item.id)}>
              <Trash2 size={14} />
            </IconButton>
          </div>
        </div>
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          className="hidden"
        />
      )}
    </motion.div>
  );
}

function IconButton({ children, danger, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        h-9 w-9 rounded-lg
        flex items-center justify-center
        transition-all duration-200
        ${danger
          ? "text-red-400 hover:bg-red-500/20"
          : "text-white/60 hover:bg-white/10 hover:text-white"
        }
      `}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.01] p-16 text-center">
      <div className="mb-6 h-16 w-16 rounded-full bg-iris-500/10 flex items-center justify-center border border-iris-500/20">
        <Volume2 size={28} className="text-iris-400/60" />
      </div>
      <h3 className="text-lg font-medium text-white/90">Your audio library is empty</h3>
      <p className="mt-2 text-sm text-white/40 max-w-[280px]">
        Generate some Urdu speech using the tools on the left to see them appear here.
      </p>
    </div>
  );
}

function groupByDate(items) {
  if (!items || items.length === 0) return {};

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  return [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).reduce((acc, item) => {
    const d = new Date(item.created_at).toDateString();
    let label = "Older Activity";

    if (d === today) label = "Today";
    else if (d === yesterday) label = "Yesterday";
    else {
      label = new Date(item.created_at).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric'
      });
    }

    acc[label] = acc[label] || [];
    acc[label].push(item);
    return acc;
  }, {});
}

function formatTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
