from backend.stt import speech_to_text
from backend.tts import text_to_speech


def voice_pipeline(audio_file):

    text = speech_to_text(audio_file)

    audio_output = text_to_speech(text)

    return {
        "text": text,
        "audio": audio_output
    }