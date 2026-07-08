from faster_whisper import WhisperModel

model = WhisperModel("base")

def speech_to_text(audio_file):

    segments, info = model.transcribe(audio_file)

    text = ""

    for segment in segments:
        text += segment.text

    return text