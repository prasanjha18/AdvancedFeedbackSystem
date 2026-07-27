import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
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
    
    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(response_mime_type="application/json")
        )
        
        raw_text = response.text.strip()
        
        # Strip Markdown code blocks if the AI accidentally included them
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3].strip()
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3].strip()
            
        return json.loads(raw_text)
        
    except Exception as e:
        print(f"LLM Parsing Error: {e}")
        # Safe fallback so your backend doesn't crash with a 500 error
        return {
            "sentiment": "Neutral",
            "keyItems": ["Failed to analyze review automatically"],
            "requiresAction": True 
        }