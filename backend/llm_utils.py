import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# Using gemini-1.5-flash which is fast and supports JSON output
model = genai.GenerativeModel('gemini-3.5-flash')

def analyze_feedback(text: str):
    prompt = f"""
    Analyze the following restaurant review. Extract the sentiment (Positive, Neutral, Negative), 
    a list of key items mentioned, and if urgent action is required (true if food poisoning, 
    severe rudeness, or physical hazards are mentioned, else false).
    
    Review: "{text}"
    
    Respond ONLY with a valid JSON object using this exact schema:
    {{
      "sentiment": "Positive",
      "keyItems": ["Pizza", "Service"],
      "requiresAction": false
    }}
    """
    
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(response_mime_type="application/json")
    )
    return json.loads(response.text)