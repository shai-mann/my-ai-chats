#!/bin/bash

echo "Starting AI Bots server..."

# Check if venv exists, if not run setup
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Running setup..."
    
    # Create new venv
    python3 -m venv venv
    
    # Activate venv
    source venv/bin/activate
    
    # Install dependencies in correct order
    echo "Installing dependencies..."
    pip install numpy==1.24.3
    pip install -r server/requirements.txt
    
    # Initialize database
    echo "Initializing database..."
    python server/init_db.py
else
    # Just activate the existing venv
    source venv/bin/activate
fi

# Check if database exists, if not initialize it
if [ ! -f "server/app.db" ]; then
    echo "Database not found. Initializing..."
    python server/init_db.py
fi

# Start the Flask server
echo "Starting Flask server..."
python server/app.py 