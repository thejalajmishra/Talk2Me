from openai import OpenAI
import json

def generate_feedback(client: OpenAI, transcript: str, duration: float, wpm: float, filler_count: int, topic_description: str = ""):
    """
    Generates feedback using OpenAI GPT with topic relevance scoring.
    """
    if not client:
        return {
            "score": 0,
            "filler_count": filler_count,
            "tone": "Unknown",
            "improvement_plan": ["Configure OpenAI API Key to get feedback."],
            "metrics": {"clarity": 0, "confidence": 0},
            "content_match_score": 0
        }

    system_prompt = """
    You are an expert communication coach. Analyze the user's speech transcript.
    
    CRITICAL: The score must be heavily weighted on whether the spoken content matches the expected topic.
    
    Return a JSON object with:
    - content_match_score: integer 0-100 representing how well the spoken content matches the topic description (0 = completely unrelated, 100 = perfect match)
    - filler_count: number of filler words (um, uh, like, you know). Use the provided count if accurate.
    - score: integer 0-100 calculated as: (content_match_score * 0.7) + (delivery_quality * 0.3)
      * If content is completely off-topic or in wrong language, score MUST be 0-10
      * If content partially matches topic, score should be 20-50
      * Only give 60+ if content clearly addresses the topic
    - tone: string (e.g., Confident, Nervous, Monotone, Enthusiastic)
    - improvement_plan: list of 2-3 specific, actionable tips (mention if content is off-topic)
    - metrics: object with 'clarity' (0-100) and 'confidence' (0-100)
    """
    
    user_prompt = f"""
    Expected Topic: "{topic_description}"
    
    Actual Transcript: "{transcript}"
    Duration: {duration:.2f} seconds
    WPM: {wpm:.1f}
    Detected Filler Words: {filler_count}
    
    Analyze if the transcript content matches the expected topic. If the user spoke in a different language or about a completely different subject, the content_match_score and overall score must be very low (0-10).
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
