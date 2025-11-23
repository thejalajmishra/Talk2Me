import librosa
import numpy as np
 
def analyze_audio_features(file_path: str):
    """
    Analyzes audio file for duration, tempo, and pitch.
    Returns a dictionary of metrics.
    """
    try:
        y, sr = librosa.load(file_path, sr=None)
        duration = librosa.get_duration(y=y, sr=sr)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        
        # Pitch analysis (Spectral Centroid as a proxy for brightness/pitch)
        spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        avg_pitch = float(np.mean(spectral_centroids))
        
        # Volume analysis (RMS)
        rms = librosa.feature.rms(y=y)[0]
        avg_volume = float(np.mean(rms))
        
        return {
            "duration": duration,
            "tempo": float(tempo),
            "avg_pitch": avg_pitch,
            "avg_volume": avg_volume,
            "success": True
        }
    except Exception as e:
        print(f"Audio analysis error: {e}")
        return {
            "duration": 0.0,
            "tempo": 0.0,
            "avg_pitch": 0.0,
            "avg_volume": 0.0,
            "success": False,
            "error": str(e)

        }
