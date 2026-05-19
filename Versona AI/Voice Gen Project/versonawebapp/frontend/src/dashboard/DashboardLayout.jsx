import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import { Menu, X } from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showHeader = location.pathname === "/dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-jet-black">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />

          <div className="absolute left-0 top-0 h-full">
            <Sidebar mobile onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.035] text-white/80"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="text-center">
            <p className="bg-gradient-to-r from-white via-[#DDD6FE] to-[#8B5CF6] bg-clip-text text-sm font-bold tracking-[0.16em] text-transparent">
              VERSONA
            </p>
          </div>

          <div className="h-10 w-10" />
        </div>

        {showHeader && (
          <div className="shrink-0 px-4 pt-5 sm:px-6 lg:px-10 lg:pt-8">
            <Header />
          </div>
        )}

        <div className="flex-1 overflow-auto px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}