import { useSearchParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, RefreshCcw, AlertCircle, CheckCircle2, Eye,EyeOff } from 'lucide-react';

export default function PasswordResetPage() {
    const { updatePassword } = useApp();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); 
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRequestLink = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        // Logic to send reset link
        await new Promise(r => setTimeout(r, 1000));
        setSuccess(true);
        setLoading(false);
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return setError("Encryption keys do not match.");
        
        setError('');
        setLoading(true);
        try {
            await updatePassword(token, password);
            setSuccess(true);
        } catch (err) {
            setError("Protocol failure: Link may be expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void bg-mesh scanner-overlay flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] ai-blob opacity-20 pointer-events-none" />
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

            <div className="w-full max-w-md animate-slide-up z-10">
               

                <div className="cyber-card rounded-3xl p-10 border-white/5">
                    {success ? (
                        <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-cyan-500/20 border border-cyan-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={32} className="text-cyan-400" />
                            </div>
                            <h2 className="font-syne text-2xl font-bold text-white mb-3">
                                {token ? "Protocol Updated" : "Uplink Sent"}
                            </h2>
                            <p className="text-ghost text-sm font-mono mb-8">
                                {token ? "// Security credentials re-encrypted." : "// Check your identity inbox."}
                            </p>
                            <Link to="/login" className="btn-primary w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                                Back to Uplink <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="font-syne text-3xl font-bold text-white mb-2">
                                {token ? "Re-Encrypt" : "Recover Identity"}
                            </h1>
                            <p className="text-ghost text-sm mb-8 font-mono">
                                {token ? "// Define new security credentials" : "// Access system override"}
                            </p>

                            {error && (
                                <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3 mb-6 text-rose-400 text-sm animate-shake">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={token ? handleResetSubmit : handleRequestLink} className="space-y-5">
                                {token ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono text-white uppercase tracking-widest ml-1">New Key</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="input-glass w-full px-5 py-4 pl-12 rounded-xl text-sm text-white"
                                                    required
                                                />
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost/40" size={18} />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-mono text-white uppercase tracking-widest ml-1">Confirm Key</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="input-glass w-full px-5 py-4 pl-12 rounded-xl text-sm text-white"
                                                    required
                                                />
                                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-white uppercase tracking-widest ml-1">Identity Email</label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="identity@nexTask.io"
                                                className="input-glass w-full px-5 py-4 pl-12 rounded-xl text-sm text-white"
                                                required
                                            />
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost/40" size={18} />
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`btn-primary w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-3 transition-all text-white/75 ${loading ? 'opacity-80' : 'hover:bg-gray-600 hover:text-white'}`}
                                >
                                    {loading ? <RefreshCcw size={18} className="text-white animate-spin" /> : (
                                        <>{token ? "Update Credentials" : "Send Recovery Link"} <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <Link to="/login" className="btn-ghost text-white/50 w-full py-3 rounded-xl text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2">
                            <ArrowLeft size={12} /> Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}