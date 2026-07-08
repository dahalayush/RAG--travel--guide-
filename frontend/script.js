const API = "http://127.0.0.1:8000";
let mediaRecorder;
let audioChunks = [];
function addLog(message){

    const log =
        document.getElementById("journal-list");

    const item =
        document.createElement("li");

    item.innerText = message;

    log.prepend(item);
}
function updateLocationImage(location) {

    const image = document.getElementById("location-image");

    const images = {
        cusco:
        "images/cusco.jpg",
        trailhead:
            "images/trailhead.jpg",

        winay_wayna:
            "images/winay_wayna.jpg",

        machu_picchu:
            "images/machu_picchu.jpg"
    };

    image.src =
        images[location] ||
        "images/trailhead.jpg";
}

function updateJourneyTracker(location) {

    document
        .querySelectorAll(".step")
        .forEach(step =>
            step.classList.remove("active"));

    if (location === "cusco") {

        document
            .getElementById("step-cusco")
            .classList.add("active");
    }

    if (location === "trailhead") {

        document
            .getElementById("step-cusco")
            .classList.add("active");

        document
            .getElementById("step-trailhead")
            .classList.add("active");
    }

    if (location === "winay_wayna") {

        document
            .getElementById("step-cusco")
            .classList.add("active");

        document
            .getElementById("step-trailhead")
            .classList.add("active");

        document
            .getElementById("step-winay_wayna")
            .classList.add("active");
    }

    if (location === "machu_picchu") {

        document
            .getElementById("step-cusco")
            .classList.add("active");

        document
            .getElementById("step-trailhead")
            .classList.add("active");

        document
            .getElementById("step-winay_wayna")
            .classList.add("active");

        document
            .getElementById("step-machu_picchu")
            .classList.add("active");
    }
}

function updateTravelInfo(location) {

    const travelData = {
cusco: {
    temp: "16°C",
    altitude: "3399 m",
    difficulty: "Easy",
    tip: "Take a day to acclimatize to the altitude."
},

        trailhead: {
            temp: "15°C",
            altitude: "2430 m",
            difficulty: "Easy",
            tip: "Carry enough drinking water."
        },

        winay_wayna: {
            temp: "12°C",
            altitude: "2680 m",
            difficulty: "Moderate",
            tip: "Watch your footing on stone steps."
        },

        machu_picchu: {
            temp: "18°C",
            altitude: "2430 m",
            difficulty: "Easy",
            tip: "Arrive early for the best views."
        }
    };

    document.getElementById("temp").innerText =
        travelData[location].temp;

    document.getElementById("altitude").innerText =
        travelData[location].altitude;

    document.getElementById("difficulty").innerText =
        travelData[location].difficulty;

    document.getElementById("tip").innerText =
        travelData[location].tip;
}

async function loadStatus() {

    try {

        console.log("1");

        const response = await fetch(`${API}/status`);

        console.log("2");

        const data = await response.json();

        console.log("3", data);

        document.getElementById("location").innerText =
            "Location: " + data.location;

        console.log("4");

        document.getElementById("permit").innerText =
            "Permit: " + data.permit;

        console.log("5");

        updateLocationImage(data.location);

        console.log("6");

        updateJourneyTracker(data.location);

        console.log("7");

        updateTravelInfo(data.location);

        console.log("8");

        updateProgress(data.location);

        console.log("9");

        updateVisitedLocations(data.visited);

        console.log("10");

        updateActionChips(data.location);

        console.log("11");

    } catch (err) {

        console.error("loadStatus failed:", err);

    }

}
async function getPermit() {

    await fetch(`${API}/permit`, {
        method: "POST"
    });

    addLog("🎫 Permit acquired");

    await loadStatus();
}

async function moveLocation() {

    const beforeResponse =
        await fetch(`${API}/status`);

    const beforeData =
        await beforeResponse.json();

    await fetch(`${API}/move`, {
        method: "POST"
    });

    const afterResponse =
        await fetch(`${API}/status`);

    const afterData =
        await afterResponse.json();

    addLog(
        `🚶 Moved from ${beforeData.location} to ${afterData.location}`
    );

    loadStatus();
}

async function getGuide() {

    const response =
        await fetch(`${API}/guide`, {
            method: "POST"
        });

    const data =
        await response.json();

    document.getElementById("guide-text")
        .innerText =
        data.guide_advice;

    addLog(
        `🤖 Guide advice requested at ${data.current_location}`
    );
}

async function resetJourney() {

    await fetch(`${API}/reset`, {
        method: "POST"
    });

    addLog("🔄 Journey reset");

    loadStatus();
}

async function askQuestion() {

     const questionInput =
        document.getElementById("question");

    const question =
        questionInput.value.trim();

    if (!question) return;
    addLog(`❓ Asked: ${question}`);

    const chatBox =
        document.getElementById("chat-box");

    chatBox.innerHTML += `
        <div class="user-message">
            ${question}
        </div>
    `;
    questionInput.value = "";

    chatBox.innerHTML += `
        <div class="bot-message" id="loading-message">
            🤖 Peru Guide is thinking...
        </div>
    `;
    chatBox.scrollTop =
        chatBox.scrollHeight;
    

     const response =
        await fetch(
            `${API}/ask?question=${encodeURIComponent(question)}`
        );

    const data =
        await response.json();
        const loading =
    document.getElementById("loading-message");

if (loading) {
    loading.remove();
}

    chatBox.innerHTML += `
        <div class="bot-message">
            ${data.answer}
        </div>
    `;

    chatBox.scrollTop =
        chatBox.scrollHeight;
}
const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            const button =
                document.getElementById(
                    "theme-toggle"
                );

            if (button) {
                button.innerText =
                    "☀️ Light Mode";
            }
        }
    );
}
function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const button =
        document.getElementById("theme-toggle");

    if (
        document.body.classList.contains("dark-mode")
    ) {

        button.innerText =
            "☀️ Light Mode";

        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        button.innerText =
            "🌙 Dark Mode";

        localStorage.setItem(
            "theme",
            "light"
        );
    }
}
function updateProgress(location) {

    let progress = 0;

    if (location === "cusco")
        progress = 25;

    if (location === "trailhead")
        progress = 50;

    if (location === "winay_wayna")
        progress = 75;

    if (location === "machu_picchu")
        progress = 100;

    document.getElementById(
        "progress-fill"
    ).style.width =
        progress + "%";

    document.getElementById(
        "progress-text"
    ).innerText =
        progress + "% Complete";
}

function updateVisitedLocations(visited) {

    const list =
        document.getElementById(
            "visited-list"
        );

    list.innerHTML = "";

    visited.forEach(location => {

        const item =
            document.createElement("li");

        item.innerText =
            "✓ " +
            location
                .replace("_", " ")
                .toUpperCase();

        list.appendChild(item);
    });
}
async function startRecording() {

    const stream =
        await navigator.mediaDevices.getUserMedia({
            audio: true
        });

    mediaRecorder =
        new MediaRecorder(stream);

    audioChunks = [];

    mediaRecorder.ondataavailable = event => {

        audioChunks.push(event.data);
    };

    mediaRecorder.start();

    document.getElementById(
        "voice-status"
    ).innerText =
        "🎤 Recording...";
}

async function stopRecording() {

    mediaRecorder.stop();

    mediaRecorder.onstop =
        async () => {

            document.getElementById(
                "voice-status"
            ).innerText =
                "⏳ Processing voice...";

            const audioBlob =
                new Blob(
                    audioChunks,
                    {
                        type: "audio/wav"
                    }
                );

            const formData =
                new FormData();

            formData.append(
                "audio",
                audioBlob,
                "voice.wav"
            );

            const response =
                await fetch(
                    `${API}/voice-guide`,
                    {
                        method: "POST",
                        body: formData
                    }
                );

            const data =
                await response.json();

            document.getElementById(
    "guide-text"
).innerText =
    "You said: " +
    data.transcribed_question +
    "\n\nAnswer:\n" +
    data.answer;

            document.getElementById(
                "voice-status"
            ).innerText =
                "✅ Voice response received";
                if (data.audio_output) {

    const audio = new Audio(
        API + "/" + data.audio_output
    );

    audio.play();

}

            addLog(
                "🎤 Voice question processed"
            );
        };
}
function updateActionChips(location) {

    const chipContainer =
        document.getElementById("action-chips");

    chipContainer.innerHTML = "";

    const chips = {

        cusco: [
            "Tell me about Cusco",
            "History of the Incas",
            "Do I need a permit?",
            "Best places to visit in Cusco"
        ],

        trailhead: [
            "Trail preparation tips",
            "Packing checklist",
            "Trail weather",
            "What should I expect on the trail?"
        ],

        winay_wayna: [
            "Tell me about Wiñay Wayna",
            "Ancient terraces",
            "Photography tips",
            "Hiking safety"
        ],

        machu_picchu: [
            "History of Machu Picchu",
            "Best viewpoint",
            "Interesting facts",
            "When was it built?"
        ]
    };

    if (!chips[location]) return;

    chips[location].forEach(question => {

        const button =
            document.createElement("button");

        button.className = "action-chip";

        button.innerText = question;

        button.onclick = function () {

            document.getElementById("question").value =
                question;

            askQuestion();

        };

        chipContainer.appendChild(button);

    });

}
loadStatus();
