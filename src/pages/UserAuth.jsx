import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function UserAuth() {
  const navigate = useNavigate();
  const { registerUser, loginUser } = useApp();

  const [name, setName] = useState("");
  const [message, setMessage] = useState(null);

  function showMsg(type, text) {
    setMessage({ type, text });
    if (type === "success") setTimeout(() => setMessage(null), 2500);
  }

  async function handleRegister() {
    if (!name.trim()) return showMsg("error", "Please enter your full name.");
    const result = await registerUser(name);

    console.log("result", result);
    if (result.success) {
      navigate("/all-blog");
    } else {
      showMsg("error", result.error);
    }
  }

  async function handleLogin() {
    if (!name.trim()) return showMsg("error", "Please enter your full name.");
    const result = await loginUser(name);
    if (result.success) {
      navigate("/all-blog");
    } else {
      showMsg("error", result.error);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-indigo-400 font-bold text-lg tracking-tight"
        >
          ✦ BlogFlow
        </button>
        <button
          onClick={() => navigate("/admin-login")}
          className="text-xs px-4 py-2 rounded-lg border border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all font-medium"
        >
          🔐 Admin
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-100 mb-2">
              Welcome to BlogFlow
            </h1>
            <p className="text-slate-500 text-sm">
              Enter your name to get started
            </p>
          </div>

          {message && (
            <div
              className={`mb-5 px-4 py-3 rounded-lg text-sm ${
                message.type === "error"
                  ? "bg-red-900/30 text-red-400 border border-red-800"
                  : "bg-green-900/30 text-green-400 border border-green-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-slate-400 text-sm mb-2 font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setMessage(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Ravi Sharma"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleLogin}
              className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-slate-100 transition-all text-sm font-semibold"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-sm font-semibold shadow-lg shadow-indigo-900/30"
            >
              Register
            </button>
          </div>

          <p className="text-center text-slate-600 text-xs mt-6">
            New user? Click <strong className="text-slate-500">Register</strong>
            . Already registered? Click{" "}
            <strong className="text-slate-500">Login</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
