import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

import {
  Clock,
  Gauge,
  Headphones,
  Wand2,
  MessageSquare,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { HISTORY_API } from '../../config/api';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchStats();
    const timer = setInterval(() => setNow(new Date()), 3000);
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${HISTORY_API}/stats`, {
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
    total: stats?.credits_limit || 3000,
    used: stats?.credits_used || 0,
    remaining: stats?.credits_remaining || 3000,
    percent: stats?.credits_percentage || 0
  };

  const statCards = [
    { label: "TTS", value: stats?.tts_generations || 0, icon: <MessageSquare size={14} />, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "STS", value: stats?.sts_conversions || 0, icon: <Headphones size={14} />, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Clones", value: stats?.voice_cloning || 0, icon: <Wand2 size={14} />, color: "text-iris-400", bg: "bg-iris-400/10" },
  ];

  const breakdownData = [
  { name: "TTS", value: stats?.tts_generations || 0, color: "#60A5FA" },
  { name: "STS", value: stats?.sts_conversions || 0, color: "#34D399" },
  { name: "Cloning", value: stats?.voice_cloning || 0, color: "#A78BFA" },
];

const totalGenerations =
  (stats?.tts_generations || 0) +
  (stats?.sts_conversions || 0) +
  (stats?.voice_cloning || 0);

const mostUsed = breakdownData.reduce((a, b) =>
  a.value > b.value ? a : b
);

const activeDays = generationTrend.filter((d) => d.count > 0).length;

const avgPerDay = Math.round(totalGenerations / 7);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex min-h-full flex-col gap-6 pb-8"
    >
      {/* ================= HEADER ================= */}
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

  {/* LEFT */}
  <div>
    <h1 className="text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
      Overview
    </h1>

    <p className="mt-1 text-sm text-white/45">
      Track generations, usage, and activity.
    </p>
  </div>

  
</div>

      {/* ================= TOP GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ===== GENERATION TREND ===== */}
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                <TrendingUp size={16} className="text-iris-400" />
                Activity Trend
              </h2>
              <p className="text-xs text-white/40">
              Daily generation count over the last 7 days
              </p>
            </div>
          </div>

          <div className="h-[160px] w-full sm:h-[180px]">
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
                  tick={{ fontSize: 10, fill: "#ffffff44" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={24}
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
                type="natural"
                dataKey="count"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCount)"
                animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ===== QUOTA ===== */}
        <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <motion.div
            aria-hidden
            className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-iris-600/20 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white/90">
            <Gauge size={15} className="text-iris-300" />
            Usage Explorer
            </h2>
            <p className="text-xs text-white/40">Remaining credits</p>
          </div>

          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative h-20 w-20">
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
                <span className="text-sm font-semibold text-white">{quota.percent}%</span>
                <span className="text-[10px] text-white/40 font-medium">USED</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-lg font-semibold text-white">{quota.remaining}</p>
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

     
    
{/* BOTTOM GRID */}
<div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr_0.8fr]">
  {/* BAR CHART */}
  <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
    <div className="mb-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-white/90">
        <BarChart3 size={15} className="text-iris-300" />
        Generation Breakdown
      </h2>
      <p className="mt-1 text-xs text-white/40">
        Total usage by generation mode
      </p>
    </div>

    <div className="mx-auto h-[135px] w-full max-w-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={breakdownData} barCategoryGap="8%">
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#ffffff55", fontWeight: 600 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            width={22}
            tick={{ fontSize: 10, fill: "#ffffff35" }}
          />

          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            formatter={(value) => [`${value}`, "Generations"]}
            contentStyle={{
              background: "#0B0B10",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "14px",
              fontSize: 12,
            }}
          />

          <Bar dataKey="value" radius={[12, 12, 5, 5]} maxBarSize={64}>
            <Cell fill="#8B5CF6" />
            <Cell fill="#A78BFA" />
            <Cell fill="#DDD6FE" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>

  {/* PIE + SYSTEM */}
  <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-white/90">
          <PieIcon size={15} className="text-iris-300" />
          Usage Share
        </h2>
        <p className="mt-1 text-xs text-white/40">Mode distribution</p>
      </div>

      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
        Live
      </span>
    </div>

    <div className="grid items-center gap-4 sm:grid-cols-[0.8fr_1fr]">
      <div className="h-[120px] min-w-0 overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={breakdownData}
              dataKey="value"
              nameKey="name"
              innerRadius={34}
              outerRadius={50}
              paddingAngle={4}
            >
              <Cell fill="#8B5CF6" />
              <Cell fill="#A78BFA" />
              <Cell fill="#DDD6FE" />
            </Pie>

            <Tooltip
              formatter={(value) => [`${value}`, "Generations"]}
              contentStyle={{
                background: "#0B0B10",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "14px",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2.5">
        {breakdownData.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: ["#8B5CF6", "#A78BFA", "#DDD6FE"][index],
                }}
              />
              <span className="text-sm text-white/55">{item.name}</span>
            </div>

            <span className="text-sm font-semibold text-white/80">
              {item.value}
            </span>
          </div>
        ))}

        <div className="mt-3 border-t border-white/10 pt-3">
          <div className="flex items-center gap-3">
            <Clock size={17} className="text-iris-300" />
            <div>
              <p className="text-base font-semibold text-white">
                {now.toLocaleTimeString([], {
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-white/35">System operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* INSIGHTS */}
  <section className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-iris-500/12 blur-3xl" />

    <div className="mb-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-white/90">
        <Sparkles size={15} className="text-iris-300" />
        Insights
      </h2>
      <p className="mt-1 text-xs text-white/40">Smart summary</p>
    </div>

    <div className="space-y-2.5">
      {[
        ["Most used", mostUsed.name],
        ["Total", totalGenerations],
        ["Avg / day", avgPerDay],
        ["Active", `${activeDays}/7`],
      ].map(([label, value]) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2.5"
        >
          <span className="text-xs text-white/45">{label}</span>
          <span className="text-sm font-semibold text-white">{value}</span>
        </div>
      ))}
    </div>
  </section>
</div>
</motion.div>);
}