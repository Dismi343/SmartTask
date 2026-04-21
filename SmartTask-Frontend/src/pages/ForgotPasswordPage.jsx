import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowLeft, Mail, RefreshCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ForgotPasswordPage() {
  const {forgotPassword} = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    if (email.includes('@')) {
    try{
        await forgotPassword(email);
        setSubmitted(true);
      }
      catch(e)
      {console.error("Error sending recovery link:", e);}
    } else {
      setError('Invalid Access Identity detected.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-void bg-mesh scanner-overlay flex items-center justify-center p-4 relative overflow-hidden">
      {/* Neural Atmosphere Blobs */}
      <div className="absolute top-[-10%] left-[-10%] ai-blob opacity-20 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] ai-blob opacity-10 pointer-events-none" style={{ animationDelay: '-4s', filter: 'hue-rotate(180deg) blur(60px)' }} />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up z-10">
    

        <div className="cyber-card rounded-3xl p-10 border-white/5">
          {!submitted ? (
            <>
              <h1 className="font-syne text-3xl font-bold text-white mb-2">Recover Key</h1>
              <p className="text-white/50 text-sm mb-8 font-mono">// Enter identity to reset encryption</p>

              {error && (
                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-6 text-rose-400 text-sm animate-shake">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white uppercase tracking-widest ml-1">Access Identity</label>
                  <div className="relative text-white">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="identity@nexTask.io"
                      required
                      className="text-white input-glass w-full px-5 py-4 pl-12 rounded-xl text-sm focus:ring-1 ring-cyan-500/50 t"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white" size={18} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`text-white btn-primary w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-3 transition-all ${loading ? 'opacity-80' : 'hover:shadow-[0_0_30px_rgba(34,229,212,0.3)]'}`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCcw size={18} className="animate-spin" />
                      <span className="font-mono text-white/50 text-xs uppercase tracking-tighter">Decrypting...</span>
                    </div>
                  ) : (
                    <>Send Recovery Link <ArrowLeft size={18} className="rotate-180" /></>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-cyan-500/20 border border-cyan-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-cyan-400" />
              </div>
              <h2 className="font-syne text-2xl font-bold text-white mb-3">Uplink Sent</h2>
              <p className="text-white/75 text-sm font-mono mb-8 leading-relaxed">
                Recovery protocols have been dispatched to:<br/>
                <span className="text-cyan-400">{email}</span>
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-[10px] font-mono text-white hover:text-white uppercase tracking-[0.2em] transition-colors"
              >
                Try a different email
              </button>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-white/5">
            <Link
              to="/login"
              className="text-white btn-ghost w-full py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <ArrowLeft size={12} /> Return to Login
            </Link>
          </div>
        </div>

      
      </div>
    </div>
  );
}