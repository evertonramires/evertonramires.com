import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from google import genai
from pydantic import BaseModel

load_dotenv()

client = genai.Client()

app = FastAPI()

class MessageRequest(BaseModel):
    message: str

class MessageResponse(BaseModel):
    message: str

def get_resume():
    with open("resume.json") as f:
        return json.load(f)

resume = get_resume()

@app.get("/")
def pun():
    pun =client.models.generate_content(
        model=os.getenv("GEMINI_MODEL"), contents="Write a pun about programming."
    )
    return {"message": pun.text}

@app.post("/")
def message(request: MessageRequest):
    content = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL"), contents=f"You are a candidate.You only answer questions about your resume. Your resume is: {json.dumps(resume)}. User says: {request.message}\nYou answer:"
    )
    response = MessageResponse(message=content.text)
    return response.model_dump()