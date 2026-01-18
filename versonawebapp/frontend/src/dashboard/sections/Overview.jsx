import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Clock, Activity, Zap, Headphones, Wand2, MessageSquare, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchStats();
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/history/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-10 w-10 border-2 border-iris-500/20 border-t-iris-500 rounded-full"
        />
      </div>
    );
  }

  // Fallback data if stats are missing
  const generationTrend = stats?.daily_activity || [];
  const quota = {
    total: stats?.credits_limit || 1000,
    used: stats?.credits_used || 0,
    remaining: stats?.credits_remaining || 1000,
    percent: stats?.credits_percentage || 0
  };

  const statCards = [
    { label: "TTS", value: stats?.tts_generations || 0, icon: <MessageSquare size={14} />, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "STS", value: stats?.sts_conversions || 0, icon: <Headphones size={14} />, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Clones", value: stats?.voice_cloning || 0, icon: <Wand2 size={14} />, color: "text-iris-400", bg: "bg-iris-400/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex h-full flex-col gap-6"
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-sm text-white/50">Your voice studio analytics and usage.</p>
        </div>
        <div className="flex gap-2">
          {statCards.map((card, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5`}>
              <div className={`${card.bg} ${card.color} p-1 rounded-full`}>{card.icon}</div>
              <span className="text-xs font-bold text-white/80">{card.value} {card.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= TOP GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ===== GENERATION TREND ===== */}
        <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                <TrendingUp size={16} className="text-iris-400" />
                Activity Trend
              </h2>
              <p className="text-xs text-white/40">Generations over the last 7 days</p>
            </div>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={generationTrend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="#ffffff22"
                  tick={{ fontSize: 10, fill: '#ffffff44' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#ffffff22"
                  tick={{ fontSize: 10, fill: '#ffffff44' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ stroke: '#ffffff22', strokeWidth: 1 }}
                  contentStyle={{
                    background: "#0f0f12",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: '12px',
                    fontSize: 12,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ===== QUOTA ===== */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between shadow-2xl">
          <motion.div
            aria-hidden
            className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-iris-600/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div>
            <h2 className="text-sm font-semibold text-white/90">Usage Explorer</h2>
            <p className="text-xs text-white/40">Remaining credits</p>
          </div>

          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 36 36" className="h-full w-full rotate-[-90deg]">
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="16" fill="none" stroke="#8b5cf6" strokeWidth="3"
                  strokeDasharray="100 100" strokeLinecap="round"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - quota.percent }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">{quota.percent}%</span>
                <span className="text-[10px] text-white/40 font-medium">USED</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-white tracking-tight">{quota.remaining}</p>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Credits Available</p>
            </div>
          </div>

          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-iris-500"
              initial={{ width: 0 }}
              animate={{ width: `${quota.percent}%` }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </section>

      </div>

      {/* ================= BOTTOM GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ===== RECENT ACTIVITY ===== */}
        <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/90">Recent Discoveries</h2>
            <span className="text-[10px] text-iris-400 font-bold uppercase tracking-widest">Live Feed</span>
          </div>

          <div className="space-y-2.5">
            {stats?.daily_activity?.length > 0 ? (
              <div className="text-xs text-white/30 p-2 text-center bg-white/5 rounded-lg border border-white/5">
                Activity tracked for {stats.daily_activity.filter(d => d.count > 0).length} of last 7 days
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-white/30">
                <Zap size={24} className="mb-2 opacity-20" />
                <p className="text-xs font-medium">Waiting for your first generation...</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center">
                <span className="text-lg font-bold text-white">{stats?.tts_generations || 0}</span>
                <span className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">TTS Total</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center">
                <span className="text-lg font-bold text-white">{stats?.sts_conversions || 0}</span>
                <span className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">STS Total</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center">
                <span className="text-lg font-bold text-white">{stats?.voice_cloning || 0}</span>
                <span className="text-[9px] text-white/30 uppercase font-bold tracking-tighter">Clones Total</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SYSTEM TIME ===== */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between shadow-2xl relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-iris-500/50 group-hover:bg-iris-500 transition-colors" />

          <div>
            <h2 className="text-sm font-semibold text-white/90">System Integrity</h2>
            <p className="text-xs text-white/40">Status: Operational</p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 text-white">
              <Clock size={20} className="text-iris-400" />
              <span className="text-2xl font-bold tracking-tight">
                {now.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-white/40 font-medium ml-8">
              {now.toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <span>Server Region</span>
              <span className="text-white/60">Localhost</span>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
