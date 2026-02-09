import os
from google import genai
from dotenv import load_dotenv
import json

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("Checking available models...")
try:
    # We use model_dump() to see all the attributes of the model object
    for model in client.models.list():
        m_data = model.model_dump()
        print(f"Name: {m_data.get('name')} | Version: {m_data.get('version')}")
except Exception as e:
    print(f"Failed to list models: {e}")