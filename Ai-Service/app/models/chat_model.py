from pydantic import BaseModel
from typing import List, Optional

class Task(BaseModel):
    taskTitle: str
    deadline: str
    status: str

class ChatRequest(BaseModel):
    prompt: str
    tasks: Optional[List[Task]] = []