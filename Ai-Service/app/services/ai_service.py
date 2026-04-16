# import requests
# from app.core.config import HF_API_KEY, MODEL_URL
# from app.utils.prompt_builder import build_prompt
# from app.models.chat_model import ChatRequest

# headers = {
#     "Authorization": f"Bearer {HF_API_KEY}"
# }

# def process_prompt(request: ChatRequest):
#     #final_prompt = build_prompt(request.prompt, request.tasks)

#     response = requests.post(
#         MODEL_URL,
#         headers=headers,
#         json={"inputs": request.prompt}
#     )

#     # Check if response status is successful
#     if response.status_code != 200:
#         return {
#             "error": f"API returned status code {response.status_code}",
#             "message": response.text
#         }
    
#     # Check if response has content
#     if not response.text:
#         return {
#             "error": "Empty response from API",
#             "message": "The API returned an empty response"
#         }
    
#     # Try to parse as JSON
#     try:
#         return response.json()
#     except requests.exceptions.JSONDecodeError as e:
#         return {
#             "error": "Invalid JSON response",
#             "message": f"Failed to parse response: {str(e)}",
#             "raw_response": response.text[:500]  # Return first 500 chars for debugging
#         }

from huggingface_hub import InferenceClient
from app.models.chat_model import ChatRequest
# from app.core.config import HF_API_KEY
from dotenv import load_dotenv
import os

load_dotenv()
HF_API_KEY = os.getenv("HF_API_KEY")

def process_prompt(request: ChatRequest):
    client = InferenceClient(
        model="meta-llama/Llama-3.1-8B-Instruct",
        token=HF_API_KEY
    )

    response = client.chat_completion(
        messages=[
            {"role": "user", "content": request.prompt}
        ],
        max_tokens=200
    )

    return {
        "response": response.choices[0].message["content"]
    }
    