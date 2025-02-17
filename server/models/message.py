from sqlalchemy import Column, String, DateTime, ForeignKey, func
from database import Base
from datetime import datetime


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True)
    conversation_id = Column(String, ForeignKey("conversations.id"), nullable=False)
    content = Column(String, nullable=False)
    role = Column(String, nullable=False)  # user or ai, indicating who sent the message
    created_at = Column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "role": self.role,
            "created_at": str(self.created_at),
        }
