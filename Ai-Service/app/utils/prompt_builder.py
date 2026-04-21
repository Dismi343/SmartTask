def build_prompt(taskTitle: str, status: str, priority: str, deadline: str, description: str) -> str:
    context = "Tasks:\n"
    user_prompt ="You are an AI assistant for a project management tool called Smart-Task."
    
    task_info = f"title: {taskTitle}, status: {status}, priority: {priority}, deadline: {deadline}, description: {description}"
    context += f" 'Analyze this task and provide a brief actionable recommendation for the team.' -task: {{{task_info}}}"
  
    return context + "\nUser: " + user_prompt


def build_prompt_for_ai_insight( username:str, userrole: str, completedcount: int,    completionRate: int,    inprogresscount: int,    overduecount: int,    ontimerate: int,    totaltasks: int,    topPriorityTask: str,    avgRiskScore: int) -> str:
    user_prompt ="You are an AI assistant for a project management tool called Smart-Task."
    
    context = f"Provide a personalized productivity coaching insight for  {username} in the position of {userrole}. Focus on their completedcount: {completedcount}, completionRate: {completionRate}, inprogresscount: {inprogresscount}, overduecount: {overduecount}, ontimerate: {ontimerate}, totaltasks: {totaltasks}, topPriorityTask: {topPriorityTask}, avgRiskScore: {avgRiskScore}"
  
    return context + "\nUser: " + user_prompt