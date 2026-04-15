import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { prioritizeTasks, predictDelayRisk } from '../utils/aiUtils';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { format, parseISO, differenceInDays } from 'date-fns';
import { 
  Zap, Filter, SortAsc, CheckSquare, AlertTriangle, 
  Clock, Circle, Plus, Brain, LayoutGrid, List 
} from 'lucide-react';
import clsx from 'clsx';

// Import the CreateTaskModal (assuming it's in a separate file or defined within components)
// If it's the one from the previous ProjectDetail code, ensure it takes a dynamic projectId.
import CreateTaskModal from '../components/CreateTaskModal'; 

const FILTER_OPTIONS = ['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED'];
const SORT_OPTIONS = [
  { value: 'ai', label: '⚡ AI Priority' },
  { value: 'deadline', label: '📅 Deadline' },
  { value: 'priority', label: '🔥 Priority' },
];

const PRIORITY_RANK = { HIGH: 3, MEDIUM: 2, LOW: 1 };

export default function TasksPage() {
  const { currentUser, getUserTasks, getProjectById, getUserById, projects, tasks } = useApp();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('ai');

  const rawTasks = (tasks || []).filter(t => (t.user?.user_id || t.user_id) === currentUser?.user_id);
  const prioritized = prioritizeTasks(rawTasks, null);

  let filteredTasks = filterStatus === 'ALL' ? prioritized : prioritized.filter(t => t.status === filterStatus);

  if (sortBy === 'deadline') {
    filteredTasks = [...filteredTasks].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  } else if (sortBy === 'priority') {
    filteredTasks = [...filteredTasks].sort((a, b) => (PRIORITY_RANK[b.priority] || 0) - (PRIORITY_RANK[a.priority] || 0));
  }

  const counts = FILTER_OPTIONS.reduce((acc, s) => {
    acc[s] = s === 'ALL' ? rawTasks.length : rawTasks.filter(t => t.status === s).length;
    return acc;
  }, {});

  const overdueTasks = rawTasks.filter(t => {
    if (t.status === 'COMPLETED' || t.status === 'CANCELLED') return false;
    return differenceInDays(parseISO(t.deadline), new Date()) < 0;
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-[1400px] mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <CheckSquare size={20} className="text-cyan-400" />
            </div>
            <h1 className="font-syne text-3xl font-bold text-white tracking-tight">Mission Control</h1>
          </div>
          <p className="text-dim text-sm font-mono uppercase tracking-widest">
            {rawTasks.length} active units // {new Set(rawTasks.map(t => t.project_id)).size} project clusters
          </p>
        </div>

        {/* <button 
          onClick={() => setShowCreate(true)}
          className="bg-neon-violet hover:bg-neural-violet text-white px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
        >
          <Plus size={16} strokeWidth={3} /> New Task
        </button> */}
      </div>

      {/* Critical Alerts */}
      {overdueTasks.length > 0 && (
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-4 animate-pulse-slow">
          <AlertTriangle size={18} className="text-rose-400" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block mb-0.5">Critical Latency</span>
            <p className="text-dim text-sm truncate">
              <span className="text-bright font-medium">{overdueTasks.length} tasks</span> are past their target window: 
              <span className="ml-2 italic">{overdueTasks.map(t => t.taskTitle).slice(0, 1).join('')}...</span>
            </p>
          </div>
        </div>
      )}

      {/* Filters & Sorting Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center py-4 border-y border-border/20">
        
        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pb-2 lg:pb-0">
          {FILTER_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={clsx(
                'flex items-center gap-3 px-4 py-2 rounded-xl border text-[10px] font-mono uppercase tracking-widest whitespace-nowrap transition-all duration-300',
                filterStatus === s 
                  ? 'bg-surface border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(34,229,212,0.1)]' 
                  : 'bg-void border-border/40 text-ghost hover:border-ghost'
              )}
            >
              {s}
              <span className={clsx(
                'px-1.5 py-0.5 rounded-md text-[9px]', 
                filterStatus === s ? 'bg-cyan-500/20 text-cyan-300' : 'bg-elevated text-dim'
              )}>
                {counts[s]}
              </span>
            </button>
          ))}
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-1 bg-void/50 p-1.5 rounded-xl border border-border/30 w-full">
            {SORT_OPTIONS.map(opt => (
              <button 
                key={opt.value} 
                onClick={() => setSortBy(opt.value)}
                className={clsx(
                  'flex-1 px-3 py-2 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all',
                  sortBy === opt.value ? 'bg-surface text-bright shadow-sm border border-border/40' : 'text-ghost hover:text-dim'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Reasoning Context */}
      {sortBy === 'ai' && (
        <div className="flex items-center gap-3 px-4 py-2 bg-violet-500/5 border border-violet-500/20 rounded-xl w-fit">
          <Brain size={14} className="text-violet-400" />
          <span className="text-[10px] font-mono text-violet-300 uppercase tracking-widest">Neural Ranking Active: Prioritizing Risk & Impact</span>
        </div>
      )}

      {/* Tasks Display */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-surface/10 rounded-3xl border border-dashed border-border/20">
          <div className="p-4 bg-void rounded-full mb-4 border border-border/20">
            <CheckSquare size={32} className="text-ghost opacity-20" />
          </div>
          <p className="text-dim font-mono text-xs uppercase tracking-[0.2em]">All sectors clear</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task, i) => {
            const project = getProjectById(task.project_id);
            return (
              <div key={task.task_id} className="group relative flex flex-col transition-all">
                
                {/* Visual Connector to Project */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-1.5 h-3 rounded-full" style={{ background: project?.color || '#3d4470' }} />
                  <span className="text-[10px] font-mono text-dim uppercase tracking-widest truncate">
                    {project?.projectName || 'Unassigned Cluster'}
                  </span>
                  
                  {/* AI Priority Rank Badge */}
                  {sortBy === 'ai' && i < 3 && (
                    <div className={clsx(
                      "ml-auto text-[9px] font-mono px-2 py-0.5 rounded-md border",
                      i === 0 ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "bg-violet-500/10 border-violet-500/20 text-violet-400"
                    )}>
                      TOP PRIORITY 0{i + 1}
                    </div>
                  )}
                </div>

                <TaskCard task={task} onClick={setSelectedTask} />
                
                {/* AI Justification label */}
                {sortBy === 'ai' && task.priorityReason && (
                  <div className="mt-3 px-2 flex items-start gap-2 animate-fade-in">
                    <Zap size={10} className="text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-[10px] font-mono text-ghost leading-relaxed">
                      {task.priorityReason}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
      
      {showCreate && (
        <CreateTaskModal 
          // If no specific project, you can pass a default or handle null inside the modal
          projectId={projects[0]?.project_id} 
          onClose={() => setShowCreate(false)} 
        />
      )}
    </div>
  );
}