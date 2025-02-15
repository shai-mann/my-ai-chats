from datetime import datetime
from sqlalchemy import Column, String, DateTime
from database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    model_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
