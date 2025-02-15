from flask import jsonify, request
from datetime import datetime
import uuid
from models.conversation import Conversation
from database import SessionLocal


def get_conversations(model_id: str):
    db = SessionLocal()
    try:
        conversations = (
            db.query(Conversation)
            .filter(Conversation.model_id == model_id)
            .order_by(Conversation.created_at.desc())
            .all()
        )
        return jsonify(
            [
                {
                    "id": conv.id,
                    "title": conv.title,
                    "modelId": conv.model_id,
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
            model_id=data.get("model_id"),
            created_at=datetime.utcnow(),
        )
        db.add(conversation)
        db.commit()
        return jsonify(
            {
                "id": conversation.id,
                "title": conversation.title,
                "modelId": conversation.model_id,
                "createdAt": conversation.created_at.isoformat(),
            }
        )
    finally:
        db.close()
