import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";

export default function DashboardLayout() {
  const location = useLocation();

  // Show header ONLY on overview
  const showHeader = location.pathname === "/dashboard";

  return (
    <div className="flex h-screen bg-jet-black overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {showHeader && (
          <div className="px-6 lg:px-10 pt-6 lg:pt-8 shrink-0">
            <Header />
          </div>
        )}

        <div className="flex-1 px-6 lg:px-10 py-6 lg:py-8 overflow-hidden">
          <Outlet />
        </div>

      </div>
    </div>
  );
}
