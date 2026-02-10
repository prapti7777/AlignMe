import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv

# Initialize Flask and load environment variables
app = Flask(__name__)
CORS(app) 
load_dotenv()

# Setup Gemini Client
# The google-genai SDK (v2.0+) works best with the 2.0-flash model string
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.route('/analyze', methods=['POST'])
def analyze_career():
    try:
        # Get data from the frontend
        data = request.json
        responses = data.get('responses', {})
        
        # Extract individual components
        pers = responses.get('personality', [])
        tech = responses.get('technical', [])
        desired_role = responses.get('desiredRole')

        # --- DYNAMIC PROMPT LOGIC ---
        if desired_role:
            context_header = f"## 🎯 Targeted Role: {desired_role}"
            task_description = f"The user has chosen to pursue a career as a {desired_role}. Analyze their personality traits and provide a technical roadmap specifically for this goal."
        else:
            context_header = "## 🎯 Recommended Career: [Insert Recommended Role]"
            task_description = "Based on their personality and technical aptitude results, recommend the most suitable IT career path and provide a roadmap."

        prompt = f"""
You are a Senior IT Career Counselor. 

STUDENT DATA:
1. PERSONALITY PROFILE: {pers}
2. TECHNICAL APTITUDE: {tech if tech else "Not tested (User selected a specific interest path)."}

GOAL:
{task_description}

---
STRICT OUTPUT FORMAT (Markdown):

{context_header}

### 👤 Your Professional Profile
[Write 1 single paragraph starting with "Based on your responses...". Explain how their personality traits make them a fit for {'this specific role' if desired_role else 'the recommended role'}.]

### 💻 Technical Assessment
* **Current Standing:** [1 sentence assessment of their level]
<br>
* **Key Focus:** [1 specific technical concept or tool they should master first]

### 🗺️ 2026 Roadmap (3 Steps)
1. **Short Term:** [Immediate skill/language to learn]
2. **Mid Term:** [Specific project type or certification to build/earn]
3. **Long Term:** [Job readiness or specialized mastery goal]

Keep the total response under 200 words. Be concise and professional.
"""

        # Using gemini-2.0-flash to resolve the 404/NOT_FOUND SDK error
        response = client.models.generate_content(
            model="gemini-3-flash-preview", 
            contents=prompt
        )
        
        # Return the AI's response to the frontend
        return jsonify({"result": response.text})
    
    except Exception as e:
        # Print error to terminal for debugging
        print(f"Server Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)