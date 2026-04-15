import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, AlertCircle, Calendar, Hash, Layers } from 'lucide-react';
import clsx from 'clsx';

export default function CreateTaskModal({ projectId: initialProjectId, onClose }) {
  const { createTask, users, currentUser, projects } = useApp();
  
  const [form, setForm] = useState({
    taskTitle: '',
    status: 'TODO',
    priority: 'MEDIUM',
    deadline: '',
    project_id: initialProjectId || (projects[0]?.project_id || ''),
    user_id: [currentUser.user_id],
  });

  const [error, setError] = useState('');

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleAssignee = id => setForm(f => ({
    ...f,
    assigneeIds: f.assigneeIds.includes(id) 
      ? f.assigneeIds.filter(a => a !== id) 
      : [...f.assigneeIds, id]
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.taskTitle.trim()) { setError('Task title is required'); return; }
    if (!form.project_id) { setError('Please select a project'); return; }
    if (!form.deadline) { setError('Deadline is required'); return; }
    
    createTask(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-abyss border border-border/60 rounded-2xl overflow-hidden animate-slide-up shadow-2xl shadow-void/50" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/40 bg-surface/30">
          <div>
            <h2 className="font-syne text-lg font-bold text-white tracking-tight">Create New Task</h2>
          </div>
          <button onClick={onClose} className="text-ghost hover:text-bright transition-colors p-2 hover:bg-white/5 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-rose-400 text-xs font-mono animate-fade-in">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          
          {/* Project Selection (Visible if creating from global tasks page) */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-ghost uppercase tracking-[0.2em] ml-1">Target Project</label>
            <div className="relative">
              <select 
                value={form.project_id} 
                onChange={e => update('project_id', e.target.value)}
                className="input-dark w-full px-10 py-3 rounded-xl text-sm border-border/40 bg-void/50 appearance-none cursor-pointer focus:border-cyan-500/50"
              >
                <option value="" disabled>Select Project...</option>
                {projects.map(p => (
                  <option key={p.project_id} value={p.project_id}>{p.projectName}</option>
                ))}
              </select>
              <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-ghost" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-ghost uppercase tracking-[0.2em] ml-1">Task Title</label>
            <input 
              type="text" 
              value={form.taskTitle} 
              onChange={e => update('taskTitle', e.target.value)}
              placeholder="Primary objective..." 
              className="input-dark w-full px-4 py-3 rounded-xl text-sm border-border/40 focus:border-cyan-500/50 transition-all bg-void/50 placeholder:text-muted" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-ghost uppercase tracking-[0.2em] ml-1">Context / Details</label>
            <textarea 
              value={form.description} 
              onChange={e => update('description', e.target.value)}
              placeholder="Add technical specifications..." 
              rows={3}
              className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none border-border/40 bg-void/50 focus:border-cyan-500/50" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Priority Level</label>
              <select 
                value={form.priority} 
                onChange={e => update('priority', e.target.value)}
                className="input-dark w-full px-3 py-2.5 rounded-xl text-xs bg-void/50 border-border/40 cursor-pointer"
              >
                {['LOW', 'MEDIUM', 'HIGH'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-ghost uppercase tracking-widest ml-1">Deadline</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={form.deadline} 
                  onChange={e => update('deadline', e.target.value)}
                  className="input-dark w-full px-3 py-2.5 rounded-xl text-xs bg-void/50 border-border/40 invert-calendar-icon" 
                />
              </div>
            </div>
          </div>

          {/* Assignees */}
          {/* <div className="space-y-3">
            <label className="text-[10px] font-mono text-ghost uppercase tracking-[0.2em] ml-1">Deploy Crew</label>
            <div className="flex flex-wrap gap-2">
              {users.map(u => {
                const isActive = form.assigneeIds.includes(u.user_id);
                return (
                  <button 
                    key={u.user_id} 
                    type="button" 
                    onClick={() => toggleAssignee(u.user_id)}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-mono transition-all',
                      isActive 
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(34,229,212,0.1)]' 
                        : 'bg-void border-border/40 text-ghost hover:border-ghost'
                    )}
                  >
                    <div className="w-4 h-4 rounded bg-muted/30 flex items-center justify-center text-[8px] border border-white/5">
                      {u.avatar}
                    </div>
                    {u.username}
                  </button>
                );
              })}
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-border/30 mt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="text-white bg-ghost hover:bg-rose-700 hover:text-white flex-1 py-3 rounded-xl text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="text-white bg-emerald-400 hover:bg-emerald-500 flex-1 py-3 rounded-xl text-sm"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}