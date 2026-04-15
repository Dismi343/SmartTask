import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { predictDelayRisk, prioritizeTasks } from '../utils/aiUtils';
import { format, parseISO, differenceInDays, set } from 'date-fns';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { 
  ArrowLeft, Plus, Users, Calendar, Zap, List, LayoutGrid, 
  X, AlertCircle, Brain, FolderPlus 
} from 'lucide-react';
import clsx from 'clsx';
import { all } from 'axios';

// --- CreateTaskModal (Updated Styles) ---

function CreateTaskModal({ projectId, onClose }) {
  const { createTask, users, currentUser, changeTaskStatus, getAllUsers,getProjectById } = useApp();
  const [form, setForm] = useState({
    taskTitle: '', status: 'TODO', priority: 'MEDIUM',
    deadline: '', project_id: projectId, user_id: currentUser.user_id,
  });
  const [error, setError] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {

    if (currentUser?.role === 'PM' || currentUser?.role === 'Project Manager') {
      getAllUsers().then(setAvailableUsers);

        const currentProject = getProjectById(projectId);
        setSelectedProject(currentProject);
    }

  }, [currentUser, getProjectById, projectId]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleAssignee = id => setForm(f => ({
    ...f,
    assigneeIds: f.assigneeIds.includes(id) ? f.assigneeIds.filter(a => a !== id) : [...f.assigneeIds, id]
  }));

  const handleSubmit = (e) => {
      e.preventDefault();

      if (!form.taskTitle.trim()) {
        setError('Task title required');
        return;
      }

      if (!form.deadline) {
        setError('Deadline required');
        return;
      }

      const formattedForm = {
        ...form,
        deadline: `${form.deadline}T00:00:00`
      };

      createTask(formattedForm);
      //console.log("Creating task with data:", formattedForm);
      onClose();
  };

   const isPM = currentUser?.role === 'PM' || currentUser?.role === 'Project Manager';

  return (
    <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-abyss border border-border/60 rounded-2xl overflow-hidden animate-slide-up shadow-2xl shadow-void/50" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border/40 bg-surface/30">
          <h2 className="font-syne text-lg font-bold  tracking-tight text-white">Add New Task</h2>
          <button onClick={onClose} className="text-white hover:text-bright transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-rose-400 text-xs font-mono">
              <AlertCircle size={14} />{error}
            </div>
          )}
          
          {/* Show assignee selection only for PM */}
         {isPM && (
              <div className="space-y-1.5 text-white">
                <label className="text-[10px] font-mono text-ghost uppercase tracking-[0.2em] ml-1">Assign To</label>
                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                  {(selectedProject?.userList ?? []).map(user => (
                    <button
                      key={user.user_id}
                      type="button"
                      onClick={() => update('user_id', user.user_id)}
                      className={clsx(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-all text-left',
                        form.user_id === user.user_id
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                          : 'bg-surface/50 border-border/40 text-dim hover:border-ghost'
                      )}
                    >
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-ghost to-muted flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-mono font-bold text-void">{user.username?.charAt(0).toUpperCase() || 'U'}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-xs">{user.username}</div>
                        <div className="text-[10px] text-ghost">{user.role}</div>
                      </div>
                      {form.user_id === user.user_id && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

          <div className="space-y-1.5 text-white">
            <label className="text-[10px] font-mono text-ghost uppercase tracking-[0.2em] ml-1">Task Title</label>
            <input type="text" value={form.taskTitle} onChange={e => update('taskTitle', e.target.value)}
              placeholder="e.g., Implement Vector Search" className="input-dark w-full px-4 py-3 rounded-xl text-sm border-border/40 focus:border-cyan-500/50 transition-all bg-void/50" />
          </div>

          {/* <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-ghost uppercase tracking-[0.2em] ml-1">Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Context or acceptance criteria..." rows={3}
              className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none border-border/40 bg-void/50" />
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 text-white bg-void/50 p-4 rounded-xl border border-border/40">
              <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Status</label>
              <select value={form.status} onChange={e => update('status', e.target.value)}
                className="input-dark w-full px-3 py-2.5 rounded-xl text-xs bg-void/50 border-border/40 cursor-pointer">
                {['TODO', 'IN_PROGRESS', 'COMPLETED'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 text-white bg-void/50 p-4 rounded-xl border border-border/40">
              <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Priority</label>
              <select value={form.priority} onChange={e => update('priority', e.target.value)}
                className="input-dark w-full px-3 py-2.5 rounded-xl text-xs bg-void/50 border-border/40 cursor-pointer">
                {['LOW', 'MEDIUM', 'HIGH'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 text-white bg-void/50 p-4 rounded-xl border border-border/40">
              <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1 text-white">Deadline</label>
              <input
                type="date"
                value={form.deadline}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => update('deadline', e.target.value)}
                className="input-dark w-full px-3 py-2.5 rounded-xl text-xs bg-void/50 border-border/40 invert-calendar-icon"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border/30">
            <button type="button" onClick={onClose} className="text-white hover:bg-rose-700 btn-ghost flex-1 py-3 rounded-xl text-xs font-mono tracking-widest uppercase">Cancel</button>
            <button type="submit" className="text-white btn-primary hover:bg-emerald-500 flex-1 py-3 rounded-xl text-xs font-mono tracking-widest uppercase">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProjectById, getProjectTasks, getUserById, currentUser } = useApp();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [viewMode, setViewMode] = useState('board');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const project = getProjectById(projectId);
  const allTasks = getProjectTasks(projectId);
  const members = (project?.userList ?? []).filter(Boolean) || [];
  const [showCrewModal, setShowCrewModal] = useState(false);


  if (!project) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] stagger">
       <div className="p-8 border border-border/40 bg-surface/20 rounded-2xl text-center">
          <p className="text-dim font-mono mb-4">404 // PROJECT_NOT_FOUND</p>
          <button onClick={() => navigate('/dashboard/projects')} className="text-cyan-400 text-sm flex items-center gap-2 hover:underline">
            <ArrowLeft size={14} /> Return to Projects
          </button>
       </div>
    </div>
  );

  const userFilteredTasks = currentUser?.role === 'PM' || currentUser?.role === 'Project Manager'
  ? allTasks
  : allTasks.filter(t => t.user?.user_id === currentUser?.user_id);
console.log("tasks",allTasks)

  const filtered = filterStatus === 'ALL' ? userFilteredTasks : userFilteredTasks.filter(t => t.status === filterStatus);
  const prioritized = prioritizeTasks(allTasks, project.endDate);
 const highRisk = prioritized.filter(t => {
  const assigneeIds = Array.isArray(t.assigneeIds) 
    ? t.assigneeIds 
    : (t.user?.user_id ? [t.user.user_id] : []);
  const assignees = assigneeIds.map(id => getUserById(id)).filter(Boolean);
  return predictDelayRisk(t, assignees).level === 'high';
});

  const daysLeft = differenceInDays(parseISO(project.endDate), new Date());
  const progress = allTasks.length > 0 ? Math.round((allTasks.filter(t => t.status === 'COMPLETED').length / allTasks.length) * 100) : 0;
  
  const STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  const tasksByStatus = STATUSES.reduce((acc, s) => { acc[s] = filtered.filter(t => t.status === s); return acc; }, {});

  return (
    <div className="space-y-8 animate-fade-in max-w-[1600px] mx-auto">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-6">
        <button onClick={() => navigate('/dashboard/projects')} className="flex items-center gap-2 text-ghost hover:text-cyan-400 text-[11px] font-mono uppercase tracking-[0.2em] transition-all">
          <ArrowLeft size={12} /> Back to Fleet
        </button>
        
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 rounded-full shadow-[0_0_15px_rgba(34,229,212,0.3)]" style={{ background: project.color }} />
              <h1 className="font-syne text-3xl font-bold text-white tracking-tight leading-none">{project.projectName}</h1>
            </div>
            <p className="text-dim text-sm max-w-2xl leading-relaxed">{project.description}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* <button 
              onClick={() => navigate('/dashboard/projects/new')} // Assuming this route exists
              className="btn-ghost px-5 py-2.5 rounded-xl text-[11px] font-mono tracking-widest uppercase flex items-center gap-2 border-border/40"
            >
              <FolderPlus size={15} /> New Project
            </button> */}
            <button 
              onClick={() => setShowCreate(true)} 
              className="text-white bg-neon-violet px-5 py-2.5 rounded-xl text-[11px] font-mono tracking-widest uppercase flex items-center gap-2 shadow-lg shadow-cyan-500/10"
            >
              <Plus size={15} /> Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completion', value: `${progress}%`, sub: 'Project Health', color: project.color, bar: true },
          { label: 'Timeline', value: daysLeft < 0 ? `${Math.abs(daysLeft)}d Over` : `${daysLeft}d Left`, sub: format(parseISO(project.endDate), 'MMM dd, yyyy'), highlight: daysLeft <= 7 },
          { label: 'Active Tasks', value: allTasks.length, sub: `${allTasks.filter(t => t.status === 'COMPLETED').length} finalized` },
          { label: 'Crew', value: members.length, sub: 'Active contributors', users: true, onClick: () => setShowCrewModal(true) }
        ].map((stat, i) => (
           <div key={i} 
            onClick={stat.onClick}
            className={clsx(
              "bg-surface/40 border border-border/40 rounded-2xl p-5 hover:border-border transition-all group",
              stat.users && "cursor-pointer hover:bg-surface/60"
            )}>
            <div className="text-[10px] font-mono text-ghost uppercase tracking-widest mb-3">{stat.label}</div>
            <div className={clsx("text-2xl font-syne font-bold mb-1", stat.highlight ? 'text-rose-400' : 'text-bright')}>
              {stat.value}
            </div>
            {/* {stat.bar ? (
              <div className="w-full bg-void rounded-full h-1.5 mt-3 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: stat.color }} />
              </div>
            ) 
            : stat.users ? (
              <div className="flex items-center mt-3 -space-x-2">
                {members.slice(0, 5).map((u, i) => (
                  <div key={i} className="w-6 h-6 rounded-lg bg-elevated border border-abyss flex items-center justify-center text-[8px] font-bold text-cyan-400">
                    {u.avatar}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[10px] font-mono text-muted uppercase tracking-wider">{stat.sub}</div>
            )
            
            } */}
          </div>
        ))}
      </div>

      {showCrewModal && (
        <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4" onClick={() => setShowCrewModal(false)}>
          <div className="w-full max-w-md bg-abyss border border-border/60 rounded-2xl overflow-hidden animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border/40 bg-surface/30">
              <h2 className="font-syne text-lg font-bold text-white tracking-tight">Project Crew</h2>
              <button onClick={() => setShowCrewModal(false)} className="text-white hover:text-bright transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {members.length > 0 ? (
                members.map((user, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-sm font-bold text-cyan-400">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">{user.username}</div>
                      <div className="text-xs text-white/40">{user.email}</div>
                    </div>
                    <div className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-white/60">
                      {user.role}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-white/40">No crew members assigned</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b border-border/20">
        <div className="flex items-center gap-1 bg-void/50 p-1 rounded-xl border border-border/30">
          {['ALL', 'TODO', 'IN_PROGRESS', 'COMPLETED','CANCELLED'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={clsx('px-4 py-2 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all',
                filterStatus === s ? 'bg-surface text-cyan-400 shadow-sm' : 'text-ghost hover:text-dim')}>
              {s}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 bg-void/50 p-1 rounded-xl border border-border/30">
          <button onClick={() => setViewMode('board')}
            className={clsx('p-2 rounded-lg transition-all', viewMode === 'board' ? 'bg-surface text-cyan-400' : 'text-ghost')}>
            <LayoutGrid size={16} />
          </button>
          <button onClick={() => setViewMode('list')}
            className={clsx('p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-surface text-cyan-400' : 'text-ghost')}>
            <List size={16} />
          </button>
        </div>
      </div>

      {/* AI Intelligence Layer */}
      {highRisk.length > 0 && (
        <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5 flex items-start gap-4 animate-pulse-slow">
          <div className="p-2 bg-rose-500/10 rounded-lg">
            <Brain size={18} className="text-rose-400" />
          </div>
          <div>
            <div className="text-xs font-mono text-rose-400 uppercase tracking-[0.2em] mb-1">Anomalies Detected</div>
            <p className="text-dim text-sm">
              <span className="text-bright font-medium">{highRisk.length} tasks</span> showing high probability of deadline slippage. Consider reassigning resources.
            </p>
          </div>
        </div>
      )}

      {/* Main Board View */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {['TODO', 'IN_PROGRESS', 'COMPLETED','CANCELLED'].map(status => (
            <div key={status} className="flex flex-col h-full bg-surface/10 rounded-2xl border border-border/20 p-4">
              <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-3">
                  <div className={clsx("w-1.5 h-1.5 rounded-full", {
                    TODO: 'bg-ghost', IN_PROGRESS: 'bg-cyan-400', COMPLETED: 'bg-emerald-400',CANCELLED: 'bg-emerald-400'
                  }[status])} />
                  <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-ghost">{status.replace('_', ' ')}</h3>
                </div>
                <span className="text-[10px] font-mono bg-void border border-border/40 px-2 py-0.5 rounded-full text-dim">
                  {tasksByStatus[status]?.length || 0}
                </span>
              </div>
              <div className="space-y-4">
                {(tasksByStatus[status] || []).map(task => (
                  <TaskCard key={task.task_id} task={task} onClick={setSelectedTask} />
                ))}
                {(!tasksByStatus[status] || tasksByStatus[status].length === 0) && (
                   <div className="border-2 border-dashed border-border/10 rounded-2xl py-10 text-center text-muted font-mono text-[10px] uppercase tracking-widest">
                      Empty
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View simplified/styled for consistency */
        <div className="bg-surface/20 border border-border/40 rounded-2xl overflow-hidden backdrop-blur-sm">
           {/* ... List view implementation following the same style ... */}
           <div className="p-8 text-center text-ghost font-mono text-xs">List view details optimized for {projectId}</div>
        </div>
      )}

      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
      {showCreate && <CreateTaskModal projectId={projectId} onClose={() => setShowCreate(false)} />}
    </div>
  );
}