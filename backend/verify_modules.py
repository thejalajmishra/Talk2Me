import sys
import os

# Add backend to path
sys.path.append(os.path.abspath("/home/himadri/Talk2Me/backend"))

try:
    from ai_engine.audio import analyze_audio_features
    print("✅ ai_engine.audio imported")
except ImportError as e:
    print(f"❌ ai_engine.audio failed: {e}")

try:
    from ai_engine.transcribe import transcribe_audio
    print("✅ ai_engine.transcribe imported")
except ImportError as e:
    print(f"❌ ai_engine.transcribe failed: {e}")

try:
    from ai_engine.coach import generate_feedback
    print("✅ ai_engine.coach imported")
except ImportError as e:
    print(f"❌ ai_engine.coach failed: {e}")

try:
    from ai_engine.pipeline import process_attempt
    print("✅ ai_engine.pipeline imported")
except ImportError as e:
    print(f"❌ ai_engine.pipeline failed: {e}")

print("Modular structure verification complete.")
