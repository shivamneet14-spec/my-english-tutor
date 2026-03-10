// 1. Your Secret API Key (Paste it between the quotes below)
const API_KEY = 'AIzaSyBLyCE6a7ZryKR7pw8XWnvtpB3QjEZ1f8s'; 

// 2. Grab the HTML elements
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 3. Function to talk to the AI Brain
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