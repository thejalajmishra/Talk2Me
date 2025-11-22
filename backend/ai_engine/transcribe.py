from openai import OpenAI
import os

def transcribe_audio(client: OpenAI, file_path: str):
    """
    Transcribes audio using OpenAI Whisper.
    """
    if not client:
        return "Transcription unavailable (No API Key)"
        
    try:
        with open(file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1", 
                file=audio_file
            )
        return transcription.text
    except Exception as e:
        print(f"Transcription error: {e}")
        return f"Error during transcription: {str(e)}"
