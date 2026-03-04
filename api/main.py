import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from pydantic import BaseModel

load_dotenv()

client = genai.Client()

app = FastAPI()

raw_allowed = os.getenv("ALLOWED_ORIGINS")
if raw_allowed:
    origins = [o for o in raw_allowed.split(",") if o]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    try:
        content = client.models.generate_content(
            model=os.getenv("GEMINI_MODEL"),
            contents=(
                f"You are a candidate.You only answer questions about your resume. "
                f"Your resume is: {json.dumps(resume)}. User says: {request.message}\nYou answer:"
            ),
        )
        print(content.text)
        response = MessageResponse(message=content.text)
        return response.model_dump()
    except Exception as e:
        return {"error": str(e)}
