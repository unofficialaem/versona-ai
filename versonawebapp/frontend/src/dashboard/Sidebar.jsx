import { NavLink } from "react-router-dom";
import {
  User,
  LayoutDashboard,
  Type,
  AudioLines,
  Mic,
  History,
} from "lucide-react";

export default function Sidebar() {
  const navItem =
    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition";

  const inactive =
    "text-white/60 hover:text-white hover:bg-white/5";

  const active =
    "bg-iris-600/20 text-white shadow-[inset_0_0_0_1px_rgba(139,92,246,0.35)]";

  return (
    <aside className="w-64 shrink-0 h-full flex flex-col border-r border-white/10 bg-black/70 backdrop-blur-xl">

      
      {/* ================= BRAND ================= */}
      <div className="flex flex-col items-center justify-center px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-iris-400 to-iris-600 bg-clip-text text-transparent">
          versona
        </h1>
        <p className="mt-1 text-xs tracking-wide text-iris-300/70">
          Urdu Voice Studio
        </p>
      </div>

      <div className="mx-6 h-px bg-white/10" />

      {/* ================= NAV ================= */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }
        >
          <User size={18} />
          Profile
        </NavLink>

        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }
        >
          <LayoutDashboard size={18} />
          Overview
        </NavLink>

        <NavLink
          to="/dashboard/text-to-speech"
          className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }
        >
          <Type size={18} />
          Text to Speech
        </NavLink>

        <NavLink
          to="/dashboard/audio-to-audio"
          className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }
        >
          <AudioLines size={18} />
          Audio to Audio
        </NavLink>

        <NavLink
          to="/dashboard/voice-cloning"
          className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }
        >
          <Mic size={18} />
          Voice Cloning
        </NavLink>

        <NavLink
          to="/dashboard/history"
          className={({ isActive }) =>
            `${navItem} ${isActive ? active : inactive}`
          }
        >
          <History size={18} />
          History
        </NavLink>
      </nav>

      <div className="mx-6 h-px bg-white/10" />

      {/* ================= SIGN OUT ================= */}
      <div className="p-6 flex justify-center">
        <button
          onClick={() => (window.location.href = "/")}
          className="
            text-sm 
            font-medium 
             
            hover:text-red-300 
            transition
          "
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
