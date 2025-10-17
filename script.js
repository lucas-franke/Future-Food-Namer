const API_URL = "/.netlify/functions/rename"; 

const loadingMessages = [
    '✨ Searching for consumer-deception-proof relabeling...',
    '🍻 Distracting Markus Söder with vegan Weißbier...',
    '🔬 The word-finding algorithm is overheating...',
    '🌿 Consulting the plant-based synonym database...',
    '⏳ Waiting for approval from Brussels...'
];

/**
 * Sends the user's prompt to the Netlify Function (Backend).
 */
async function sendPrompt() {
    const promptInput = document.getElementById('promptInput');
    const outputDiv = document.getElementById('output');
    const userPrompt = promptInput.value.trim();

    if (!userPrompt) {
        alert("Please enter a vegan product name.");
        return;
    }

    // Loading Random Message
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    const randomMessage = loadingMessages[randomIndex];
    outputDiv.innerHTML = `<span class="loading">${randomMessage}</span>`;


    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: userPrompt })
        });
        const data = await response.json();
        if (response.ok) {
            outputDiv.textContent = data.renamed_product;
        } else {
            outputDiv.textContent = `Error: ${data.error || 'Unknown function error.'}`;
            console.error('API Error Response:', data);
        }

    } catch (error) {
        outputDiv.textContent = 'There was a problem sending the request. Check the console for details.';
        console.error('Fetch Error:', error);
    }
}