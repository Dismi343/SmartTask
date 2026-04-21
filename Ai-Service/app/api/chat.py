from fastapi import APIRouter
from app.models.chat_model import ChatRequest,TaskInsightRequest,AiInsightRequest
from app.services.ai_service import process_prompt, process_prompt_ai_insight

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

@router.post("/ai-insight")
def ai_insight(request: AiInsightRequest):
    response = process_prompt_ai_insight(request)
    return response