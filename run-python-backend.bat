@echo off
rem Make sure GROQ_API_KEY is set in your environment or .env file before running.
set PYTHON_BACKEND_PORT=8000
cd python-backend
python main.py
pause