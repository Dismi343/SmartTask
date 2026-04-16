import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { predictDelayRisk, generateAIInsight } from '../utils/aiUtils';
import { format, parseISO } from 'date-fns';
import { X, AlertTriangle, Calendar, Brain, Loader2, Zap, Activity, Cpu, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import axios from 'axios';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'Processing', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];

export default function TaskModal({ task, onClose }) {
  const { getUserById, updateTask, getProjectById } = useApp();
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [editStatus, setEditStatus] = useState(task.status);
  const [editPriority, setEditPriority] = useState(task.priority);

  const assignees = task.assigneeIds.map(id => getUserById(id)).filter(Boolean);
  const risk = predictDelayRisk(task, assignees);
  const project = getProjectById(task.project_id);

  useEffect(() => {
    loadAIInsight();
  }, []);

  const loadAIInsight = async () => {
    setLoadingAI(true);
    // const insight = await generateAIInsight(
    //   'Analyze this task and provide a brief actionable recommendation for the team.',
    //   { task: { title: task.taskTitle, status: task.status, priority: task.priority, deadline: task.deadline, description: task.description }, riskLevel: risk.level, daysRemaining: risk.score }
    // );
    try{
    const insight = await axios.post('http://127.0.0.1:8000/ai/task-insight',{
      taskTitle: task.taskTitle,
      status: task.status,
      priority: task.priority,
      deadline: task.deadline,
      description: task.description
    });
    //console.log("AI Insight:", insight?.data?.response);
    setAiInsight(insight?.data?.response);
    setLoadingAI(false);
  }
  catch(error){
    console.error("Error fetching AI insight:", error);
    setAiInsight("Unable to fetch AI insight at this time.");
    setLoadingAI(false);
    return;
  }
  
  };

  const parseAIInsight = (text) => {
    if (!text) return null;
    
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') || part.startsWith('*') && part.endsWith('*')) {
        return (
          <span key={index} className="font-bold text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded-md">
            {part.slice(2, -2)}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleSave = () => {
    updateTask(task.task_id, { status: editStatus, priority: editPriority, deadline: task.deadline, taskTitle: task.taskTitle });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      {/* Neural Backdrop */}
      <div className="absolute inset-0 bg-[#070810]/90 backdrop-blur-xl transition-opacity animate-fade-in" />
      
      <div
        className="relative w-full max-w-3xl bg-[#0d0f1a] border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* --- Top Status Bar --- */}
        <div className="flex items-center justify-between px-8 py-4 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.3em]">
              Task Node: {task.task_id.split('-')[0]}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[85vh]">
          {/* --- Main Content Area --- */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-white/5">
            <div className="mb-8">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
                <Cpu size={12} /> {project?.projectName}
              </div>
              <h2 className="font-syne text-3xl font-black text-white tracking-tighter leading-none mb-4">
                {task.taskTitle}
              </h2>
              <div className="flex items-center gap-4 text-xs font-mono text-white/30">
                <span className="flex items-center gap-1.5 text-red-400"><Calendar size={12} /> Deadline: {format(parseISO(task.deadline), 'MM.dd.yy')}</span>
                <span className="flex items-center gap-1.5"><ShieldCheck size={12} /> Encrypted Session</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-white/75 mt-3">
                <span className="flex items-center gap-1.5 ">userName : {task.user.username} </span>
                <span className="flex items-center gap-1.5 ">| </span>
                <span className="flex items-center gap-1.5">role : {task.user.role}</span>
              </div>
              {/* <div className='text-s my-4  font-mono text-white rounded-l '>
                {task.description}
              </div> */}
            </div>

            {/* AI Core Intelligence Card */}
            <div className="relative group mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-[#12152b] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                    <Brain size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-black text-white uppercase tracking-widest">Neural Recommendation</h4>
                    <p className="text-[10px] text-white/30 uppercase tracking-tighter">System Logic Analysis</p>
                  </div>
                </div>
                
               {loadingAI ? (
                        <div className="flex items-center gap-3 text-white/40 font-mono text-xs py-2">
                          <Loader2 size={16} className="animate-spin text-cyan-400" />
                          Calculating logic paths...
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {aiInsight ? (
                            <>
                              <div className="flex items-start gap-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5">
                                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                </div>
                                <p className="text-sm text-white/80 leading-relaxed font-medium">
                                  {parseAIInsight(aiInsight)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                AI analysis complete
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-white/50 italic">No insights available</p>
                          )}
                        </div>
                      )}
              </div>
            </div>

            {/* --- Add technical description if needed, backend should be edited first--- */}
            {/* Technical Description */}
            <div className="space-y-4">
              <label className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.3em] block">Data Manifest</label>
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-sm text-white/60 leading-relaxed">
                {task.description || "No manual data logs found for this node."}
              </div>
            </div>
          </div>

          {/* --- Right Sidebar: Parameters --- */}
          <div className="w-full lg:w-72 bg-white/[0.02] p-8 space-y-8 overflow-y-auto border-t lg:border-t-0 border-white/5">
            {/* Risk Processor */}
            <div>
              <label className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.3em] mb-4 block">Risk Processor</label>
              <div className={clsx(
                'rounded-2xl p-4 border transition-all',
                risk.level === 'high' ? 'bg-rose-500/5 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'bg-white/5 border-white/10'
              )}>
                <div className="flex items-center justify-between mb-3">
                  <span className={clsx('text-[10px] font-mono font-black uppercase tracking-widest', risk.level === 'high' ? 'text-rose-400' : 'text-cyan-400')}>
                    {risk.level}
                  </span>
                  <span className="text-xl font-syne font-black text-white">{risk.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={clsx('h-full transition-all duration-1000', risk.level === 'high' ? 'bg-rose-500' : 'bg-cyan-400')} 
                    style={{ width: `${risk.score}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Status Selects */}
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.3em] mb-3 block">Task Status</label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value)}
                  className="w-full bg-[#1a1e35] border border-white/10 text-white text-xs font-mono font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors appearance-none"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.3em] mb-3 block">Priority Scale</label>
                <select
                  value={editPriority}
                  onChange={e => setEditPriority(e.target.value)}
                  className="w-full bg-[#1a1e35] border border-white/10 text-white text-xs font-mono font-bold rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-colors appearance-none"
                >
                  {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p} LEVEL</option>)}
                </select>
              </div>
            </div>

            {/* Nodes Involved */}
            <div>
              <label className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.3em] mb-4 block">Linked Nodes</label>
              <div className="space-y-2">
                {assignees.map(u => (
                  <div key={u.user_id} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 group hover:border-white/20 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-black text-white group-hover:text-cyan-400 transition-colors">
                      {u.avatar}
                    </div>
                    <span className="text-[11px] font-bold text-white/60 group-hover:text-white transition-colors">{u.username}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between p-8 bg-white/[0.02] border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-white/20 uppercase tracking-widest">
            <Activity size={14} className="animate-pulse" /> Uplink Ready
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose} 
              className="text-[10px] font-mono font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors"
            >
              Discard Changes
            </button>
            <button 
              onClick={handleSave} 
              className="px-6 py-3 bg-white text-black text-[10px] font-mono font-black uppercase tracking-[0.2em] rounded-xl hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,229,212,0.4)] transition-all flex items-center gap-2"
            >
              <Zap size={14} className="fill-current" /> Commit Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}