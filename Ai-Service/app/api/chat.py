from fastapi import APIRouter
from app.models.chat_model import ChatRequest,TaskInsightRequest
from app.services.ai_service import process_prompt

router = APIRouter()

@router.post("/chat")
def chat(request: ChatRequest):
    response = process_prompt(request)
    print("Response:", response)
    return response

@router.post("/task-insight")
def task_insight(request: TaskInsightRequest):
    response = process_prompt(request)
    #print("Response:", response)
    return response