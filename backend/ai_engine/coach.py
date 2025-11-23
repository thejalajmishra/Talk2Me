from openai import OpenAI
import json

def generate_feedback(client: OpenAI, transcript: str, duration: float, wpm: float, filler_count: int):
    """
    Generates feedback using OpenAI GPT.
    """
    if not client:
        return {
            "score": 0,
            "filler_count": filler_count,
            "tone": "Unknown",
            "improvement_plan": ["Configure OpenAI API Key to get feedback."],
            "metrics": {"clarity": 0, "confidence": 0}
        }

    system_prompt = """
    You are an expert communication coach. Analyze the user's speech transcript.
    Return a JSON object with:
    - filler_count: number of filler words (um, uh, like, you know). Use the provided count if accurate.
    - score: integer 0-100 based on clarity, structure, and content
    - tone: string (e.g., Confident, Nervous, Monotone, Enthusiastic)
    - improvement_plan: list of 2-3 specific, actionable tips
    - metrics: object with 'clarity' (0-100) and 'confidence' (0-100)
    """
    
    user_prompt = f"""
    Transcript: "{transcript}"
    Duration: {duration:.2f} seconds
    WPM: {wpm:.1f}
    Detected Filler Words: {filler_count}
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Feedback generation error: {e}")
        return {
            "score": 0,
            "filler_count": 0,
            "tone": "Error",
            "improvement_plan": ["Error generating feedback."],
            "metrics": {"clarity": 0, "confidence": 0}
        }
