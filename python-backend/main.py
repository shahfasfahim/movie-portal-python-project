from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Movie AI Backend", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_api_key = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=groq_api_key) if groq_api_key else None

class MovieRequest(BaseModel):
    movie_name: str

def create_groq_completion(messages, max_tokens=250, temperature=0.7):
    if not groq_client:
        raise HTTPException(status_code=503, detail="Groq API is not configured")
    
    response = groq_client.chat.completions.create(
        messages=messages,
        model="llama-3.3-70b-versatile",
        temperature=temperature,
        max_tokens=max_tokens
    )
    # Safe access to content
    content = response.choices[0].message.content if response.choices and response.choices[0].message else None
    return content

@app.post("/recommend")
async def recommend_movies(request: MovieRequest):
    try:
        # Validate input
        movie_name = (request.movie_name or "").strip()
        if not movie_name:
            raise HTTPException(status_code=400, detail="Movie name is required")

        content = create_groq_completion([
            {
                "role": "system",
                "content": "You are an expert movie recommendation assistant. Recommend movies similar to the given film. Provide 5 suggestions with just the movie titles (one per line). Be concise and accurate."
            },
            {
                "role": "user",
                "content": f"Recommend 5 movies similar to {movie_name}"
            }
        ], max_tokens=200)

        # Safe handling of content
        if not content:
            return {"recommendations": ["Sorry, unable to generate recommendations at this time."]}

        recommendations = [
            line.strip()
            for line in (content or "").split('\n')
            if line.strip()
        ][:5]

        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@app.post("/summary")
async def movie_summary(request: MovieRequest):
    try:
        # Validate input
        movie_name = (request.movie_name or "").strip()
        if not movie_name:
            raise HTTPException(status_code=400, detail="Movie name is required")

        summary = create_groq_completion([
            {
                "role": "system",
                "content": "You are a movie expert assistant. Provide a short and engaging summary."
            },
            {
                "role": "user",
                "content": f"Give a short and engaging summary of the movie {movie_name}"
            }
        ], max_tokens=200, temperature=0.7)

        # Safe handling of summary
        safe_summary = (summary or "").strip()
        if not safe_summary:
            safe_summary = "Sorry, unable to generate summary at this time."

        return {"summary": safe_summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")

@app.post("/review")
async def movie_review(request: MovieRequest):
    try:
        # Validate input
        movie_name = (request.movie_name or "").strip()
        if not movie_name:
            raise HTTPException(status_code=400, detail="Movie name is required")

        review = create_groq_completion([
            {
                "role": "system",
                "content": "You are a movie review assistant. Provide a short review with rating out of 10."
            },
            {
                "role": "user",
                "content": f"Write a short review of the movie {movie_name} with rating out of 10."
            }
        ], max_tokens=220, temperature=0.7)

        # Safe handling of review
        safe_review = (review or "").strip()
        if not safe_review:
            safe_review = "Sorry, unable to generate review at this time."

        return {"review": safe_review}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating review: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Movie AI Backend is running"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PYTHON_BACKEND_PORT", "8001"))
    uvicorn.run(app, host="0.0.0.0", port=port)