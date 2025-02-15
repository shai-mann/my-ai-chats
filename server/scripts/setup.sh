#!/bin/bash

echo "Setting up Python virtual environment..."

# Remove existing venv if it exists
if [ -d "venv" ]; then
    echo "Removing existing virtual environment..."
    rm -rf venv
fi

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

echo "Setup complete! You can now run the server with: python server/app.py" 