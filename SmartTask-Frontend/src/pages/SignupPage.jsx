import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, Zap, ArrowRight, AlertCircle, Cpu, ShieldCheck } from 'lucide-react';

const ROLES = ['PM', 'Developer', 'Designer', 'QA Engineer', 'DevOps', 'Data Analyst', 'Tech Lead', 'Scrum Master'];

export default function SignupPage() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'Developer' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const strength = () => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-emerald-500'];
  const s = strength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Encryption key too short (min 6)'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = signup(form);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <div className="min-h-screen bg-void bg-mesh scanner-overlay flex items-center justify-center p-4 relative overflow-hidden">
      {/* Neural Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] ai-blob opacity-20 pointer-events-none" style={{ animationDirection: 'reverse' }} />
      <div className="absolute bottom-[-10%] left-[-10%] ai-blob opacity-10 pointer-events-none" style={{ filter: 'hue-rotate(260deg) blur(60px)' }} />
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center glow-cyan">
            <Zap size={24} className="text-void animate-pulse-slow" />
          </div>
          <div>
            <div className="font-syne font-800 text-2xl text-white tracking-tighter text-shimmer">NexTask</div>
            <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-[0.2em]">Neural Quiz Engine</div>
          </div>
        </div>

        <div className="cyber-card rounded-3xl p-8 border-white/5">
          <h1 className="font-syne text-3xl font-bold text-white mb-2">Registration</h1>
          <p className="text-ghost text-sm mb-8 font-mono">// Provision new intelligence node</p>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-6 text-rose-400 text-sm animate-shake">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-dim uppercase tracking-widest ml-1">Node Alias</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => update('username', e.target.value)}
                  placeholder="e.g. neuro_architect"
                  required
                  className="input-glass w-full px-5 py-3.5 rounded-xl text-sm"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-dim uppercase tracking-widest ml-1">Network Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="identity@nexTask.io"
                  required
                  className="input-glass w-full px-5 py-3.5 rounded-xl text-sm"
                />
              </div>

              {/* Role Select */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-dim uppercase tracking-widest ml-1">Operational Role</label>
                <div className="relative">
                  <select
                    value={form.role}
                    onChange={e => update('role', e.target.value)}
                    className="input-glass w-full px-5 py-3.5 rounded-xl text-sm appearance-none cursor-pointer"
                  >
                    {ROLES.map(r => <option key={r} value={r} className="bg-deep">{r}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <Cpu size={14} />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-dim uppercase tracking-widest ml-1">Encryption Key</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    className="input-glass w-full px-5 py-3.5 pr-14 rounded-xl text-sm"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ghost hover:text-cyan-400 transition-colors p-1">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {form.password && (
                  <div className="mt-3 px-1 animate-fade-in">
                    <div className="flex gap-1.5 h-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-full flex-1 rounded-full transition-all duration-500 ${i <= s ? strengthColor[s] : 'bg-white/5'}`} />
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] font-mono text-ghost/50 flex items-center gap-1">
                         <ShieldCheck size={10} /> {strengthLabel[s] || 'Analyzing...'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-3 mt-6 transition-all ${loading ? 'opacity-80' : 'hover:shadow-[0_0_30px_rgba(34,229,212,0.3)]'}`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-void rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-void rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-void rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              ) : (
                <>Initialize Node <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-ghost/60 text-xs mt-8 font-mono">
            Existing Node? <Link to="/login" className="text-cyan-400/80 hover:text-cyan-300 underline underline-offset-4">Re-establish Uplink</Link>
          </p>
        </div>
      </div>
    </div>
  );
}