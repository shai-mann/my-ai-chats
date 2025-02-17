from flask import jsonify
from models.message import Message
from models.conversation import Conversation
from database import SessionLocal
import uuid
from models.ai.model_registry import model_registry
from datetime import datetime, timezone


def get_messages(conversation_id: str):
    db = SessionLocal()
    try:
        messages = (
            db.query(Message)
            .filter(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
            .all()
        )
        return jsonify([message.to_dict() for message in messages])
    finally:
        db.close()


def create_message(conversation_id: str, content: str):
    db = SessionLocal()
    try:
        message = Message(
            id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            content=content,
            role="user",
            created_at=datetime.now(),
        )

        # When a new message is sent, we need to trigger a prediction and return it to the user.
        # This will also cause a message to be added to the conversation in the database.

        # Get the model from the conversation
        conversation = (
            db.query(Conversation).filter(Conversation.id == conversation_id).first()
        )
        model = model_registry.get_model(conversation.model_id)
        # Trigger a prediction
        prediction = model.predict({"content": content})

        model_message = Message(
            id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            content=prediction.get(
                "prediction"
            ),  # store just the content of the prediction
            role="ai",
            created_at=datetime.now(),
        )

        # Add the user's message and the AI's prediction to the conversation
        db.add(message)
        db.add(model_message)
        db.commit()

        # Send the message to the client
        return model_message.to_dict()
    finally:
        db.close()
