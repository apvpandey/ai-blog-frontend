import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!name.trim() || !phone.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    const result = await loginAdmin(name, phone);
    if (result.success) {
      navigate('/admin-dashboard');
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">

      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between">
        <span className="text-indigo-400 font-bold text-lg tracking-tight">✦ BlogFlow</span>
        <button
          onClick={() => navigate('/')}
          className="text-xs px-4 py-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          ← Back
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
       
          <div className="mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-900/40 border border-indigo-700/40 flex items-center justify-center text-2xl mx-auto mb-4">
              🔐
            </div>
            <h1 className="text-xl font-bold text-slate-100 mb-1">Admin Portal</h1>
            <p className="text-slate-500 text-xs">Hint: admin / 123456789</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg text-sm bg-red-900/30 text-red-400 border border-red-800">
              {error}
            </div>
          )}


          <div className="mb-4">
            <label className="block text-slate-400 text-sm mb-2 font-medium">Admin Name</label>
            <input
              type="text"
              value={name} 
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="Admin"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors text-sm"
            />
          </div>

 
          <div className="mb-6">
            <label className="block text-slate-400 text-sm mb-2 font-medium">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="9999999999"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors text-sm"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-sm font-semibold shadow-lg shadow-indigo-900/30"
          >
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
}
