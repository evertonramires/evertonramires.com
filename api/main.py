import logging
import colorlog
import json
import os
import uvicorn
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from pydantic import BaseModel

logger = logging.getLogger(__name__)
formatter = colorlog.ColoredFormatter(
    "%(log_color)s %(asctime)s [%(levelname)s] %(message)s",
    datefmt="%d/%m/%y %H:%M:%S",
    log_colors={
        "DEBUG": "cyan",
        "INFO": "green",
        "WARNING": "yellow",
        "ERROR": "red",
        "CRITICAL": "bold_red",
    },
)
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logger.addHandler(handler)
log_level = os.getenv("LOG_LEVEL", "DEBUG").upper()
logger.setLevel(getattr(logging, log_level, logging.DEBUG))

load_dotenv()

# SQLite setup
DATABASE_URL = "sqlite:///./.chat_history.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define database model
class ConversationHistory(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True, index=True)
    user_message = Column(String)
    ai_response = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

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

logger.info("API started!")

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
                f"You are a candidate. You only answer questions about your resume. "
                f"Your resume is: {json.dumps(resume)}. User says: {request.message}\nYou answer:"
            ),
        )        
        response = MessageResponse(message=content.text)
        
        # Store in database
        db = SessionLocal()
        db_entry = ConversationHistory(user_message=request.message, ai_response=content.text)
        db.add(db_entry)
        db.commit()
        db.close()
        
        return response.model_dump()
    except Exception as e:
        logger.error(e)
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)