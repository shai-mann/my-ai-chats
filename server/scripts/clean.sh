#!/bin/bash

echo "Cleaning up Python environment..."

# Deactivate venv if active
if [ -n "$VIRTUAL_ENV" ]; then
    deactivate
fi

# Remove venv directory
if [ -d "venv" ]; then
    rm -rf venv
fi

# Remove database file
if [ -f "server/app.db" ]; then
    rm server/app.db
fi

# Remove Python cache files
find . -type d -name "__pycache__" -exec rm -r {} +
find . -type f -name "*.pyc" -delete

echo "Cleanup complete!" 