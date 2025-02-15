from database import Base, engine
from models.conversation import Conversation
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


def init_db():
    # Check if we're in development mode
    if not os.getenv("FLASK_ENV") == "development":
        print("WARNING: Cannot drop tables in non-development environment")
        print("Set FLASK_ENV=development to enable table dropping")
        return

    print("Dropping all existing tables...")
    Base.metadata.drop_all(bind=engine)

    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


if __name__ == "__main__":
    init_db()
