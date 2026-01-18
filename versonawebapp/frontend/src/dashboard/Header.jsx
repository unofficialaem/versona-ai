import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  // Only show welcome text on dashboard overview
  const isOverview = location.pathname === "/dashboard";

  if (!isOverview) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">
        Welcome back
      </h1>
      <p className="mt-1 text-white/60 text-sm">
        This is your workspace for creating and managing Urdu voice output.
      </p>
    </div>
  );
}
