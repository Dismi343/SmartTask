import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockProjects, mockTasks } from '../data/mockData';
import axios from 'axios';
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [projects, setProjects] = useState(mockProjects);
  const [tasks, setTasks] = useState(mockTasks);
  const [activeProject, setActiveProject] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Load session from localStorage
  useEffect(() => {
     const savedUser = localStorage.getItem('nexTask_user');
    const token = localStorage.getItem('nexTask_token');
  if (savedUser && token) {
    setCurrentUser(JSON.parse(savedUser));
  }  
  }, []);

  const API_BASE_URL = 'http://localhost:5050/api/v1'; 

    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('nexTask_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

  const login = async (email, password) => {

    try{
      const response= await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      console.log(response.data);
      setCurrentUser(response.data.data.user);
      localStorage.setItem('nexTask_user', JSON.stringify(response.data.data.user));
      localStorage.setItem('nexTask_token', response.data.data.token);
      return { success: true };
    }catch(e){
      console.error('Login error:', e);
      return { success: false, error: 'An error occurred during login' };
    }

  };

  const signup = async (userData) => {
    const exists = users.find(u => u.email === userData.email);
    if (exists) return { success: false, error: 'Email already in use' };

    const newUser = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role
    };
    try{
      const response= await axios.post(`${API_BASE_URL}/users/create-user`, newUser);
      console.log(response.data);

    }catch(e){
      console.log(e);      
      return { success: false, error: 'An error occurred during signup' };
    }

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('nexTask_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveProject(null);
    localStorage.removeItem('nexTask_user');
  };

  const getUserProjects = (userId) => {
    return projects.filter(p => p.memberIds.includes(userId));
  };

  const getProjectTasks = (projectId) => {
    return tasks.filter(t => t.project_id === projectId);
  };

  const getUserTasks = (userId) => {
    return tasks.filter(t => t.assigneeIds.includes(userId));
  };

  const updateTaskStatus = (taskId, status) => {
    setTasks(prev => prev.map(t =>
      t.task_id === taskId ? { ...t, status, completedAt: status === 'COMPLETED' ? new Date().toISOString() : t.completedAt } : t
    ));
    addNotification('Task status updated successfully', 'success');
  };

  const createTask = (taskData) => {
    const newTask = {
      task_id: `t${Date.now()}`,
      ...taskData,
      createdAt: new Date().toISOString(),
      completedAt: null,
      assigneeIds: taskData.assigneeIds || [],
    };
    setTasks(prev => [...prev, newTask]);
    addNotification('Task created successfully', 'success');
    return newTask;
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, ...updates } : t));
    addNotification('Task updated', 'success');
  };

  const createProject = (projectData) => {
    const newProject = {
      project_id: `p${Date.now()}`,
      ...projectData,
      memberIds: [currentUser.user_id, ...(projectData.memberIds || [])],
    };
    setProjects(prev => [...prev, newProject]);
    addNotification('Project created successfully', 'success');
    return newProject;
  };

  const addNotification = (message, type = 'info') => {
    const notif = { id: Date.now(), message, type };
    setNotifications(prev => [...prev, notif]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notif.id));
    }, 3500);
  };

  const getUserById = (id) => users.find(u => u.user_id === id);
  const getProjectById = (id) => projects.find(p => p.project_id === id);

  return (
    <AppContext.Provider value={{
      currentUser, users, projects, tasks, activeProject,
      notifications, setActiveProject,
      login, signup, logout,
      getUserProjects, getProjectTasks, getUserTasks,
      updateTaskStatus, createTask, updateTask, createProject,
      getUserById, getProjectById, addNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
