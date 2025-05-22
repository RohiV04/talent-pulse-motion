from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from livekit import api
from pydantic import BaseModel
from typing import Optional
import httpx
import os
import json

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LiveKit configuration
livekit_api_key = os.getenv("LIVEKIT_API_KEY")
livekit_api_secret = os.getenv("LIVEKIT_API_SECRET")
core_service_url = os.getenv("CORE_SERVICE_URL")

class InterviewSession(BaseModel):
    user_id: str
    resume_id: Optional[str]
    job_description_id: Optional[str]

@app.post("/ai/interview/start")
async def start_interview(session: InterviewSession):
    try:
        # Create room token
        room_name = f"interview_{session.user_id}"
        token = api.AccessToken(livekit_api_key, livekit_api_secret)
        token.add_grant(
            room_join=True,
            room=room_name,
            participant_name="ai_interviewer"
        )
        
        # Initialize interview in core service
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{core_service_url}/api/v1/interviews",
                json={
                    "userId": session.user_id,
                    "resumeId": session.resume_id,
                    "jobDescriptionId": session.job_description_id
                }
            )
            
            if response.status_code != 201:
                raise HTTPException(status_code=500, detail="Failed to initialize interview")
            
            interview_data = response.json()
            
        return {
            "token": token.to_jwt(),
            "room": room_name,
            "interview_id": interview_data["id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ai/interview/ws/{interview_id}")
async def interview_websocket(websocket: WebSocket, interview_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Process the message and generate AI response
            response = {
                "type": "ai_response",
                "content": "AI response here"  # Replace with actual AI processing
            }
            
            await websocket.send_json(response)
    except Exception as e:
        await websocket.close()

@app.post("/ai/resume/analyze")
async def analyze_resume(resume_id: str, job_description_id: Optional[str] = None):
    try:
        # Implement resume analysis logic here
        analysis_result = {
            "score": 85,
            "feedback": "Resume analysis feedback",
            "matches": []
        }
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))