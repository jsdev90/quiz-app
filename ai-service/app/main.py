from fastapi import FastAPI, HTTPException, Query, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import logging
import httpx
import os
import re

app = FastAPI(title="Simple AI Quiz Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(level=logging.INFO)

# Mistral API configuration
MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "0nNz0kUmmeNNziKiCUcKjeAQZiaB4xso")

# Cache to avoid repeated generation
quiz_cache = {}

# Pydantic models
class Question(BaseModel):
    id: int
    text: str
    options: List[str]
    correctAnswer: str

class QuizResponse(BaseModel):
    questions: List[Question]

# AI call
async def call_mistral_api(prompt: str) -> str:
    if not MISTRAL_API_KEY:
        raise HTTPException(status_code=500, detail="Mistral API key not configured")

    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "mistral-small",
        "messages": [{"role": "user", "content": prompt}]
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(MISTRAL_API_URL, headers=headers, json=payload)
        if response.status_code != 200:
            logging.error(f"Mistral API error {response.status_code}: {response.text}")
            raise HTTPException(status_code=502, detail="Failed to generate quiz from AI")

        data = response.json()
        return data["choices"][0]["message"]["content"]

# Parse AI response
def parse_quiz_output(text: str) -> List[Question]:
    try:
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if not match:
            raise ValueError("No JSON found in AI response")

        data = json.loads(match.group(0))
        return [
            Question(
                id=i + 1,
                text=q["text"],
                options=q["options"],
                correctAnswer=q["correctAnswer"]
            )
            for i, q in enumerate(data.get("questions", []))
        ]
    except Exception as e:
        logging.error(f"Error parsing AI response: {e}\nRaw response: {text}")
        raise HTTPException(status_code=500, detail="Invalid AI output format")

# Core logic
async def generate_quiz(topic: str) -> List[Question]:
    topic = topic.strip().lower()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic is required")

    if topic in quiz_cache:
        return quiz_cache[topic]

    prompt = (
        f"Generate a 5-question multiple choice quiz about '{topic}'. "
        "Return it as a JSON object with key 'questions', and each question with 'text', 'options' (list of 4), and 'correctAnswer'. "
        "Example:\n"
        '{ "questions": [ { "text": "Sample?", "options": ["A", "B", "C", "D"], "correctAnswer": "A" } ] }'
    )

    ai_response = await call_mistral_api(prompt)
    logging.info(f"AI Output: {ai_response}")
    questions = parse_quiz_output(ai_response)
    quiz_cache[topic] = questions
    return questions

# GET endpoint
@app.get("/generate-quiz", response_model=QuizResponse)
async def get_quiz(topic: str = Query(..., min_length=1, description="Quiz topic")):
    print(f"[LOG] Generating quiz for topic: {topic}")
    return QuizResponse(questions=await generate_quiz(topic))

# POST endpoint
@app.post("/generate-quiz", response_model=QuizResponse)
async def post_quiz(data: dict = Body(...)):
    topic = data.get("topic", "").strip()
    print(f"[LOG] POST request to generate quiz with topic: {topic}")
    if not topic:
        raise HTTPException(status_code=400, detail="Topic is required")
    return QuizResponse(questions=await generate_quiz(topic))
