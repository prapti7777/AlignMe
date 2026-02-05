import os
from google import genai
from dotenv import load_dotenv

# 1. Load your API key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

# 2. Initialize the Client
client = genai.Client(api_key=api_key)

print("⏳ Connecting to Gemini (2026 Stable Model)...")

try:
    # 3. Using the 2.5 Flash-Lite model (High quota, no credit card required)
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite", 
        contents="Hello! Say 'System online' if you can hear me."
    )
    
    print("\n--- AI RESPONSE ---")
    print(response.text.strip())
    print("-------------------\n")
    print("✅ Success! Your backend is officially up to date.")

except Exception as e:
    # If 2.5 is not yet in your region, this catch will help us identify why
    print(f"❌ Error: {e}")