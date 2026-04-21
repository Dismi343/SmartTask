import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { predictDelayRisk, getRiskColor } from '../utils/aiUtils';
import { parseISO, differenceInDays } from 'date-fns';
import { Calendar, AlertTriangle, User, ChevronDown, Zap, Activity } from 'lucide-react';
import clsx from 'clsx';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'Processing', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
const PRIORITY_LABELS = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };

export default function TaskCard({ task, onClick }) {
    const { changeTaskStatus, deleteTaskById } = useApp();
  const { getUserById, updateTaskStatus } = useApp();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

const assigneeIds = Array.isArray(task.assigneeIds) 
  ? task.assigneeIds 
  : (task.user?.user_id ? [task.user.user_id] : []);
const assignees = assigneeIds.map(id => getUserById(id)).filter(Boolean);  const risk = predictDelayRisk(task, assignees);
  const daysLeft = differenceInDays(parseISO(task.deadline), new Date());

  // High-contrast priority colors
  const priorityStyles = {
    HIGH: 'text-rose-400 bg-rose-500/10 border-rose-500/30 glow-rose-xs',
    MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    LOW: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  }[task.priority];

 const handleStatusChange = async(taskId, newStatus)=>{
    await changeTaskStatus(taskId,{ status: newStatus, priority: task.priority, deadline: task.deadline, taskTitle: task.taskTitle }); 
    updateTaskStatus(task.task_id, newStatus);
  }

  const deleteTask = async(taskId) => {
    console.log("Deleting task with ID:", taskId);
    await deleteTaskById(taskId);
    setTaskToDelete(null);
  }

  return (
    <div
      className={clsx(
        'group relative overflow-visible bg-white/5 border backdrop-blur-xl rounded-[24px] p-5 cursor-pointer transition-all duration-300',
        risk.level === 'high' 
          ? 'border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.1)] hover:border-rose-500' 
          : 'border-white/10 hover:border-cyan-400/50 hover:bg-white/10'
      )}
      onClick={() => onClick && onClick(task)}
    >
      {/* Neural Risk Overlay */}
      {risk.level === 'high' && (
        <div className="absolute top-0 right-0 p-2">
          <Activity size={14} className="text-rose-500 animate-pulse" />
        </div>
      )}

      {/* Header: Title & Priority */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="font-syne font-bold text-[15px] text-white leading-tight group-hover:text-cyan-400 transition-colors">
          {task.taskTitle}
        </h3>
        <span className={clsx('shrink-0 text-[9px] px-2 py-0.5 rounded-full font-mono font-black uppercase tracking-widest border', priorityStyles)}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {/* Logic Row: Status & Intelligence */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="text-[10px] bg-white/10 hover:bg-white/20 border border-white/10 text-white px-3 py-1 rounded-lg font-mono font-bold flex items-center gap-2 transition-all"
          >
            <div className={clsx('w-1.5 h-1.5 rounded-full overflow-visible', task.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-cyan-400 animate-pulse')} />
            {STATUS_LABELS[task.status]}
            <ChevronDown size={12} className="text-white/40" />
          </button>
          
          {showStatusMenu && (
            <div className="absolute top-full left-0 mt-2 z-30 bg-[#0d0f1a] border border-white/10 rounded-xl overflow-visible shadow-2xl min-w-[140px] backdrop-blur-xl">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={(e) => { 
                    e.stopPropagation();
                    handleStatusChange(task.task_id, s); 
                    setShowStatusMenu(false); }}
                  className=" w-full text-left px-4 py-2.5 text-[10px] text-white/60 hover:bg-white/10 hover:text-white transition-colors font-mono font-bold uppercase tracking-widest"
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* {risk.level !== 'none' && risk.level !== 'minimal' && (
          <div className={clsx(
            'text-[9px] px-2 py-1 rounded-lg font-mono font-bold uppercase tracking-tighter flex items-center gap-1.5 border',
            risk.level === 'high' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-white/5 border-white/10 text-white/40'
          )}>
            <Zap size={10} className={risk.level === 'high' ? 'fill-current' : ''} />
            {risk.level} Risk
          </div>
        )} */}

        <button className='px-3 py-2 bg-white/10 text-white text-[10px] font-mono font-black uppercase tracking-[0.2em] rounded-xl hover:bg-red-400  transition-all flex items-center gap-2 '
        onClick={(e)=>{
          e.stopPropagation();
          setTaskToDelete(task);
        }}
        >
          Delete Task</button>
      </div>

      {/* Footer: Timeline & Nodes */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div className={clsx(
          'flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-tight',
          daysLeft < 0 ? 'text-rose-400' : daysLeft <= 3 ? 'text-amber-400' : 'text-white/30'
        )}>
          <Calendar size={12} />
          {daysLeft < 0 ? `Alert: ${Math.abs(daysLeft)}d Overdue` : daysLeft === 0 ? 'Due: Today' : `${daysLeft}d remaining`}
        </div>

        <div className="flex items-center">
          {assignees.slice(0, 3).map((u, i) => (
            <div
              key={u.user_id}
              style={{ marginLeft: i > 0 ? '-8px' : 0, zIndex: 10 - i }}
              className="relative w-7 h-7 rounded-xl bg-white/10 border-2 border-[#0d0f1a] flex items-center justify-center group/avatar"
            >
              <span className="text-[10px] font-black text-white">{u.avatar}</span>
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 hidden group-hover/avatar:block px-2 py-1 bg-black text-[8px] text-white rounded font-mono whitespace-nowrap z-50">
                {u.username}
              </div>
            </div>
          ))}
          {assignees.length > 3 && (
            <div className="w-7 h-7 rounded-xl bg-white/5 border-2 border-[#0d0f1a] flex items-center justify-center -ml-2">
              <span className="text-[9px] font-bold text-white/40">+{assignees.length - 3}</span>
            </div>
          )}
        </div>
      </div>
      {taskToDelete && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-void p-6 rounded-xl border border-border/40 w-[300px] text-white">
      
      <h2 className="text-sm font-semibold mb-4">
        Are you sure you want to delete this task?
      </h2>

      <div className="flex justify-end gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setTaskToDelete(null);
          }}
          className="px-3 py-1.5 text-xs rounded-lg border border-border/40"
        >
          Cancel
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(taskToDelete.task_id);
            setTaskToDelete(null);

          }}
          className="px-3 py-1.5 text-xs rounded-lg bg-red-500 text-white"
        >
          Delete
        </button>
      </div>

    </div>
  </div>
)}
    </div>

    
  );
}