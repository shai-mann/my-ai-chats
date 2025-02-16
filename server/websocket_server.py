from flask_socketio import SocketIO
from controllers.messages import create_message

# Initialize SocketIO with eventlet async mode
socketio = SocketIO(
    cors_allowed_origins="*",
    async_mode="eventlet",  # Use eventlet for better async performance
    logger=True,
)


@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


@socketio.on("send_message")
def handle_messages(data):
    print("Received message:", data)
    conversation_id = data.get("conversation_id")
    content = data.get("content")
    model_reply = create_message(conversation_id, content)
    model_reply["created_at"] = model_reply["created_at"].isoformat()
    socketio.emit("message", model_reply, callback=handle_message_sent)


def handle_message_sent(data):
    print("Message sent:", data)
