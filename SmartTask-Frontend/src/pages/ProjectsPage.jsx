import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { format, parseISO, differenceInDays } from 'date-fns';
import { FolderOpen, Plus, Users, Calendar, ArrowRight, X, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const PROJECT_COLORS = ['#22e5d4', '#a78bfa', '#fbbf24', '#fb7185', '#34d399', '#60a5fa'];

function CreateProjectModal({ onClose }) {
  const { createProject, users, currentUser } = useApp();
  const [form, setForm] = useState({
    projectName: '', description: '', startDate: '', endDate: '',
    memberIds: [], color: PROJECT_COLORS[0],
  });
  const [error, setError] = useState('');

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      memberIds: f.memberIds.includes(id) ? f.memberIds.filter(m => m !== id) : [...f.memberIds, id]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.projectName.trim()) { setError('Project name is required'); return; }
    if (!form.startDate || !form.endDate) { setError('Start and end dates are required'); return; }
    createProject(form);
    onClose();
  };

  const otherUsers = users.filter(u => u.user_id !== currentUser.user_id);

  return (
    <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-abyss border border-border rounded-2xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-syne text-lg font-bold text-white">New Project</h2>
          <button onClick={onClose} className="text-ghost hover:text-soft transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2 text-rose-400 text-sm">
              <AlertCircle size={13} />{error}
            </div>
          )}

          <div>
            <label className="text-xs font-mono text-ghost uppercase tracking-widest mb-2 block">Project Name</label>
            <input type="text" value={form.projectName} onChange={e => update('projectName', e.target.value)}
              placeholder="e.g. Nebula Dashboard v2" className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
          </div>

          <div>
            <label className="text-xs font-mono text-ghost uppercase tracking-widest mb-2 block">Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="What is this project about?" rows={3}
              className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-ghost uppercase tracking-widest mb-2 block">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-mono text-ghost uppercase tracking-widest mb-2 block">End Date</label>
              <input type="date" value={form.endDate} onChange={e => update('endDate', e.target.value)}
                className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-ghost uppercase tracking-widest mb-2 block">Color</label>
            <div className="flex gap-2">
              {PROJECT_COLORS.map(c => (
                <button key={c} type="button" onClick={() => update('color', c)}
                  className={clsx('w-7 h-7 rounded-full border-2 transition-transform', form.color === c ? 'border-white scale-110' : 'border-transparent')}
                  style={{ background: c }} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-ghost uppercase tracking-widest mb-2 block">Add Team Members</label>
            <div className="space-y-2">
              {otherUsers.map(u => (
                <button key={u.user_id} type="button" onClick={() => toggleMember(u.user_id)}
                  className={clsx('w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-all text-left',
                    form.memberIds.includes(u.user_id) ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-surface border-border text-dim hover:border-ghost')}>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ghost to-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-mono font-bold text-void">{u.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{u.username}</div>
                    <div className="text-xs text-ghost">{u.role}</div>
                  </div>
                  {form.memberIds.includes(u.user_id) && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="bg-ghost hover:bg-rose-700 hover:text-white flex-1 py-3 rounded-xl text-sm">Cancel</button>
            <button type="submit" className="bg-emerald-400 hover:bg-emerald-500 flex-1 py-3 rounded-xl text-sm">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { currentUser, getUserProjects, getProjectTasks } = useApp();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);

  const projects = getUserProjects(currentUser.user_id);

  return (
    <div className="space-y-6 stagger">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-syne text-2xl font-bold text-white">Projects</h1>
          <p className="text-ghost text-sm mt-1">{projects.length} active projects</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-neon-violet hover:bg-neural-violet text-white px-4 py-2.5 rounded-xl text-sm flex items-center gap-2">
          <Plus size={15} /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-ghost">
          <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>No projects yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(project => {
            const tasks = getProjectTasks(project.project_id);
            const completed = tasks.filter(t => t.status === 'COMPLETED').length;
            const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
            const daysLeft = differenceInDays(parseISO(project.endDate), new Date());
            const overdue = tasks.filter(t => {
              if (t.status === 'COMPLETED' || t.status === 'CANCELLED') return false;
              return differenceInDays(parseISO(t.deadline), new Date()) < 0;
            }).length;

            return (
              <div
                key={project.project_id}
                onClick={() => navigate(`/dashboard/projects/${project.project_id}`)}
                className="bg-surface border border-border rounded-xl p-5 cursor-pointer hover:border-ghost transition-all group relative overflow-hidden"
              >
                {/* Color accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: project.color }} />

                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: project.color + '20', border: `1px solid ${project.color}40` }}>
                    <FolderOpen size={18} style={{ color: project.color }} />
                  </div>
                  <ArrowRight size={16} className="text-ghost group-hover:text-soft transition-colors mt-1" />
                </div>

                <h3 className="font-syne font-bold text-white mb-1 group-hover:text-white/90 transition-colors">
                  {project.projectName}
                </h3>
                <p className="text-ghost text-xs leading-relaxed mb-4 line-clamp-2">{project.description}</p>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-ghost">Progress</span>
                    <span className="font-mono" style={{ color: project.color }}>{progress}%</span>
                  </div>
                  <div className="w-full bg-deep rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress}%`, background: project.color }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-ghost">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Users size={11} /> {project.memberIds.length}</span>
                    <span className="flex items-center gap-1"><FolderOpen size={11} /> {tasks.length} tasks</span>
                    {overdue > 0 && (
                      <span className="flex items-center gap-1 text-rose-400">
                        <AlertCircle size={11} /> {overdue} overdue
                      </span>
                    )}
                  </div>
                  <span className={clsx('font-mono', daysLeft < 0 ? 'text-rose-400' : daysLeft <= 7 ? 'text-amber-400' : 'text-ghost')}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)}d over` : `${daysLeft}d left`}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Add project card */}
          <button
            onClick={() => setShowCreate(true)}
            className="border-2 border-dashed border-border rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-ghost hover:border-ghost hover:text-dim transition-all min-h-[200px]"
          >
            <Plus size={24} />
            <span className="text-sm">New Project</span>
          </button>
        </div>
      )}

      {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
