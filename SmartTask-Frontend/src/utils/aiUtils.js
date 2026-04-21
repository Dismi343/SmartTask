import { differenceInDays, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { completionHistory } from '../data/mockData';

// ─── Delay Risk Prediction ────────────────────────────────────────────────────
export function predictDelayRisk(task, assignees) {
  if (!task || task.status === 'COMPLETED' || task.status === 'CANCELLED') {
    return { level: 'none', score: 0, factors: [], recommendation: '' };
  }

  const today = new Date();
  const deadline = parseISO(task.deadline);
  const daysRemaining = differenceInDays(deadline, today);
  const factors = [];
  let score = 0;

  // Factor 1: Time pressure
  if (daysRemaining < 0) {
    score += 50;
    factors.push({ label: 'Overdue', detail: `${Math.abs(daysRemaining)}d past deadline`, severity: 'critical' });
  } else if (daysRemaining <= 2) {
    score += 40;
    factors.push({ label: 'Critical deadline', detail: `${daysRemaining}d remaining`, severity: 'high' });
  } else if (daysRemaining <= 7) {
    score += 20;
    factors.push({ label: 'Tight deadline', detail: `${daysRemaining}d remaining`, severity: 'medium' });
  }

  // Factor 2: Assignee history
  if (assignees && assignees.length > 0) {
    const histories = assignees.map(a => completionHistory.find(h => h.user_id === a.user_id)).filter(Boolean);
    const avgDelay = histories.reduce((sum, h) => sum + h.avgDelayDays, 0) / (histories.length || 1);
    const avgLateRate = histories.reduce((sum, h) => sum + (h.late / (h.onTime + h.late)), 0) / (histories.length || 1);

    if (avgLateRate > 0.4) {
      score += 25;
      factors.push({ label: 'Low on-time rate', detail: `${Math.round((1-avgLateRate)*100)}% historical on-time`, severity: 'high' });
    } else if (avgLateRate > 0.2) {
      score += 10;
      factors.push({ label: 'Moderate history', detail: `${Math.round((1-avgLateRate)*100)}% historical on-time`, severity: 'medium' });
    }

    if (avgDelay > 3) {
      score += 15;
      factors.push({ label: 'Past delays', detail: `Avg ${avgDelay.toFixed(1)}d late`, severity: 'medium' });
    }
  } else {
    score += 10;
    factors.push({ label: 'Unassigned', detail: 'No assignee set', severity: 'medium' });
  }

  // Factor 3: Priority vs status mismatch
  if (task.priority === 'HIGH' && task.status === 'TODO' && daysRemaining < 14) {
    score += 20;
    factors.push({ label: 'High priority not started', detail: 'Needs immediate attention', severity: 'high' });
  }

  // Factor 4: Multiple assignees
  if (assignees && assignees.length > 2) {
    score += 5;
    factors.push({ label: 'Complex coordination', detail: `${assignees.length} team members`, severity: 'low' });
  }

  score = Math.min(score, 100);

  let level, recommendation;
  if (score >= 65) {
    level = 'high';
    recommendation = 'Escalate immediately. Consider reassigning or reducing scope to meet deadline.';
  } else if (score >= 35) {
    level = 'medium';
    recommendation = 'Monitor closely. Schedule a check-in with assignees this week.';
  } else if (score >= 10) {
    level = 'low';
    recommendation = 'On track. Ensure blockers are cleared during next standup.';
  } else {
    level = 'minimal';
    recommendation = 'Task appears healthy. Continue as planned.';
  }

  return { level, score, factors, recommendation };
}

// ─── Smart Task Prioritization ────────────────────────────────────────────────
export function prioritizeTasks(tasks, projectDeadline) {
  if (!tasks || tasks.length === 0) return [];

  const today = new Date();

  const scored = tasks
    .filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED')
    .map(task => {
      let urgencyScore = 0;
      const daysRemaining = differenceInDays(parseISO(task.deadline), today);

      // Urgency: deadline proximity
      if (daysRemaining < 0) urgencyScore += 100;
      else if (daysRemaining <= 3) urgencyScore += 80;
      else if (daysRemaining <= 7) urgencyScore += 50;
      else if (daysRemaining <= 14) urgencyScore += 25;
      else urgencyScore += Math.max(0, 15 - daysRemaining * 0.5);

      // Priority weight
      const priorityWeight = { HIGH: 30, MEDIUM: 15, LOW: 5 }[task.priority] || 10;
      urgencyScore += priorityWeight;

      // Status: in progress gets small boost
      if (task.status === 'IN_PROGRESS') urgencyScore += 10;

      const risk = predictDelayRisk(task, []);
      urgencyScore += risk.score * 0.2;

      return { ...task, urgencyScore, daysRemaining };
    });

  scored.sort((a, b) => b.urgencyScore - a.urgencyScore);

  return scored.map((task, index) => ({
    ...task,
    suggestedRank: index + 1,
    priorityReason: getPriorityReason(task),
  }));
}

function getPriorityReason(task) {
  const days = task.daysRemaining;
  if (days < 0) return `Overdue by ${Math.abs(days)} days`;
  if (days <= 3) return `Critical: only ${days}d to deadline`;
  if (task.priority === 'HIGH' && task.status === 'TODO') return 'High priority — not yet started';
  if (task.status === 'IN_PROGRESS') return 'Currently in progress — maintain momentum';
  if (days <= 7) return `Deadline approaching in ${days} days`;
  return `Standard priority — ${days}d remaining`;
}

// ─── Productivity Insights ─────────────────────────────────────────────────────
export function generateProductivityInsights(tasks, userId) {
  const userTasks = tasks.filter(t => t.assigneeIds.includes(userId));
  const completed = userTasks.filter(t => t.status === 'COMPLETED');
  const inProgress = userTasks.filter(t => t.status === 'IN_PROGRESS');
  const overdue = userTasks.filter(t => {
    if (t.status === 'COMPLETED' || t.status === 'CANCELLED') return false;
    return isBefore(parseISO(t.deadline), new Date());
  });

  const completionRate = userTasks.length > 0 ? Math.round((completed.length / userTasks.length) * 100) : 0;
  const history = completionHistory.find(h => h.user_id === userId);
  const onTimeRate = history ? Math.round((history.onTime / (history.onTime + history.late)) * 100) : 0;

  const insights = [];

  if (completionRate >= 80) {
    insights.push({ type: 'positive', icon: '🏆', title: 'High completion rate', body: `You\'ve completed ${completionRate}% of assigned tasks — top tier performance!` });
  } else if (completionRate < 50) {
    insights.push({ type: 'warning', icon: '📊', title: 'Completion rate needs attention', body: `Only ${completionRate}% of tasks completed. Consider breaking tasks into smaller chunks.` });
  }

  if (overdue.length > 0) {
    insights.push({ type: 'critical', icon: '⚠️', title: `${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}`, body: `${overdue.map(t => t.taskTitle).slice(0, 2).join(', ')}${overdue.length > 2 ? ` +${overdue.length - 2} more` : ''} need immediate attention.` });
  }

  if (inProgress.length > 3) {
    insights.push({ type: 'warning', icon: '🔄', title: 'Too many tasks in flight', body: `${inProgress.length} tasks in progress. Focus on finishing before starting new ones.` });
  }

  if (onTimeRate >= 90) {
    insights.push({ type: 'positive', icon: '⚡', title: 'Excellent on-time delivery', body: `${onTimeRate}% on-time completion rate — you\'re a reliable team member.` });
  } else if (onTimeRate < 70) {
    insights.push({ type: 'warning', icon: '🕐', title: 'On-time rate below target', body: `${onTimeRate}% on-time rate. Try time-boxing tasks and flagging blockers earlier.` });
  }

  // Task description quality insights
  const longDescTasks = userTasks.filter(t => t.description && t.description.length > 100);
  if (longDescTasks.length > userTasks.length * 0.7) {
    insights.push({ type: 'positive', icon: '📝', title: 'Well-documented tasks', body: 'Your tasks have detailed descriptions — great for handoffs and async work.' });
  }

  if (insights.length === 0) {
    insights.push({ type: 'info', icon: '💡', title: 'Getting started', body: 'Complete more tasks to unlock personalized AI productivity insights.' });
  }

  return {
    completionRate,
    onTimeRate,
    totalTasks: userTasks.length,
    completedCount: completed.length,
    overdueCount: overdue.length,
    inProgressCount: inProgress.length,
    insights,
  };
}

// ─── AI Insight Generator (API call to Claude) ────────────────────────────────
export async function generateAIInsight(prompt, context) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `You are an AI assistant for a project management tool called NexTask. ${prompt}\n\nContext: ${JSON.stringify(context)}\n\nProvide a concise, actionable response in 2-3 sentences. Be specific and practical.`
        }]
      })
    });
    const data = await response.json();
    return data.content?.[0]?.text || 'Unable to generate insight at this time.';
  } catch (err) {
    return 'AI insights temporarily unavailable. Using local analysis instead.';
  }
}

export function getRiskColor(level) {
  const colors = {
    high: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', badge: 'badge-high' },
    medium: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'badge-medium' },
    low: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'badge-low' },
    minimal: { text: 'text-ghost', bg: 'bg-surface', border: 'border-border', badge: '' },
    none: { text: 'text-ghost', bg: 'bg-surface', border: 'border-border', badge: '' },
  };
  return colors[level] || colors.none;
}
