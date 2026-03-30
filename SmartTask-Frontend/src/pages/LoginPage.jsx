import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Zap, ArrowRight, AlertCircle, Cpu } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // Added slight delay for "Thinking" feel
    const result = login(email, password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  const fillDemo = () => {
    setEmail('alex@nexTask.io');
    setPassword('pass123');
  };

  return (
    /* 1. Added bg-mesh for depth and scanner-overlay for high-tech feel */
    <div className="min-h-screen bg-void bg-mesh scanner-overlay flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* 2. Enhanced Animated Blobs for "Neural" atmosphere */}
      <div className="absolute top-[-10%] left-[-10%] ai-blob opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] ai-blob opacity-10 pointer-events-none" style={{ animationDelay: '-4s', filter: 'hue-rotate(90deg) blur(60px)' }} />
      
      {/* 3. Grid overlay for technical structure */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up z-10">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center glow-cyan transition-transform group-hover:scale-110 duration-500">
            <Cpu size={24} className="text-void animate-pulse-slow" />
          </div>
          <div>
            <div className="font-syne font-800 text-2xl text-white tracking-tighter text-shimmer">NexTask</div>
            <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-[0.2em]">Neural Quiz Engine</div>
          </div>
        </div>

        {/* 4. Using the cyber-card class for the main login container */}
        <div className="cyber-card rounded-3xl p-10 border-white/5">
          <h1 className="font-syne text-3xl font-bold text-white mb-2">Initialize</h1>
          <p className="text-ghost text-sm mb-8 font-mono">// Connect to your AI workspace</p>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-6 text-rose-400 text-sm animate-shake">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white uppercase tracking-widest ml-1">Access Identity</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="identity@nexTask.io"
                required
                className="input-glass w-full px-5 py-4 rounded-xl text-sm focus:ring-1 ring-cyan-500/50 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white uppercase tracking-widest ml-1">Encryption Key</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-glass w-full px-5 py-4 pr-14 rounded-xl text-sm focus:ring-1 ring-violet-500/50 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ghost hover:text-cyan-400 transition-colors p-2"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-3 mt-4 transition-all ${loading ? 'opacity-80' : 'hover:shadow-[0_0_30px_rgba(34,229,212,0.3)]'}`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-void rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-void rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-void rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              ) : (
                <>Establish Uplink <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Demo Button using btn-ghost style */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <button
              onClick={fillDemo}
              className="btn-ghost w-full py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Zap size={12} className="text-amber-400" /> Auto-Fill Demo Credentials
            </button>
          </div>
        </div>

        {/* Footer info links */}
        <p className="text-center text-ghost/60 text-xs mt-8 font-mono">
          System v4.0.2 // <Link to="/signup" className="text-cyan-400/80 hover:text-cyan-300 underline underline-offset-4">Create New Node</Link>
        </p>
      </div>
    </div>
  );
}