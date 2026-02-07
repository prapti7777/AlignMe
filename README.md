AlignMe

This is a web app designed to help students choose the right career path in IT. It doesn't just look at what you know (technical skills), but also who you are (personality). 

It works in two phases:
1. Personality Quiz: 20 questions based on the "Mini-IPIP" scale to understand your traits.
2. Technical Quiz: 10 questions to see which tech domains (Cloud, AI, Design, etc.) you are good in.

Finally, it sends everything to Google’s Gemini AI to generate a custom career recommendation and a 3-step learning roadmap for 2026.

How to set it up
1. Backend:
   - Go to the `backend` folder.
   - Install Flask and the Gemini library: `pip install flask flask-cors google-genai python-dotenv`
   - Create a `.env` file and paste your API key: `GEMINI_API_KEY=your_key_here`
   - Run the server: `python app.py`

2. Frontend:
   - Open `index.html` using Live Server.

