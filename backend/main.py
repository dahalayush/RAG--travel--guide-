from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import chromadb

from backend.state_machine import state
from backend.locations import LOCATIONS
from backend.llm import ask_llm, guide_advice
from backend.stt import speech_to_text
from backend.tts import text_to_speech

from backend.tools import (
    change_location,
    check_trail_permit,
    look_up_artifact
)

# ==========================
# FASTAPI APP
# ==========================

app = FastAPI()
app.mount("/audio", StaticFiles(directory="audio"), name="audio")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================
# CHROMA DB
# ==========================

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_collection("peru_guide")

# ==========================
# ROOT
# ==========================

@app.get("/")
def root():
    return {
        "message": "Traveller Guide Peru API Running"
    }

# ==========================
# STATUS
# ==========================

@app.get("/status")
def status():
    return state

# ==========================
# PERMIT
# ==========================

@app.post("/permit")
def permit():

    state["permit"] = True

    return {
        "message": "Permit granted"
    }

# ==========================
# MOVE
# ==========================

@app.post("/move")
def move():

    if not state["permit"]:
        return {
            "message": "You need a permit before starting the trek."
        }

    current = state["location"]

    next_location = LOCATIONS[current]["next"]

    if next_location is None:
        return {
            "message": "Journey completed",
            "visited": state["visited"]
        }

    state["location"] = next_location

    if next_location not in state["visited"]:
        state["visited"].append(next_location)

    return {
        "current_location": next_location,
        "visited": state["visited"]
    }

# ==========================
# ASK QUESTION (RAG)
# ==========================

@app.get("/ask")
def ask(question: str):

    results = collection.query(
        query_texts=[question],
        n_results=3,
        where={
            "location": state["location"]
        }
    )

    documents = results["documents"][0]

    context = "\n\n".join(documents)

    answer = ask_llm(
        question=question,
        context=context,
        location=state["location"],
        permit=state["permit"]
    )

    return {
        "question": question,
        "location": state["location"],
        "permit": state["permit"],
        "answer": answer
    }

# ==========================
# GUIDE
# ==========================

@app.post("/guide")
def guide():

    current = state["location"]

    location_data = LOCATIONS[current]

    advice = guide_advice(
        location_name=location_data["name"],
        description=location_data["description"],
        permit=state["permit"]
    )

    return {
        "current_location": current,
        "location_name": location_data["name"],
        "description": location_data["description"],
        "next_location": location_data["next"],
        "permit": state["permit"],
        "guide_advice": advice
    }

# ==========================
# ASSIGNMENT TOOLS
# ==========================

@app.get("/tool/change-location")
def tool_change_location():
    return change_location()

@app.get("/tool/check-permit")
def tool_check_permit():
    return check_trail_permit()

@app.get("/tool/artifact")
def tool_artifact(name: str):
    return look_up_artifact(name)

# ==========================
# RESET
# ==========================

@app.post("/reset")
def reset():

    state["location"] = "cusco"
    state["permit"] = False
    state["visited"] = ["cusco"]

    return {
        "message": "Journey reset"
    }

# ==========================
# VOICE GUIDE
# STT -> RAG -> LLM -> TTS
# ==========================

@app.post("/voice-guide")
async def voice_guide(audio: UploadFile = File(...)):

    audio_path = f"audio/{audio.filename}"

    with open(audio_path, "wb") as buffer:
        buffer.write(await audio.read())

    question = speech_to_text(audio_path)

    results = collection.query(
        query_texts=[question],
        n_results=3,
        where={
            "location": state["location"]
        }
    )

    documents = results["documents"][0]

    context = "\n\n".join(documents)

    answer = ask_llm(
        question=question,
        context=context,
        location=state["location"],
        permit=state["permit"]
    )

    speech_file = text_to_speech(answer)

    return {
        "current_location": state["location"],
        "transcribed_question": question,
        "answer": answer,
        "audio_output": speech_file
    }