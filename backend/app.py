import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv

# Initialize Flask and load environment variables
app = Flask(__name__)
CORS(app) # This allows your HTML file to talk to this Python script
load_dotenv()

# Setup Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@app.route('/analyze', methods=['POST'])
def analyze_career():
    try:
        data = request.json
        # Extract the structured data
        pers = data.get('responses', {}).get('personality', [])
        tech = data.get('responses', {}).get('technical', [])

        prompt = f"""
You are a Senior IT Career Counselor. Analyze this student:

1. PERSONALITY (Mini-IPIP): {pers}
2. TECHNICAL SKILLS: {tech}

---
STRICT OUTPUT FORMAT:
Please respond using this exact Markdown structure:

## 🎯 Recommended Career: [Insert Role Name]

### 👤 Your Professional Profile
[Write 1 single paragraph here starting with "According to the analysis from the questionnaire, you are mostly..." Summarize their personality naturally. Don't list scores; instead, describe how their traits make them behave in a work environment.]

### 💻 Technical Assessment
* **Current Standing:** [1 sentence on their tech level]
* **Key Improvement:** [1 specific technical concept to learn]

### 🗺️ 2026 Roadmap (3 Steps)
1. **Short Term:** [Skill/Tool]
2. **Mid Term:** [Project/Cert]
3. **Long Term:** [Job Readiness]

Keep the total response under 200 words.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt
        )
        return jsonify({"result": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)