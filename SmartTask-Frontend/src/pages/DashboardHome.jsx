import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateProductivityInsights, prioritizeTasks } from '../utils/aiUtils';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { productivityData } from '../data/mockData';
import { TrendingUp, AlertTriangle, CheckCircle2, Clock, ArrowRight, Zap, Target, Brain, Activity } from 'lucide-react';
import clsx from 'clsx';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-void/90 border border-white/20 backdrop-blur-md rounded-xl px-4 py-2 shadow-2xl">
      <div className="text-[10px] font-mono text-cyan-400 mb-1 uppercase tracking-widest">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-xs font-bold text-white flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

export default function DashboardHome() {
  const { currentUser, getUserProjects, getUserTasks, tasks, projects } = useApp();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);

  const myProjects = getUserProjects(currentUser.user_id);
  const myTasks = getUserTasks(currentUser.user_id);
  const insights = generateProductivityInsights(tasks, currentUser.user_id);
  const prioritized = prioritizeTasks(myTasks, null).slice(0, 4);

  const stats = [
    { label: 'Neural Targets', value: insights.totalTasks, icon: Target, color: 'text-cyan-400', glow: 'shadow-[0_0_15px_rgba(34,229,212,0.2)]' },
    { label: 'Processed', value: insights.completedCount, icon: CheckCircle2, color: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(52,211,153,0.2)]' },
    { label: 'Progressing Tasks', value: insights.inProgressCount, icon: Clock, color: 'text-violet-400', glow: 'shadow-[0_0_15px_rgba(167,139,250,0.2)]' },
    { label: 'Overdue', value: insights.overdueCount, icon: AlertTriangle, color: 'text-rose-400', glow: 'shadow-[0_0_15px_rgba(251,113,133,0.2)]' },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* --- Neural Header --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em] mb-2">
            <Activity size={12} className="animate-pulse" /> System Uplink Active
          </div>
          <h1 className="font-syne text-4xl font-extrabold text-white tracking-tighter">
            Welcome, <span className="text-cyan-400">{currentUser.userName || currentUser.username}</span>
          </h1>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
           <div className="text-[10px] font-mono text-white/40 uppercase text-right">Node Timestamp</div>
           <div className="text-sm font-bold text-white uppercase tracking-tighter">
             {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
           </div>
        </div>
      </div>

      {/* --- Visual Stats Grid --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, glow }) => (
          <div key={label} className={clsx(
            'group relative overflow-hidden bg-white/5 border border-white/10 rounded-[24px] p-5 transition-all hover:bg-white/10 hover:border-white/20',
            glow
          )}>
            <div className="flex items-center justify-between mb-4">
               <div className={clsx('p-2.5 rounded-xl bg-white/5', color)}>
                 <Icon size={20} />
               </div>
               <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest group-hover:text-white/60 transition-colors">LIVE_DATA</div>
            </div>
            <div className={clsx('text-3xl font-syne font-black mb-1 text-white')}>
              {value}
            </div>
            <div className="text-xs font-bold text-white/40 uppercase tracking-tighter">{label}</div>
            {/* Subtle bottom glow line */}
            <div className={clsx('absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 bg-current', color)} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Column: AI Brain --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)]">
              <Brain size={18} className="text-white" />
            </div>
            <h2 className="font-syne font-bold text-xl text-white tracking-tight">Core Insights</h2>
          </div>

          <div className="space-y-3">
            {insights.insights.map((insight, i) => (
              <div key={i} className={clsx(
                'group rounded-2xl p-4 border transition-all duration-300',
                insight.type === 'positive' ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40' :
                insight.type === 'critical' ? 'bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40' :
                'bg-white/5 border-white/10 hover:border-white/20'
              )}>
                <div className="flex items-start gap-4">
                  <span className="text-2xl filter drop-shadow-md group-hover:scale-110 transition-transform">{insight.icon}</span>
                  <div>
                    <div className="font-bold text-white text-xs mb-1 uppercase tracking-tight">{insight.title}</div>
                    <div className="text-white/50 text-xs leading-relaxed">{insight.body}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sync Progress Circle */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 blur-3xl rounded-full" />
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.2em] mb-4 font-bold">Network Efficiency</div>
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg className="w-24 h-24 -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                <circle
                  cx="48" cy="48" r="40" stroke="#00f2fe" strokeWidth="8" fill="none"
                  strokeDasharray={`${(insights.completionRate / 100) * 251} 251`}
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(0,242,254,0.5)]"
                />
              </svg>
              <div className="absolute font-syne font-black text-2xl text-white">
                {insights.completionRate}%
              </div>
            </div>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              {insights.completedCount} / {insights.totalTasks} Units Synced
            </p>
          </div>
        </div>

        {/* --- Right Column: Output & Projects --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Chart Card */}
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-syne font-bold text-2xl text-white tracking-tight">Weekly Throughput</h2>
                <div className="text-xs font-mono text-white/40 mt-1 uppercase tracking-widest">// Monitoring processed logic units</div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,242,254,0.8)]" /> COMPLETED
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-white/20" /> PLANNED
                </div>
              </div>
            </div>
            
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivityData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="planned" stroke="rgba(255,255,255,0.1)" strokeWidth={2} fill="none" strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="completed" stroke="#00f2fe" strokeWidth={4} fill="url(#chartGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Projects Slider-style List */}
          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="font-syne font-bold text-xl text-white">Active Clusters</h2>
              <button onClick={() => navigate('/dashboard/projects')} className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2 hover:text-white transition-colors">
                Registry <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.slice(0, 4).map(p => (
                <button
                  key={p.project_id}
                  onClick={() => navigate(`/dashboard/projects/${p.project_id}`)}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all text-left overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="w-1.5 h-10 rounded-full shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.1)]" style={{ background: p.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{p.projectName}</div>
                    <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{p.userList?.length} Linked Nodes</div>
                  </div>
                  <ArrowRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- AI Priorities Section --- */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Zap size={22} className="text-black fill-current" />
            </div>
            <div>
              <h2 className="font-syne font-bold text-2xl text-white tracking-tighter uppercase">High-Yield Targets</h2>
              <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mt-0.5">// prioritized via logic engine</p>
            </div>
          </div>
          <button onClick={() => navigate('/dashboard/tasks')} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Full Queue
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {prioritized.map((task, i) => (
            <div key={task.task_id} className="relative group animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="absolute -top-3 -left-3 z-20 w-8 h-8 rounded-xl bg-black border border-white/20 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold shadow-xl group-hover:border-cyan-400 transition-colors">
                0{i + 1}
              </div>
              <TaskCard task={task} onClick={setSelectedTask} />
              <div className="mt-3 text-[10px] text-cyan-400/70 font-mono px-1 uppercase tracking-tighter flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-cyan-400" /> {task.priorityReason}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
}