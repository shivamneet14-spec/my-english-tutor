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

let currentQuestionIndex
