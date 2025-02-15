from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from controllers.conversations import get_conversations, create_conversation
from database import Base, engine
from models.ai.model_registry import model_registry
from controllers.messages import get_messages, create_message
from init_db import init_db

# Load environment variables
load_dotenv()

# Initialize database
Base.metadata.create_all(bind=engine)

app = Flask(__name__)
# Update CORS configuration
CORS(
    app,
    resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    },
)

# Configure app from environment
app.config.update(
    ENV=os.getenv("FLASK_ENV"),
    DEBUG=os.getenv("FLASK_DEBUG") == "1",
)


@app.route("/", methods=["GET"])
def home():
    print("AI Bots API is running")
    return jsonify({"status": "ok", "message": "AI Bots API is running"})


@app.route("/api/conversations", methods=["GET"])
def conversations_get():
    ai_id = request.args.get("model_id")
    return get_conversations(ai_id)


@app.route("/api/conversations", methods=["POST"])
def conversations_create():
    return create_conversation(request.json)


@app.route("/api/messages", methods=["GET"])
def messages_get():
    conversation_id = request.args.get("conversation_id")
    return get_messages(conversation_id)


@app.route("/api/messages", methods=["POST"])
def messages_create():
    conversation_id = request.json.get("conversation_id")
    content = request.json.get("content")
    return create_message(conversation_id, content)


# Mainly for API usage - not used in the frontend
@app.route("/api/predict/<model_id>", methods=["POST"])
def predict(model_id: str):
    try:
        model = model_registry.get_model(model_id)
        input_data = request.json
        prediction = model.predict(input_data)
        return jsonify(prediction)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "localhost")
    init_db()
    app.run(host=host, port=port)
