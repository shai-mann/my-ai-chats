from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from controllers.conversations import get_conversations, create_conversation
from database import Base, engine

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
    ai_id = request.args.get("aiId")
    return get_conversations(ai_id)


@app.route("/api/conversations", methods=["POST"])
def conversations_create():
    return create_conversation(request.json)


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    host = os.getenv("HOST", "localhost")
    app.run(host=host, port=port)
