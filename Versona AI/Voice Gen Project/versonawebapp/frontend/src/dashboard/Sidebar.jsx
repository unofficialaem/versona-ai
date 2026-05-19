import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo2-nobg.svg";
import {
  User,
  LayoutDashboard,
  Type,
  AudioLines,
  Mic,
  History,
  LogOut,
} from "lucide-react";

export default function Sidebar({ mobile = false, onNavigate }) {
  const items = [
    { to: "/dashboard/profile", label: "Profile", Icon: User },
    { to: "/dashboard", label: "Overview", Icon: LayoutDashboard, end: true },
    { to: "/dashboard/text-to-speech", label: "Text to Speech", Icon: Type },
    { to: "/dashboard/audio-to-audio", label: "Audio to Audio", Icon: AudioLines },
    { to: "/dashboard/voice-cloning", label: "Voice Cloning", Icon: Mic },
    { to: "/dashboard/history", label: "History", Icon: History },
  ];

  const navBase =
    "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300";

  return (
    <aside
      className={`relative h-full w-[220px] shrink-0 border-r border-white/10 bg-[#06060A] ${
        mobile ? "flex flex-col" : "hidden lg:flex lg:flex-col"
      }`}
    >
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(300px_circle_at_0%_0%,rgba(139,92,246,0.06),transparent_45%)]" />

      {/* ===== BRAND ===== */}
      {/* ===== BRAND ===== */}
<div className="relative px-5 pb-6 pt-7">
  <div className="pointer-events-none absolute left-4 top-5 h-16 w-28 rounded-full bg-iris-500/15 blur-2xl" />

  <div className="flex items-center gap-3">
  
  {/* Logo */}
  <img
    src={logo}
    alt="versona"
    className="h-7 w-7 object-contain"
  />

  {/* Brand */}
  <h1 className="text-[15px] font-medium tracking-[0.12em] lowercase text-white/90">
    versona
  </h1>

</div>
</div>

      <div className="mx-5 h-px bg-white/10" />

      {/* ===== NAV ===== */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        {items.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                navBase,
                isActive
                  ? "bg-white/[0.06] text-white"
                  : "text-white/60 hover:bg-white/[0.04] hover:text-white",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                {/* ACTIVE BAR */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#8B5CF6]" />
                )}

                {/* ICON */}
                <span
                  className={`grid h-8 w-8 place-items-center rounded-lg border ${
                    isActive
                      ? "border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]"
                      : "border-white/10 bg-white/[0.02] text-white/50 group-hover:text-white"
                  }`}
                >
                  <Icon size={17} strokeWidth={2} />
                </span>

                {/* TEXT */}
                <span className="tracking-[-0.01em]">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ===== SIGN OUT ===== */}
      <div className="px-3 pb-5">
        <div className="mb-4 mx-2 h-px bg-white/10" />

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-white/60 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}