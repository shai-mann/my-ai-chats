# AI Bots Server

Flask backend server for the AI Bots application. Handles conversation management and AI model inference.

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:

```bash
cp .env.template .env
# Then edit .env with your values
```

4. Run the server:

```bash
python app.py
```

## API Endpoints

### Get Conversations

```bash
GET /api/conversations/<ai_id>
```

### Create Conversation

```bash
POST /api/conversations/<ai_id>
```

### Get Conversation by ID

```bash
GET /api/conversations/<conversation_id>
```

### Delete Conversation

```bash
DELETE /api/conversations/<conversation_id>
```
