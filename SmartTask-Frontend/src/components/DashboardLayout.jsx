import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Zap, LayoutDashboard, FolderOpen, CheckSquare, Brain,
  LogOut, Menu, X, Activity, Shield, Cpu
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const NAV = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
  { to: '/dashboard/tasks', label: 'My Tasks', icon: CheckSquare },
  { to: '/dashboard/ai-insights', label: 'AI Insights', icon: Brain },
];

const ROLE_STYLES = {
  PM: 'text-violet-400 bg-violet-500/10 border-violet-500/30 glow-violet-xs',
  Developer: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 glow-cyan-xs',
  Designer: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  'QA Engineer': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  DevOps: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  default: 'text-white/40 bg-white/5 border-white/10',
};

const ROLE_ABBREVIATIONS = {
  Developer: 'Dev',
  'Tech Lead': 'TL',
  PM: 'PM',
  Designer: 'Des',
  'QA Engineer': 'QA',
  DevOps: 'DevOps',
};

export default function DashboardLayout() {
  const { currentUser, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to);
  const roleStyle = ROLE_STYLES[currentUser?.role] || ROLE_STYLES.default;
  const roleDisplay = ROLE_ABBREVIATIONS[currentUser?.role] || currentUser?.role;

  return (
    <div className="flex h-screen bg-[#070810] overflow-hidden font-syne">
      {/* Mobile Blur Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden transition-opacity" onClick={() => setSidebarOpen(false)} />
      )}

      {/* --- Sidebar (Neural Control Deck) --- */}
      <aside className={clsx(
        'fixed lg:relative z-50 flex flex-col w-72 h-full bg-[#0d0f1a]/80 backdrop-blur-2xl border-r border-white/5 transition-all duration-500 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Branding Container */}
        <div className="flex items-center gap-4 px-8 py-8">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] group cursor-pointer">
            <Zap size={20} className="text-black fill-current group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="font-extrabold text-xl text-white tracking-tighter uppercase">Smart-Task</div>
            {/* <div className="text-[9px] font-mono text-cyan-400 tracking-[0.3em] uppercase opacity-70">Neural Link v4</div> */}
          </div>
          <button className="ml-auto lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* User Identity Module */}
        <div className="px-6 mb-8">
          <div className="p-4 rounded-[24px] bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-white shadow-inner">
                {roleDisplay}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-white truncate leading-none mb-1.5">{currentUser?.username || currentUser?.userName}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] px-4 mb-4">Core Modules</div>
          {NAV.map(({ to, label, icon: Icon, exact }) => {
            const active = isActive(to, exact);
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  'group flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden',
                  active
                    ? 'bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon size={18} className={clsx(active ? 'text-black' : 'text-white/40 group-hover:text-cyan-400')} />
                <span className="tracking-tight">{label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                )}
                {!active && label === 'AI Insights' && (
                  <div className="ml-auto px-2 py-0.5 rounded-md bg-cyan-400/10 border border-cyan-400/20 text-[9px] font-mono text-cyan-400">
                    LIVE
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Footer */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-sm font-bold text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* --- Main Viewport --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Dynamic Background Glow for Main Content */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

        {/* Global Top Bar */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#070810]/40 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl bg-white/5 text-white hover:bg-white/10"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Activity size={14} className="text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-widest">Neural Link: Nominal</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end hidden sm:block">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Small steps lead to big milestones.</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                <Shield size={12} /> AI-Secured Workspace
              </span>
            </div>
            {/* <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white cursor-pointer transition-colors relative">
              <Cpu size={20} />
              <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 rounded-full border-2 border-[#070810]" />
            </div> */}
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="p-8 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}