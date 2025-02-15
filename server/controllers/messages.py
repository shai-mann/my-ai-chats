from flask import jsonify
from models.message import Message
from models.conversation import Conversation
from database import SessionLocal
import uuid
from models.ai.model_registry import model_registry


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
        )

        # When a new message is sent, we need to trigger a prediction and return it to the user.
        # This will also cause a message to be added to the conversation in the database.

        # Get the model from the conversation
        conversation = (
            db.query(Conversation).filter(Conversation.id == conversation_id).first()
        )
        model = model_registry[conversation.model_id]

        # Trigger a prediction
        prediction = model.predict(content)

        # Add the user's message and the AI's prediction to the conversation
        db.add(message)
        db.add(
            Message(
                id=str(uuid.uuid4()),
                conversation_id=conversation_id,
                content=prediction,
                role="ai",
            )
        )
        db.commit()

        return jsonify(prediction)
    finally:
        db.close()
