from flask_socketio import SocketIO
from controllers.messages import create_message
import eventlet

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
    def async_create_message():
        try:
            conversation_id = data.get("conversation_id")
            content = data.get("content")

            if not conversation_id or not content:
                return

            model_reply = create_message(conversation_id, content)
            model_reply["created_at"] = model_reply["created_at"].isoformat()
            socketio.emit("message", model_reply)

        except Exception as e:
            socketio.emit("error", {"message": "Failed to process message"})

    eventlet.spawn(async_create_message)


def handle_message_sent(data):
    print("Message sent:", data)
