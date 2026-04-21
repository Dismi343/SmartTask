import { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockProjects, mockTasks } from '../data/mockData';
import axios from 'axios';
import { add, set } from 'date-fns';
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Load session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('nexTask_user');
    const token = localStorage.getItem('nexTask_token');
  
  if (savedUser && token) {
    setCurrentUser(JSON.parse(savedUser));
  }
  ;  
  }, []);

useEffect(()=>{
  if (!currentUser?.user_id) return;

  const fetchProjects = async () => {
    let projectData = [];
    // If user is PM, fetch all projects; otherwise fetch only their projects
    if (currentUser?.role === 'PM' || currentUser?.role === 'Project Manager') {
      // Call getAllProjects endpoint instead
      
       projectData = await getAllProjects('',0, 100); // Fetch first 100 projects for PM
    } else {
      // Non-PM users see only their projects
      projectData = await getUserProjects(currentUser.user_id);
    }
    
    const safeProjects = Array.isArray(projectData) ? projectData.map(p => ({
      ...p,
      // Ensure userList exists and is an array
      userList: p.userList || p.users || [] 
    })) : [];
    setProjects(safeProjects);
    console.log("Fetched projects:", safeProjects);
        try{
          const response = await axios.get(`${API_BASE_URL}/tasks/search-tasks`,{params:{searchText:'',page:0,size:100}});
          const tasksData = response.data.data.dataList || [];
          console.log("User tasks response:", tasksData);

          // Combine tasks from API and from projects
            // Filter tasks from API by current user and their projects
          const allTasks = tasksData.map(t => ({
                ...t,
                assigneeIds: t.user?.user_id ? [t.user.user_id] : [],
                project_id: t.projectId,
              }));

              // Filter based on role
              if (currentUser?.role === 'PM' || currentUser?.role === 'Project Manager') {
                // PMs see all tasks
                setTasks(allTasks);
              } else {
                // Non-PMs see only their tasks
                const userTasks = allTasks.filter(t => {
                  const isAssignedToCurrentUser = t.user?.user_id === currentUser?.user_id;
                  const projectExists = safeProjects.some(p => p.project_id === t.projectId);
                  return isAssignedToCurrentUser && projectExists;
                });
                setTasks(userTasks);
              }
        }catch(e){
          console.error("Error fetching tasks:", e);
        }

        const userList= await loadUsers();
        setUsers(userList);
        console.log("Fetched users:", userList);

    }

  fetchProjects();
}, [currentUser]);

  const API_BASE_URL = 'http://localhost:5050/api/v1'; 

    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('nexTask_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });


    const loadUsers = async ()=>{
      try{
        const res=await axios.get(`${API_BASE_URL}/users/search-users`,{params:{searchText:'',page:0,size:1000}});
        return res.data.data.dataList;
      }catch(e){
        console.error("Error fetching users:", e);
      }
    }
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

 const getUserProjects = async (userId, page = 0, size = 10) => {

  // console.log(`Fetching projects for user ${userId} with page=${page} and size=${size}`);
  try {
    const response = await axios.get(
      `${API_BASE_URL}/projects/search-projects-by-user/${userId}`,
      { params: { page, size } }
    );
    const projectsData = response.data.data.dataList;
    //console.log("RESPONSE.DATA:", response.data.data.dataList);
   
    return projectsData;
  } catch (e) {
    console.error("Error fetching user projects:", e);
    return [];
  }
};

 const getAllProjects = async (searchText='', page = 0, size = 10) => {

  // console.log(`Fetching projects for user ${userId} with page=${page} and size=${size}`);
  try {
    const response = await axios.get(
      `${API_BASE_URL}/projects/search-projects`,
      { params: { searchText, page, size } }
    );
    const projectsData = response.data.data.dataList;
    console.log("RESPONSE.DATA:", response.data.data.dataList);
    return projectsData;
  } catch (e) {
    console.error("Error fetching user projects:", e);
    return [];
  }
};

  const getProjectTasks = (projectId) => {
    return tasks.filter(t => t.project_id === projectId);
  };

 const getUserTasks = (userId) => {
  return (tasks ?? []).filter((t) => (t.user_id ?? []).includes(userId));
};

  const updateTaskStatus = (taskId, status) => {
    setTasks(prev => prev.map(t =>
      t.task_id === taskId ? { ...t, status, completedAt: status === 'COMPLETED' ? new Date().toISOString() : t.completedAt } : t
    ));
    addNotification('Task status updated successfully', 'success');
  };

  const createTask = async(taskData) => {
    const newTask = {
      ...taskData
    };
    console.log("Creating task with data:", newTask);
    setTasks(prev => [...prev, newTask]);
    try{
      const result = await axios.post(`${API_BASE_URL}/tasks/create-task`, newTask);
      console.log("Task creation response:", result.data);
      addNotification('Task created successfully', 'success');
    }catch(e){
      console.error("Error creating task:", e);
      addNotification('Failed to create task', 'error');
    }

    // addNotification('Task created successfully', 'success');
    return newTask;
  };

  const updateTask = async(taskId, updates) => {
    setTasks(prev => prev.map(t => t.task_id === taskId ? { ...t, ...updates } : t));
      try {
      await axios.put(`${API_BASE_URL}/tasks/update-task/${taskId}`, updates);
    
    } catch (error) {
      console.error("Error changing task status:", error);
      addNotification('Failed to update task status', 'error');
    }
    addNotification('Task updated', 'success');
  };

  const createProject =async (projectData) => {
    const newProject = {
      ...projectData,
      users: [...(projectData.users || []), currentUser.user_id]
    };
    setProjects(prev => [...prev, newProject]);
    try{
      const res=await axios.post(`${API_BASE_URL}/projects/create-project`, newProject);
      console.log("Project creation response:", res.data);
    }catch(e){
      console.error("Error creating project:", e);
      addNotification('Failed to create project', 'error');
    }

    console.log("Creating project with data:", newProject);
    addNotification('Project created successfully', 'success');
    return newProject;
  };

  const deleteProject = async (projectId) => {
    try {
      await axios.delete(`${API_BASE_URL}/projects/delete-project/${projectId}`);
      setProjects(prev => prev.filter(p => p.project_id !== projectId));
      setTasks(prev => prev.filter(t => t.project_id !== projectId));
      addNotification('Project purged successfully', 'success');
    } catch (e) {
      console.error("Error deleting project:", e);
      addNotification('Failed to delete project', 'error');
    }
  };

  const addNotification = (message, type = 'info') => {
    const notif = { id: Date.now(), message, type };
    setNotifications(prev => [...prev, notif]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notif.id));
    }, 3500);
  };

  const getUserById = (id) => users.find(u => u.user_id === id);
  const getProjectById = (id) =>{
    return projects.find(p => p.project_id === id)
    };

  const changeTaskStatus = async (taskId, updates) => {
    try {
      await axios.put(`${API_BASE_URL}/tasks/update-task/${taskId}`, updates);
      updateTaskStatus(taskId, updates.status);
    } catch (error) {
      console.error("Error changing task status:", error);
      addNotification('Failed to update task status', 'error');
    }
  };

  const getAllUsers=async()=>{
    try{
      const response = await axios.get(`${API_BASE_URL}/users/search-users`,{params:{searchText:'',page:0,size:100}});
      const userList = response.data.data.dataList;
      console.log("All users response:", userList);
      return userList;
      
    }
    catch(e){
      console.error("Error fetching users:", e);
    }
  }
  const deleteTaskById =async(taskId) =>{
    try{
      await axios.delete(`${API_BASE_URL}/tasks/delete-task/${taskId}`);
      setTasks(prev => prev.filter(t => t.task_id !== taskId));
      addNotification('Task deleted successfully', 'success');
    }catch(e){
      console.error("Error deleting task:", e);
      addNotification('Failed to delete task', 'error');
    }
  }

  const updatePassword = async(token, newPassword)=>{
    try{
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { 
        token:token,
        newPassword:newPassword
       });
       console.log("Password reset response:", response.data);
       addNotification('Password updated successfully', 'success');
    }catch(e){

      console.error("Error updating password:", e);
    }
  }

  const forgotPassword = async(email)=>{
    try{
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`,null,{params:{email}});
      console.log("Forgot password response:", response.data);
      addNotification('Password reset link sent to your email', 'success');
    }catch(e){
      console.error("Error in forgot password:", e);
       addNotification('Failed to send reset link', 'error');
    }
  }

  return (
    <AppContext.Provider value={{
      currentUser, users, projects, tasks, activeProject,
      notifications, setActiveProject,
      login, signup, logout,
      getUserProjects, getProjectTasks, getUserTasks,
      updateTaskStatus, createTask, updateTask, createProject, deleteProject,
      getUserById, getProjectById, addNotification,changeTaskStatus,getAllUsers,deleteTaskById,updatePassword,forgotPassword
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
