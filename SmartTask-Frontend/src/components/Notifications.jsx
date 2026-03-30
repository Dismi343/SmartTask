import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, Zap, Activity } from 'lucide-react';
import clsx from 'clsx';

const icons = {
  success: <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />,
  error: <AlertCircle size={16} className="text-rose-400 flex-shrink-0 drop-shadow-[0_0_5px_rgba(251,113,133,0.5)]" />,
  warning: <AlertCircle size={16} className="text-amber-400 flex-shrink-0 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" />,
  info: <Zap size={16} className="text-cyan-400 flex-shrink-0 drop-shadow-[0_0_5px_rgba(34,229,212,0.5)]" />,
};

const styles = {
  success: 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(52,211,153,0.1)]',
  error: 'border-rose-500/40 bg-rose-500/5 shadow-[0_0_20px_rgba(251,113,133,0.1)]',
  warning: 'border-amber-500/40 bg-amber-500/5 shadow-[0_0_20px_rgba(251,191,36,0.1)]',
  info: 'border-cyan-500/40 bg-cyan-500/5 shadow-[0_0_20px_rgba(34,229,212,0.1)]',
};

export default function Notifications() {
  const { notifications } = useApp();

  return (
    <div className="fixed top-6 right-6 z-[9999] space-y-3 pointer-events-none w-full max-w-[380px]">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={clsx(
            'relative flex items-center gap-4 px-5 py-4 rounded-[20px] border backdrop-blur-2xl transition-all duration-500 animate-slide-up pointer-events-auto group overflow-hidden',
            styles[n.type] || styles.info
          )}
        >
          {/* Animated Background Scanline */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full animate-shimmer" />
          
          {/* Icon with status-colored glow */}
          <div className="relative z-10">
            {icons[n.type] || icons.info}
          </div>

          <div className="flex flex-col z-10 min-w-0">
            <div className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] opacity-40 mb-0.5">
              System Notification
            </div>
            <span className="text-sm font-bold text-white tracking-tight leading-tight truncate">
              {n.message}
            </span>
          </div>

          {/* Activity Dot */}
          <div className="ml-auto relative flex h-2 w-2 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white/20" />
          </div>
        </div>
      ))}
    </div>
  );
}