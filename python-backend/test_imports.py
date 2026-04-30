#!/usr/bin/env python
try:
    from fastapi import FastAPI
    from uvicorn import run
    from pydantic import BaseModel
    from dotenv import load_dotenv
    from groq import Groq
    print("✓ All imports successful!")
except ImportError as e:
    print(f"✗ Import Error: {e}")
