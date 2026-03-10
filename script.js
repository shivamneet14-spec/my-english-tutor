// 1. YOUR API KEY (Paste it below)
const API_KEY = 'AIzaSyDVjLpLCUVb2Q-ESN42ie9mS5-gQ6MfpgM'; 

// --- SIDEBAR & SETTINGS LOGIC ---
const sidebar = document.getElementById('sidebar');
const hamburgerBtn = document.getElementById('hamburger-btn');
const closeBtn = document.getElementById('close-btn');
const settingsModal = document.getElementById('settings-modal');
const openSettingsBtn = document.getElementById('open-settings-btn');
const closeSettingsBtn = document.getElementById('close-settings');
const darkModeToggle = document.getElementById('dark-mode-toggle');

hamburgerBtn.addEventListener('click', () => sidebar.classList.add('open'));
closeBtn.addEventListener('click', () => sidebar.classList.remove('open'));

openSettingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    settingsModal.style.display = 'block';
    sidebar.classList.remove('open'); 
});

closeSettingsBtn.addEventListener('click', () => settingsModal.style.display = 'none');

darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) { document.body.classList.add('dark-mode'); } 
    else { document.body.classList.remove('dark-mode'); }
});

// --- WORD OF THE DAY LOGIC ---
const vocabularyList = [
    { word: "Kinetic", meaning: "Relating to or resulting from motion.", example: "The kinetic energy of the object increased." },
    { word: "Auspicious", meaning: "Conducive to success; favorable.", example: "It was an auspicious beginning." },
    { word: "Diligent", meaning: "Having or showing care in one's work.", example: "The diligent student studied hard." }
];

function displayWordOfTheDay() {
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    const wordIndex = daysSinceEpoch % vocabularyList.length;
    const todaysWord = vocabularyList[wordIndex];

    document.getElementById('daily-word').textContent = todaysWord.word;
    document.getElementById('daily-meaning').textContent = todaysWord.meaning;
    document.getElementById('daily-example').textContent = `"${todaysWord.example}"`;
}
displayWordOfTheDay();

// --- GRAMMAR QUIZ LOGIC ---
const quizQuestions = [
    { question: "After he _____ the code, the program ran flawlessly.", options: ["compiled", "compiles", "compiling"], answer: "compiled" },
    { question: "The engineer explained how the system _____.", options: ["works", "work", "working"], answer: "works" }
];

let currentQuestionIndex = 0;
const questionEl = document.getElementById('quiz-question');
const optionsEl = document.getElementById('quiz-options');
const feedbackEl = document.getElementById('quiz-feedback');
const nextBtn = document.getElementById('next-quiz-btn');

function loadQuiz() {
    feedbackEl.textContent = "";
    nextBtn.style.display = "none";
    optionsEl.innerHTML = "";
    const currentQ = quizQuestions[currentQuestionIndex];
    questionEl.textContent = currentQ.question;

    currentQ.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.className = 'quiz-btn';
        btn.onclick = () => checkAnswer(option, currentQ.answer, btn);
        optionsEl.appendChild(btn);
    });
}

function checkAnswer(selectedOption, correctOption, buttonElement) {
    const allBtns = optionsEl.querySelectorAll('.quiz-btn');
    allBtns.forEach(btn => btn.disabled = true);
    if (selectedOption === correctOption) {
        buttonElement.classList.add('correct');
        feedbackEl.textContent = "Correct!";
        feedbackEl.style.color = "#28a745";
    } else {
        buttonElement.classList.add('wrong');
        feedbackEl.textContent = `Incorrect. Answer is "${correctOption}".`;
        feedbackEl.style.color = "#dc3545";
    }
    nextBtn.style.display = "block";
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex >= quizQuestions.length) currentQuestionIndex = 0; 
    loadQuiz();
});
loadQuiz();

// --- TEXT-TO-SPEECH LOGIC ---
function speakText(text) {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 0.9; 
    window.speechSynthesis.speak(speech);
}

// --- AI CHATBOX LOGIC ---
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function fetchAIResponse(userText) {
    const aiMessage = document.createElement('p');
    aiMessage.textContent = "Tutor is typing...";
    chatWindow.appendChild(aiMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    const prompt = `You are an English tutor. The user said: "${userText}". Correct any grammar mistakes. Reply in simple English. End with a short question.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        const aiReply = data.candidates[0].content.parts[0].text;
        
        aiMessage.innerHTML = "<strong>Tutor:</strong> " + aiReply;
        speakText(aiReply);
    } catch (error) {
        aiMessage.textContent = "Tutor: Error. Check internet or API key.";
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return; 
    const userMessage = document.createElement('p');
    userMessage.textContent = "You: " + text;
    userMessage.style.color = "#0056b3";
    chatWindow.appendChild(userMessage);
    userInput.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;
    fetchAIResponse(text);
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

// --- SPEECH-TO-TEXT LOGIC (ANDROID FIX) ---
const micBtn = document.getElementById('mic-btn');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let voiceAwake = false;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false; 
    recognition.lang = 'en-US'; 

    micBtn.addEventListener('click', () => {
        if (!voiceAwake) {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
            voiceAwake = true;
        }
        recognition.start();
        micBtn.textContent = "🔴"; 
    });

    recognition.onresult = (event) => {
        document.getElementById('user-input').value = event.results[0][0].transcript;
        setTimeout(() => { sendMessage(); }, 500);
    };

    recognition.onspeechend = () => { recognition.stop(); micBtn.textContent = "🎤"; };
    recognition.onerror = () => { micBtn.textContent = "🎤"; };
} else {
    micBtn.style.display = "none";
}
