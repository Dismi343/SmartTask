import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Zap, Eye, EyeOff, ArrowRight, Mail, Lock, User, Cpu } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false); // Controlled loading state
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  
  const navigate = useNavigate();
  const { login, signup } = useApp();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Exact "Thinking" delay from your reference
    await new Promise(r => setTimeout(r, 1000)); 
    
    const result = isLogin 
      ? await login(form.email, form.password) 
      : await signup(form);

    if (result.success) {
      // Transition to dashboard after loading finishes
      navigate('/dashboard');
    } else {
      setLoading(false);
      alert(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-neural-bright flex items-center justify-center p-6 overflow-hidden font-syne">
      
      {/* Visual Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px]" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div className="w-full max-w-[450px] z-10 animate-slide-up">
        
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-10 group">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-4 transition-transform group-hover:scale-110 duration-500">
            <Zap size={32} className="text-black fill-current" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter text-shimmer">NexTask</h1>
          <span className="text-cyan-400 text-[11px] font-mono tracking-[0.4em] uppercase font-bold">SmartTask</span>
        </div>

        {/* Sliding Auth Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-white/5 border border-white/20 backdrop-blur-2xl shadow-2xl cyber-card">
          <div className={`auth-slide-container ${isLogin ? 'translate-x-0' : '-translate-x-1/2'}`}>
            
            {/* --- LOGIN SECTION --- */}
            <div className="w-1/2 p-10">
              <h2 className="text-3xl font-bold text-white mb-1 text-center">Login</h2>
              <p className="text-white/60 text-sm mb-8 font-mono text-center mt-6">// Check You Project Workload</p>
              
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="identity@gmail.com" 
                    className="input-eye-catching w-full pl-12 pr-4 py-4 rounded-2xl text-white" 
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                  <input 
                    type={showPass ? "text" : "password"} 
                    required
                    placeholder="Password" 
                    className="input-eye-catching w-full pl-12 pr-12 py-4 rounded-2xl text-white" 
                    onChange={e => setForm({...form, password: e.target.value})}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  ) : (
                    <>Login <ArrowRight size={20} /></>
                  )}
                </button>
              </form>
                <button onClick={()=>navigate("../forgot-password")} className="w-full mt-10 text-white/75 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                Forgot-password ? 
              </button>

              <button onClick={() => setIsLogin(false)} className="w-full my-15 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                — Create New User —
              </button>
            </div>

            {/* --- SIGNUP SECTION --- */}
            <div className="w-1/2 p-10">
              <h2 className="text-3xl font-bold text-white mb-1 text-center">Signup</h2>
              <p className="text-white/60 text-sm mb-8 font-mono text-center mt-7">// Create New User</p>
              
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                  <input type="text" placeholder="Username" className="input-eye-catching w-full pl-12 pr-4 py-4 rounded-2xl text-white" onChange={e => setForm({...form, username: e.target.value})} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                  <input type="email" placeholder="Email" className="input-eye-catching w-full pl-12 pr-4 py-4 rounded-2xl text-white" onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                  <input type="password" placeholder="Password" className="input-eye-catching w-full pl-12 pr-4 py-4 rounded-2xl text-white" onChange={e => setForm({...form, password: e.target.value})} />
                </div>
                <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                <select 
                    required
                    value={form.role || ""}
                    className="input-eye-catching w-full pl-12 pr-10 py-4 rounded-2xl text-white appearance-none cursor-pointer focus:ring-1 focus:ring-white/20 transition-all"
                    onChange={e => setForm({...form, role: e.target.value})}
                >
                    <option value="" disabled className="bg-abyss text-white/50 ">Select Role</option>
                    <option value="Developer" className="bg-abyss">Developer</option>
                    <option value="Tech Lead" className="bg-abyss">Tech Lead</option>
                    <option value="PM" className="bg-abyss">Project Manager</option>
                    <option value="Designer" className="bg-abyss">Designer</option>
                    <option value="QA Engineer" className="bg-abyss">QA Engineer</option>
                    <option value="DevOps" className="bg-abyss">DevOps</option>
                    <option value="Other" className="bg-abyss">Other</option>
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                    </svg>
                </div>
                </div>
                <button disabled={loading} className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-violet-400 transition-all mt-4">
                  {loading ? "Synchronizing..." : "Initialize Node"}
                </button>
              </form>
              <button onClick={() => setIsLogin(true)} className="w-full mt-8 text-white/40 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                — Back to Uplink —
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}