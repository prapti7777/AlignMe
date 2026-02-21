import os
import sqlite3 # New import
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash # New import

# Initialize Flask and load environment variables
app = Flask(__name__)
CORS(app) 
load_dotenv()

# Setup Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# --- DATABASE HELPER ---
# Adjust the path if users.db is inside the backend folder
DB_PATH = os.path.join(os.path.dirname(__file__), 'users.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# --- NEW AUTH ROUTES ---

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        hashed_password = generate_password_hash(password)

        conn = get_db_connection()
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)',
                     (username, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({"message": "Registration successful! You can now login."}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        conn.close()

        if user and check_password_hash(user['password'], password):
            # In a full app, you'd set a session here. 
            # For now, we return success so the frontend can proceed.
            return jsonify({"message": "Login successful!", "user": username}), 200
        
        return jsonify({"error": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- EXISTING ANALYZE ROUTE (DO NOT TOUCH) ---
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
            context_header = f"##  Targeted Role: {desired_role}"
            task_description = f"The user has chosen to pursue a career as a {desired_role}. Analyze their personality traits and provide a technical roadmap specifically for this goal."
        else:
            context_header = "##  Recommended Career: [Insert Recommended Role]"
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

Your Professional Profile 

[Write 1 single paragraph starting with "Based on your responses...". Explain how their personality traits make them a fit for {'this specific role' if desired_role else 'the recommended role'}.]

</Br>
Technical Assessment 

**Current Standing:** [1 sentence assessment of their level]

**Key Focus:** [1 specific technical concept or tool they should master first]

2026 Roadmap (3 Steps) 
**Short Term:** [Immediate skill/language to learn]
**Mid Term:** [Specific project type or certification to build/earn]
**Long Term:** [Job readiness or specialized mastery goal]

Keep the total response under 200 words. Be concise and professional.
"""

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