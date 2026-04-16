import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  generateProductivityInsights,
  prioritizeTasks,
  predictDelayRisk,
  generateAIInsight,
  getRiskColor
} from '../utils/aiUtils';
import { format, parseISO, differenceInDays } from 'date-fns';
import {
  Brain, Zap, AlertTriangle, TrendingUp, Target, RefreshCw,
  ChevronRight, Loader2, CheckCircle2, Clock, BarChart3, Users
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend
} from 'recharts';
import { productivityData, completionHistory } from '../data/mockData';
import clsx from 'clsx';

// --- Sub-components ---

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-ghost mb-1 font-mono">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2" style={{ color: p.color }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="font-medium text-bright">{p.name}: {p.value}</span>
        </div>
      ))}
    </div>
  );
};

function RiskMeter({ score, level }) {
  const colors = { high: '#fb7185', medium: '#fbbf24', low: '#34d399', minimal: '#6b75b0', none: '#3d4470' };
  const color = colors[level] || colors.none;
  const angle = (score / 100) * 180;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-32 h-20">
        <defs>
          <linearGradient id="meterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
        </defs>
        <path d="M10,60 A50,50 0 0,1 110,60" fill="none" stroke="#1a1e35" strokeWidth="8" strokeLinecap="round" />
        <path d="M10,60 A50,50 0 0,1 110,60" fill="none" stroke="url(#meterGrad)" strokeWidth="8"
          strokeLinecap="round" strokeDasharray={`${(score / 100) * 157} 157`} />
        <line
          x1="60" y1="60"
          x2={60 + 35 * Math.cos((180 - angle) * Math.PI / 180)}
          y2={60 - 35 * Math.sin((180 - angle) * Math.PI / 180)}
          stroke={color} strokeWidth="2" strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
        <circle cx="60" cy="60" r="4" fill={color} />
      </svg>
      <div className="text-xl font-syne font-bold mt-1" style={{ color }}>{score}%</div>
      <div className="text-[10px] uppercase tracking-wider text-ghost font-bold">{level} risk</div>
    </div>
  );
}

// --- Main Component ---

export default function AIInsightsPage() {
  const { currentUser, tasks, users, getUserProjects,projects, getUserTasks, getUserById } = useApp();
  const [aiSummary, setAiSummary] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(currentUser.user_id);

    // Derived Data
  const myTasks = getUserTasks(selectedUser) || [];
  const insights = generateProductivityInsights(tasks, selectedUser);
  const prioritized = prioritizeTasks(myTasks, null);

  const allProjectTasks = projects.flatMap(p =>
    tasks.filter(t => t.project_id === p.project_id)
  );

  const riskDistribution = allProjectTasks.reduce((acc, t) => {
    const assignees = t.assigneeIds.map(id => getUserById(id)).filter(Boolean);
    const risk = predictDelayRisk(t, assignees);
    acc[risk.level] = (acc[risk.level] || 0) + 1;
    return acc;
  }, {});

  const riskChartData = [
    { name: 'High', value: riskDistribution.high || 0, fill: '#fb7185' },
    { name: 'Medium', value: riskDistribution.medium || 0, fill: '#fbbf24' },
    { name: 'Low', value: riskDistribution.low || 0, fill: '#34d399' },
    { name: 'Minimal', value: riskDistribution.minimal || 0, fill: '#6b75b0' },
  ];

  const avgRisk = allProjectTasks.length > 0
    ? Math.round(allProjectTasks.reduce((sum, t) => {
        const assignees = t.assigneeIds.map(id => getUserById(id)).filter(Boolean);
        return sum + predictDelayRisk(t, assignees).score;
      }, 0) / allProjectTasks.length)
    : 0;

  const overallRiskLevel = avgRisk >= 60 ? 'high' : avgRisk >= 35 ? 'medium' : avgRisk >= 15 ? 'low' : 'minimal';

  const radarData = [
    { subject: 'On-Time', value: insights.onTimeRate },
    { subject: 'Completion', value: insights.completionRate },
    { subject: 'Throughput', value: Math.min(100, insights.completedCount * 10) },
    { subject: 'Focus', value: Math.max(0, 100 - insights.inProgressCount * 15) },
    { subject: 'Quality', value: insights.overdueCount === 0 ? 90 : Math.max(30, 90 - insights.overdueCount * 15) },
  ];

  const teamAvgOnTime = Math.round(
    completionHistory.reduce((sum, h) => sum + h.onTime / (h.onTime + h.late) * 100, 0) / completionHistory.length
  );

  const loadAISummary = async () => {
    setLoadingAI(true);
    const user = getUserById(selectedUser);
    try {
      const summary = await generateAIInsight(
        `Provide a personalized productivity coaching insight for ${user?.username}. Focus on their ${insights.completionRate}% completion rate.`,
        {
          user: { username: user?.username, role: user?.role },
          metrics: insights,
          topPriorityTask: prioritized[0]?.taskTitle,
          avgRiskScore: avgRisk,
        }
      );
      setAiSummary(summary);
    } catch (error) {
      setAiSummary("Unable to generate AI coaching at this moment. Please try again later.");
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    loadAISummary();
  }, [selectedUser]);

  const TABS = [
    { id: 'overview', label: 'Overview', icon: Brain },
    { id: 'risks', label: 'Risk Analysis', icon: AlertTriangle },
    { id: 'productivity', label: 'Productivity', icon: TrendingUp },
    { id: 'prioritization', label: 'Task Priorities', icon: Zap },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* --- Header Section --- */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain size={20} className="text-violet-400" />
            <h1 className="font-syne text-2xl font-bold text-white">AI Insights</h1>
            <span className="text-[10px] font-mono bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full border border-violet-500/20 ml-2 uppercase tracking-tighter">
              Analytical Engine
            </span>
          </div>
          <p className="text-ghost text-sm">Predictive performance tracking and workflow optimization</p>
        </div>

        {currentUser.role === 'PM' && (
          <div className="flex items-center gap-3 bg-surface border border-border p-1.5 rounded-xl">
            <span className="text-[10px] font-bold text-ghost uppercase ml-2">Viewing:</span>
            <select 
              value={selectedUser} 
              onChange={e => setSelectedUser(e.target.value)}
              className="bg-deep text-bright text-xs px-3 py-1.5 rounded-lg border border-border focus:outline-none focus:border-violet-500/50"
            >
              {users.map(u => <option key={u.user_id} value={u.user_id}>{u.username} ({u.role})</option>)}
            </select>
          </div>
        )}
      </div>

      {/* --- AI Coaching Card --- */}
      <div className="relative group overflow-hidden bg-surface border border-border rounded-2xl p-6 transition-all hover:border-violet-500/30">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Brain size={80} className="text-violet-400" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
              <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Live AI Coaching</span>
            </div>
            <button 
              onClick={loadAISummary} 
              disabled={loadingAI}
              className="p-2 hover:bg-white/5 rounded-lg text-ghost hover:text-bright transition-colors"
            >
              <RefreshCw size={14} className={loadingAI ? 'animate-spin' : ''} />
            </button>
          </div>

          {loadingAI ? (
            <div className="space-y-3">
              <div className="h-2 bg-border rounded w-full animate-pulse" />
              <div className="h-2 bg-border rounded w-4/5 animate-pulse" />
              <div className="h-2 bg-border rounded w-2/3 animate-pulse" />
            </div>
          ) : (
            <p className="text-dim text-sm leading-relaxed max-w-3xl italic">
              "{aiSummary || "Select a user to generate performance insights..."}"
            </p>
          )}
        </div>
      </div>

      {/* --- Navigation Tabs --- */}
      <div className="flex p-1 bg-surface/50 border border-border rounded-xl backdrop-blur-sm">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button 
            key={id} 
            onClick={() => setActiveTab(id)}
            className={clsx(
              'flex items-center justify-center gap-2 flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200',
              activeTab === id 
                ? 'bg-elevated text-bright shadow-lg border border-border' 
                : 'text-ghost hover:text-dim hover:bg-white/5'
            )}
          >
            <Icon size={14} />
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* --- Content Area --- */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-syne font-bold text-bright text-sm mb-6 flex items-center gap-2">
                <Target size={14} className="text-cyan-400" />
                Performance Equilibrium
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#2d3355" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9098c8', fontSize: 10, fontWeight: 600 }} />
                  <Radar 
                    name="Performance" 
                    dataKey="value" 
                    stroke="#22e5d4" 
                    fill="#22e5d4" 
                    fillOpacity={0.1} 
                    strokeWidth={2} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Project Completion', value: insights.completionRate, color: 'text-cyan-400', bg: 'bg-cyan-500' },
                { label: 'Punctuality Score', value: insights.onTimeRate, color: 'text-violet-400', bg: 'bg-violet-500' },
              ].map(m => (
                <div key={m.label} className="bg-surface border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-ghost">{m.label}</span>
                    <span className={clsx('text-xl font-syne font-bold', m.color)}>{m.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-deep rounded-full overflow-hidden">
                    <div 
                      className={clsx('h-full rounded-full transition-all duration-1000', m.bg)} 
                      style={{ width: `${m.value}%` }} 
                    />
                  </div>
                </div>
              ))}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface border border-border rounded-2xl p-4">
                  <div className="text-[10px] text-ghost uppercase font-bold mb-1">Total Tasks</div>
                  <div className="text-2xl font-syne font-bold text-bright">{insights.totalTasks}</div>
                </div>
                <div className="bg-surface border border-border rounded-2xl p-4">
                  <div className="text-[10px] text-ghost uppercase font-bold mb-1">Overdue</div>
                  <div className="text-2xl font-syne font-bold text-rose-400">{insights.overdueCount}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col items-center justify-center">
                <h3 className="font-syne font-bold text-bright text-sm mb-6 uppercase tracking-widest">Portfolio Risk Index</h3>
                <RiskMeter score={avgRisk} level={overallRiskLevel} />
              </div>

              <div className="bg-surface border border-border rounded-2xl p-6">
                <h3 className="font-syne font-bold text-bright text-sm mb-6">Task Vulnerability Scale</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={riskChartData}>
                    <XAxis dataKey="name" tick={{ fill: '#6b75b0', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {riskChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-white/5 flex items-center justify-between">
                <h3 className="text-xs font-bold text-bright uppercase tracking-wider">Attention Required</h3>
                <span className="text-[10px] font-mono text-ghost">Based on 14 data points</span>
              </div>
              <div className="divide-y divide-border">
                {allProjectTasks
                  .filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED')
                  .map(t => {
                    const assignees = t.assigneeIds.map(id => getUserById(id)).filter(Boolean);
                    const risk = predictDelayRisk(t, assignees);
                    if (risk.score < 30) return null;
                    const rc = getRiskColor(risk.level);
                    return (
                      <div key={t.task_id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-bright mb-1">{t.taskTitle}</div>
                          <div className="flex gap-2">
                            {risk.factors.slice(0, 2).map((f, i) => (
                              <span key={i} className="text-[10px] bg-deep px-2 py-0.5 rounded border border-border text-ghost">
                                {f.label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className={clsx('text-sm font-mono font-bold', rc.text)}>{risk.score}% Risk</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ... Other tabs follow similar logic using myTasks and prioritized data ... */}
        {activeTab === 'prioritization' && (
           <div className="space-y-4 animate-slide-up">
              {prioritized.map((task, i) => (
                <div key={task.task_id} className="bg-surface border border-border rounded-xl p-4 flex items-center gap-4 hover:border-cyan-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-deep flex items-center justify-center font-syne font-bold text-cyan-400 border border-border">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-bright">{task.taskTitle}</h4>
                    <p className="text-xs text-ghost">{task.priorityReason}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={clsx('text-[10px] px-2 py-0.5 rounded font-bold uppercase', 
                      task.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400')}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] font-mono text-ghost">{Math.round(task.urgencyScore)} pts</span>
                  </div>
                </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
}