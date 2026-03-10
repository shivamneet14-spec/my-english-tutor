// 1. Your Secret API Key (Paste it between the quotes below)
const API_KEY = 'YOUR_API_KEY_HERE'; 

// --- WORD OF THE DAY LOGIC ---

// 1. Create a dictionary of words
const vocabularyList = [
    {
        word: "Kinetic",
        meaning: "Relating to or resulting from motion.",
        example: "The kinetic energy of the object increased as it rolled down the hill."
    },
    {
        word: "Auspicious",
        meaning: "Conducive to success; favorable.",
        example: "Starting the new project on a sunny Monday felt like an auspicious beginning."
    },
    {
        word: "Diligent",
        meaning: "Having or showing care and conscientiousness in one's work or duties.",
        example: "The diligent student studied for hours every night to prepare for the difficult exams."
    },
    {
        word: "Omnipresent",
        meaning: "Widely or constantly encountered; common or widespread.",
        example: "Smartphones have become an omnipresent part of daily life."
    },
    {
        word: "Pragmatic",
        meaning: "Dealing with things sensibly and realistically.",
        example: "We need a pragmatic approach to solve this coding problem within our budget."
    }
];

// 2. Function to calculate and display today's word
function displayWordOfTheDay() {
    // Get the exact number of days since Jan 1, 1970
    const today = new Date();
    const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
    
    // Use the modulo operator to pick a word index that loops endlessly
    const wordIndex = daysSinceEpoch % vocabularyList.length;
    const todaysWord = vocabularyList[wordIndex];

    // Update the HTML with the selected word
    document.getElementById('daily-word').textContent = todaysWord.word;
    document.getElementById('daily-meaning').textContent = todaysWord.meaning;
    document.getElementById('daily-example').textContent = `"${todaysWord.example}"`;
}

// 3. Run the function immediately when the app loads
displayWordOfTheDay();

// --- END WORD OF THE DAY LOGIC ---

// 2. Grab the HTML elements
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 3. Function to talk to the AI Brain (UPDATED WITH VOICE)
async function fetchAIResponse(userText) {
    // Show a temporary "Typing..." message
    const aiMessage = document.createElement('p');
    aiMessage.textContent = "Tutor is typing...";
    aiMessage.style.color = "#333";
    chatWindow.appendChild(aiMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // The instructions for how the AI should act
    const prompt = `You are a friendly, helpful English tutor. The user just said: "${userText}". 
    First, gently correct any grammar mistakes they made. 
    Then, reply to them in simple, easy-to-understand English. 
    Finally, end with a simple question to keep the conversation going. Keep it short.`;

    try {
        // Send the request to the Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        // Read the AI's reply
        const data = await response.json();
        const aiReply = data.candidates[0].content.parts[0].text;
        
        // Update the screen with the real reply
        aiMessage.innerHTML = "<strong>Tutor:</strong> " + aiReply;

        // Tell the browser to speak the reply out loud!
        if (typeof speakText === 'function') {
            speakText(aiReply);
        }

    } catch (error) {
        aiMessage.textContent = "Tutor: Oops! Make sure you are connected to the internet and your API key is correct.";
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 4. Function to handle the user sending a message
function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return; 

    // Show the user's message
    const userMessage = document.createElement('p');
    userMessage.textContent = "You: " + text;
    userMessage.style.color = "#0056b3";
    chatWindow.appendChild(userMessage);

    // Clear the input box
    userInput.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Call the AI Brain!
    fetchAIResponse(text);
}

// 5. Triggers for the Send button and Enter key
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// --- GRAMMAR QUIZ LOGIC ---

// 1. Create a list of quiz questions
const quizQuestions = [
    {
        question: "After he _____ the code, the program ran flawlessly.",
        options: ["compiled", "compiles", "compiling", "has compiled"],
        answer: "compiled"
    },
    {
        question: "The engineer explained how the new electrical system _____.",
        options: ["works", "work", "working", "worked"],
        answer: "works"
    },
    {
        question: "She _____ studying for the competitive exam since morning.",
        options: ["has been", "is", "was", "will be"],
        answer: "has been"
    }
];

let currentQuestionIndex = 0;
const questionEl = document.getElementById('quiz-question');
const optionsEl = document.getElementById('quiz-options');
const feedbackEl = document.getElementById('quiz-feedback');
const nextBtn = document.getElementById('next-quiz-btn');

// 2. Function to load the current question onto the screen
function loadQuiz() {
    // Clear old data
    feedbackEl.textContent = "";
    nextBtn.style.display = "none";
    optionsEl.innerHTML = "";

    const currentQ = quizQuestions[currentQuestionIndex];
    questionEl.textContent = currentQ.question;

    // Create a button for each option
    currentQ.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.className = 'quiz-btn';
        
        // When a button is clicked, check the answer
        btn.onclick = () => checkAnswer(option, currentQ.answer, btn);
        optionsEl.appendChild(btn);
    });
}

// 3. Function to check if you are right or wrong
function checkAnswer(selectedOption, correctOption, buttonElement) {
    // Disable all buttons so you can't click twice
    const allBtns = optionsEl.querySelectorAll('.quiz-btn');
    allBtns.forEach(btn => btn.disabled = true);

    if (selectedOption === correctOption) {
        buttonElement.classList.add('correct');
        feedbackEl.textContent = "Correct! Great job.";
        feedbackEl.style.color = "#28a745"; // Green
    } else {
        buttonElement.classList.add('wrong');
        feedbackEl.textContent = `Incorrect. The correct answer is "${correctOption}".`;
        feedbackEl.style.color = "#dc3545"; // Red
    }
    
    // Show the "Next Question" button
    nextBtn.style.display = "block";
}

// 4. Move to the next question when the button is clicked
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    
    // If we run out of questions, start over from the beginning
    if (currentQuestionIndex >= quizQuestions.length) {
        currentQuestionIndex = 0; 
    }
    loadQuiz();
});

// 5. Start the quiz immediately when the app loads
loadQuiz();

// --- SPEECH-TO-TEXT LOGIC ---

// 1. Grab the microphone button from HTML
const micBtn = document.getElementById('mic-btn');

// 2. Check if the browser supports Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stop listening when you pause
    recognition.lang = 'en-US'; // Set to English

    // 3. When you click the mic button, start listening
    micBtn.addEventListener('click', () => {
        recognition.start();
        micBtn.textContent = "🔴"; // Change icon to a red dot to show it's recording
    });

    // 4. When it hears you and converts it to text
    recognition.onresult = (event) => {
        // Grab the text from the speech recognition result
        const transcript = event.results[0][0].transcript;
        
        // Put the spoken text into the input box
        document.getElementById('user-input').value = transcript;
        
        // Automatically send the message to the AI!
        sendMessage(); 
    };

    // 5. When you stop speaking, reset the button icon
    recognition.onspeechend = () => {
        recognition.stop();
        micBtn.textContent = "🎤";
    };
    
    // 6. Handle errors (like if you deny microphone permission)
    recognition.onerror = (event) => {
        micBtn.textContent = "🎤";
        alert("Microphone error: " + event.error + ". Make sure you gave permission to use the mic!");
    };
} else {
    // If the browser (like an older one) doesn't support this, hide the mic button
    micBtn.style.display = "none";
    console.log("Speech recognition not supported in this browser.");
}

// --- TEXT-TO-SPEECH LOGIC ---

// 1. Function to make the AI speak
function speakText(text) {
    // Stop any current speech so voices don't overlap
    window.speechSynthesis.cancel();
    
    // Create a new speech package
    const speech = new SpeechSynthesisUtterance(text);
    
    // Set the language and make it slightly slower for learning
    speech.lang = 'en-US';
    speech.rate = 0.9; // 1.0 is normal speed, 0.9 is a bit slower
    speech.pitch = 1.0;

    // Speak it out loud!
    window.speechSynthesis.speak(speech);
}
