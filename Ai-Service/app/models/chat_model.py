from pydantic import BaseModel
from typing import List, Optional

class Task(BaseModel):
    taskTitle: str
    deadline: str
    status: str

class ChatRequest(BaseModel):
    prompt: str
    tasks: Optional[List[Task]] = []

class TaskInsightRequest(BaseModel):
    taskTitle: str
    status: str
    priority: str
    deadline: str
    description: str

class AiInsightRequest(BaseModel):
    username: str
    userrole: str
    completedcount: int
    completionrate: int
    inprogresscount: int
    overduecount: int
    ontimerate: int
    totaltasks: int
    topprioritytask: Optional[str] = None
    avgriskscore: int