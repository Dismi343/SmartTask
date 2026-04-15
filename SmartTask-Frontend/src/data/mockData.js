// Mock Users
export const mockUsers = [
  { user_id: 'u1', username: 'alex.chen', email: 'alex@nexTask.io', password: 'pass123', role: 'PM' },
  { user_id: 'u2', username: 'maya.patel', email: 'maya@nexTask.io', password: 'pass123', role: 'Developer' },
  { user_id: 'u3', username: 'jordan.kim', email: 'jordan@nexTask.io', password: 'pass123', role: 'Designer' },
  { user_id: 'u4', username: 'sam.torres', email: 'sam@nexTask.io', password: 'pass123', role: 'Developer' },
  { user_id: 'u5', username: 'riley.moss', email: 'riley@nexTask.io', password: 'pass123', role: 'QA Engineer' },
  { user_id: 'u6', username: 'dfd.moss', email: 'dfd@gmail.com', password: '123', role: 'QA Engineer' },
];

// Mock Projects
export const mockProjects = [
  {
    project_id: 'p1',
    projectName: 'Nebula Dashboard Redesign',
    description: 'Complete overhaul of the analytics dashboard with new data visualizations and improved UX flows.',
    startDate: '2025-01-15',
    endDate: '2025-03-30',
    memberIds: ['u1', 'u2', 'u3'],
    color: '#22e5d4',
  },
  {
    project_id: 'p2',
    projectName: 'API Gateway Microservices',
    description: 'Build a scalable API gateway layer to unify backend microservices with rate limiting and auth.',
    startDate: '2025-02-01',
    endDate: '2025-04-15',
    memberIds: ['u1', 'u2', 'u4'],
    color: '#a78bfa',
  },
  {
    project_id: 'p3',
    projectName: 'Mobile App Launch',
    description: 'Cross-platform mobile application for iOS and Android with offline support and push notifications.',
    startDate: '2025-01-01',
    endDate: '2025-05-01',
    memberIds: ['u1', 'u3', 'u4', 'u5'],
    color: '#fbbf24',
  },
];

// Mock Tasks
export const mockTasks = [
  // Project 1 tasks
  {
    task_id: 't1', taskTitle: 'Design component library', status: 'COMPLETED', priority: 'HIGH',
    deadline: '2025-02-28', project_id: 'p1', assigneeIds: ['u3'],
    description: 'Create a comprehensive Figma component library with all UI elements, tokens, and documentation.',
    completedAt: '2025-02-25', createdAt: '2025-01-20',
  },
  {
    task_id: 't2', taskTitle: 'Implement data visualization charts', status: 'IN_PROGRESS', priority: 'HIGH',
    deadline: '2026-03-20', project_id: 'p1', assigneeIds: ['u2'],
    description: 'Build recharts-based visualization components for analytics dashboard including line, bar, pie charts.',
    completedAt: null, createdAt: '2025-02-01',
  },
  {
    task_id: 't3', taskTitle: 'User testing & feedback collection', status: 'TODO', priority: 'MEDIUM',
    deadline: '2026-04-10', project_id: 'p1', assigneeIds: ['u1', 'u5'],
    description: 'Coordinate user testing sessions with 20 participants, collect feedback, and synthesize findings.',
    completedAt: null, createdAt: '2025-02-15',
  },
  {
    task_id: 't4', taskTitle: 'Performance optimization pass', status: 'TODO', priority: 'LOW',
    deadline: '2026-04-25', project_id: 'p1', assigneeIds: ['u2'],
    description: 'Audit bundle size, lazy load heavy components, optimize re-renders using React.memo and useMemo.',
    completedAt: null, createdAt: '2025-02-20',
  },
  // Project 2 tasks
  {
    task_id: 't5', taskTitle: 'Set up Kong API Gateway', status: 'COMPLETED', priority: 'HIGH',
    deadline: '2025-02-20', project_id: 'p2', assigneeIds: ['u4'],
    description: 'Configure Kong API Gateway with plugins for authentication, rate limiting, and request transformation.',
    completedAt: '2025-02-18', createdAt: '2025-02-03',
  },
  {
    task_id: 't6', taskTitle: 'Implement JWT auth service', status: 'IN_PROGRESS', priority: 'HIGH',
    deadline: '2026-03-10', project_id: 'p2', assigneeIds: ['u2', 'u4'],
    description: 'Build JWT-based authentication microservice with refresh token rotation and revocation lists.',
    completedAt: null, createdAt: '2025-02-10',
  },
  {
    task_id: 't7', taskTitle: 'Write API documentation', status: 'TODO', priority: 'MEDIUM',
    deadline: '2026-03-28', project_id: 'p2', assigneeIds: ['u1'],
    description: 'Create OpenAPI 3.0 specification for all endpoints. Include examples, error codes, and auth flows.',
    completedAt: null, createdAt: '2025-02-12',
  },
  {
    task_id: 't8', taskTitle: 'Load testing and benchmarking', status: 'TODO', priority: 'MEDIUM',
    deadline: '2026-04-08', project_id: 'p2', assigneeIds: ['u5'],
    description: 'Run k6 load tests targeting 10,000 RPS. Identify bottlenecks and document performance benchmarks.',
    completedAt: null, createdAt: '2025-02-15',
  },
  // Project 3 tasks
  {
    task_id: 't9', taskTitle: 'Setup React Native project', status: 'COMPLETED', priority: 'HIGH',
    deadline: '2025-01-20', project_id: 'p3', assigneeIds: ['u4'],
    description: 'Initialize React Native Expo project with navigation, state management, and base architecture.',
    completedAt: '2025-01-19', createdAt: '2025-01-10',
  },
  {
    task_id: 't10', taskTitle: 'Implement offline sync engine', status: 'IN_PROGRESS', priority: 'HIGH',
    deadline: '2026-03-15', project_id: 'p3', assigneeIds: ['u2', 'u4'],
    description: 'Build offline-first data sync using SQLite local storage with conflict resolution and delta sync.',
    completedAt: null, createdAt: '2025-01-25',
  },
  {
    task_id: 't11', taskTitle: 'Push notification integration', status: 'TODO', priority: 'MEDIUM',
    deadline: '2026-04-20', project_id: 'p3', assigneeIds: ['u4'],
    description: 'Integrate Firebase Cloud Messaging for iOS and Android with deep linking and notification categories.',
    completedAt: null, createdAt: '2025-02-05',
  },
  {
    task_id: 't12', taskTitle: 'App Store submission prep', status: 'TODO', priority: 'HIGH',
    deadline: '2026-04-28', project_id: 'p3', assigneeIds: ['u1', 'u3'],
    description: 'Prepare screenshots, app descriptions, privacy policies, and metadata for App Store and Play Store submission.',
    completedAt: null, createdAt: '2025-02-08',
  },
  {
    task_id: 't13', taskTitle: 'Accessibility audit', status: 'CANCELLED', priority: 'LOW',
    deadline: '2026-03-30', project_id: 'p3', assigneeIds: ['u5'],
    description: 'Audit app for WCAG 2.1 compliance, screen reader compatibility, and dynamic text size support.',
    completedAt: null, createdAt: '2025-02-01',
  },
];

// Completion history (for AI predictions)
export const completionHistory = [
  { user_id: 'u2', onTime: 8, late: 3, avgDelayDays: 2.1 },
  { user_id: 'u3', onTime: 12, late: 1, avgDelayDays: 0.5 },
  { user_id: 'u4', onTime: 7, late: 5, avgDelayDays: 3.8 },
  { user_id: 'u5', onTime: 10, late: 2, avgDelayDays: 1.2 },
  { user_id: 'u1', onTime: 15, late: 0, avgDelayDays: 0 },
];

// Productivity insights data
export const productivityData = [
  { week: 'W1', completed: 4, planned: 5 },
  { week: 'W2', completed: 6, planned: 6 },
  { week: 'W3', completed: 3, planned: 7 },
  { week: 'W4', completed: 7, planned: 7 },
  { week: 'W5', completed: 5, planned: 6 },
  { week: 'W6', completed: 8, planned: 8 },
];
