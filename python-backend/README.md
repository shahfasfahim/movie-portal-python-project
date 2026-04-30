# Python AI Backend

This is the Python FastAPI backend for AI features in the Movie Portal.

## Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set environment variables:
   - `GROQ_API_KEY`: Your Groq API key

3. Run the server:
   ```bash
   python main.py
   ```

   Or use the batch file:
   ```bash
   run-python-backend.bat
   ```

The server will run on `http://localhost:8000`

## Endpoints

- `POST /recommend`: Get movie recommendations
- `POST /summary`: Generate movie summary
- `POST /review`: Generate movie review

All endpoints accept JSON with `movie_name` field.