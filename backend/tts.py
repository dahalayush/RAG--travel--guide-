import os
import pyttsx3

engine = pyttsx3.init()

engine.setProperty("rate", 165)

engine.setProperty("volume", 1.0)


def text_to_speech(text):

    os.makedirs("audio", exist_ok=True)

    output_file = "audio/output.wav"

    engine.save_to_file(text, output_file)

    engine.runAndWait()

    return "audio/output.wav"