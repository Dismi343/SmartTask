from huggingface_hub import InferenceClient
from app.models.chat_model import TaskInsightRequest, AiInsightRequest
from dotenv import load_dotenv
from app.utils.prompt_builder import build_prompt,build_prompt_for_ai_insight
import os

load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY")

def process_prompt(request: TaskInsightRequest):
    prompt = build_prompt(request.taskTitle, request.status, request.priority, request.deadline, request.description)
    client = InferenceClient(
        model="meta-llama/Llama-3.1-8B-Instruct",
        token=HF_API_KEY
    )

    response = client.chat_completion(
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=200
    )

    return {
        "response": response.choices[0].message["content"]
    }
    

def process_prompt_ai_insight(request: AiInsightRequest):
    prompt = build_prompt_for_ai_insight(
        username=request.username,
        userrole=request.userrole,
        completedcount=request.completedcount,
        completionRate=request.completionrate,
        inprogresscount=request.inprogresscount,
        overduecount=request.overduecount,
        ontimerate=request.ontimerate,
        totaltasks=request.totaltasks,
        topPriorityTask=request.topprioritytask,
        avgRiskScore=request.avgriskscore
    )

    print("Generated Prompt:", prompt)  # Debugging line to check the generated prompt
    client = InferenceClient(
        model="meta-llama/Llama-3.1-8B-Instruct",
        token=HF_API_KEY
    )

    response = client.chat_completion(
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=200
    )

    return {
        "response": response.choices[0].message["content"]
    }