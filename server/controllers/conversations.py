from flask import jsonify, request
from datetime import datetime
import uuid
from models.conversation import Conversation
from database import SessionLocal


def get_conversations(ai_id: str):
    db = SessionLocal()
    try:
        conversations = db.query(Conversation).filter(Conversation.ai_id == ai_id).all()
        return jsonify(
            [
                {
                    "id": conv.id,
                    "title": conv.title,
                    "aiId": conv.ai_id,
                    "createdAt": conv.created_at.isoformat(),
                }
                for conv in conversations
            ]
        )
    finally:
        db.close()


def create_conversation(data: dict):
    db = SessionLocal()
    try:
        conversation = Conversation(
            id=str(uuid.uuid4()),
            title=data.get("title", "New Conversation"),
            ai_id=data.get("aiId"),
            created_at=datetime.utcnow(),
        )
        db.add(conversation)
        db.commit()
        return jsonify(
            {
                "id": conversation.id,
                "title": conversation.title,
                "aiId": conversation.ai_id,
                "createdAt": conversation.created_at.isoformat(),
            }
        )
    finally:
        db.close()
