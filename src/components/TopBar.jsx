import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function TopBar({ title, showLogout = false }) {
  const { currentUser, isAdmin, logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-900/60 border border-indigo-700/40 flex items-center justify-center text-indigo-300 font-bold text-sm">
          {currentUser?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="text-slate-200 font-semibold text-sm">
            {title}
          </p>
          {currentUser?.uniqueId ? <p className="text-slate-600 text-xs">ID: {currentUser?.uniqueId}</p>: ""}
        </div>
      </div>

      <span className="text-indigo-400 font-bold text-lg tracking-tight">
        ✦ BlogFlow
      </span>

      <div className="flex items-center gap-3">
        {showLogout && (
          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
