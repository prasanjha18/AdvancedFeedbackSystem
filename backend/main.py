from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import jwt
import os
from typing import List
from dotenv import load_dotenv
from database import get_db, Feedback
from llm_utils import analyze_feedback

load_dotenv()
app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- WebSocket Manager ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

# --- Pydantic Models ---
class LoginRequest(BaseModel):
    username: str
    password: str

class FeedbackRequest(BaseModel):
    review: str

# --- Endpoints ---
@app.post("/api/login")
def login(req: LoginRequest):
    if req.username == os.getenv("ADMIN_USER") and req.password == os.getenv("ADMIN_PASS"):
        token = jwt.encode({"sub": req.username}, os.getenv("JWT_SECRET"), algorithm="HS256")
        return {"access_token": token}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/feedback")
async def submit_feedback(req: FeedbackRequest, db: Session = Depends(get_db)):
    # 1. Analyze with LLM
    analysis = analyze_feedback(req.review)
    
    # 2. Save to Database
    new_feedback = Feedback(
        rawText=req.review,
        sentiment=analysis["sentiment"],
        keyItems=",".join(analysis["keyItems"]),
        requiresAction=analysis["requiresAction"]
    )
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    
    # 3. Format for WebSocket Broadcast
    ws_data = {
        "id": new_feedback.id,
        "rawText": new_feedback.rawText,
        "sentiment": new_feedback.sentiment,
        "keyItems": analysis["keyItems"],
        "requiresAction": new_feedback.requiresAction,
    }
    
    # 4. Broadcast to Admins
    await manager.broadcast(ws_data)
    return {"message": "Feedback processed successfully"}

@app.get("/api/insights")
def get_insights(token: str, db: Session = Depends(get_db)):
    try:
        jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
    except:
        raise HTTPException(status_code=401, detail="Invalid Token")
    
    feedbacks = db.query(Feedback).order_by(Feedback.id.desc()).all()
    # Format keyItems back to arrays
    result = []
    for f in feedbacks:
        result.append({
            "id": f.id,
            "rawText": f.rawText,
            "sentiment": f.sentiment,
            "keyItems": f.keyItems.split(",") if f.keyItems else [],
            "requiresAction": f.requiresAction
        })
    return result

@app.websocket("/ws/admin")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text() # Keep connection open
    except WebSocketDisconnect:
        manager.disconnect(websocket)