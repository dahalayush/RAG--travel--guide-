# 🏔️ Traveller Guide - Peru

An AI-powered travel assistant for exploring Peru and the legendary Inca Trail.

This project combines **Retrieval-Augmented Generation (RAG)**, **Large Language Models (LLMs)**, **Speech-to-Text (STT)**, **Text-to-Speech (TTS)**, and an interactive frontend to create a smart virtual travel guide.

---

## 🚀 Features

- 📍 Interactive Peru travel guide
- 🗺️ Journey tracker from Cusco to Machu Picchu
- 🤖 AI-powered travel assistant using Groq LLM
- 📚 Retrieval-Augmented Generation (RAG) with ChromaDB
- 🎤 Speech-to-Text using Faster Whisper
- 🔊 Text-to-Speech responses
- 🎫 Trail permit management
- 📖 Adventure journal
- 🌙 Light/Dark mode
- 🐳 Dockerized frontend and backend

---

## 🛠️ Tech Stack

### Backend
- Python
- FastAPI
- LangChain
- ChromaDB
- Groq API
- Faster Whisper
- pyttsx3

### Frontend
- HTML
- CSS
- JavaScript

### DevOps
- Docker
- Docker Compose

---

## 📂 Project Structure

```text
Traveller Guide-peru/
│
├── backend/
├── frontend/
├── data/
├── audio/
├── chroma_db/
├── tests/
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone <your-repository-url>
cd Traveller-Guide-peru
```

### Create a virtual environment

```bash
python -m venv venv
```

### Activate

Windows

```bash
venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_api_key_here
```

---

## 🐳 Docker

Build the project:

```bash
docker compose build
```

Run the containers:

```bash
docker compose up
```

Backend:

```
http://localhost:8000
```

Frontend:

```
http://localhost:5500
```

---

## 📸 Screenshots

Add screenshots here after uploading them.

Example:

- Home Page
- Journey Tracker
- Chat Assistant
- Voice Assistant

---

## 🔮 Future Improvements

- User authentication
- Multi-language support
- Live weather API
- Google Maps integration
- Mobile responsive UI
- Cloud deployment (AWS/Azure)

---

## 👨‍💻 Author

**Aayush Dahal**

Electronics and Communication Engineer

AI Enthusiast

Nepal 🇳🇵