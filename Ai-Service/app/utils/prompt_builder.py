def build_prompt(taskTitle: str, status: str, priority: str, deadline: str, description: str) -> str:
    context = "Tasks:\n"
    user_prompt ="You are an AI assistant for a project management tool called NexTask."
    
    task_info = f"title: {taskTitle}, status: {status}, priority: {priority}, deadline: {deadline}, description: {description}"
    context += f" 'Analyze this task and provide a brief actionable recommendation for the team.' -task: {{{task_info}}}"
  
    return context + "\nUser: " + user_prompt