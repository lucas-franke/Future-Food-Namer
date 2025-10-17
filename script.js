const API_URL = "/.netlify/functions/rename"; 

const loadingMessages = [
    '✨ Verbrauchertäuschungssichere Umschreibung wird gesucht...',
    '🍻 Markus Söder mit veganem Weißbier ablenken...',
    '🔬 Der Wortfindungs-Algorithmus läuft heiß...',
    '🌿 Konsultiere die pflanzenbasierte Synonym-Datenbank...',
    '⏳ Warte auf die Genehmigung aus Brüssel...'
];

async function sendPrompt() {
    const promptInput = document.getElementById('promptInput');
    const outputDiv = document.getElementById('output');
    const userPrompt = promptInput.value.trim();

    if (!userPrompt) {
        alert("Please enter a vegan product name.");
        return;
    }

    outputDiv.classList.remove('has-content'); 
    
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    const randomMessage = loadingMessages[randomIndex];
    
    outputDiv.innerHTML = `
        <div class="loading-container">
            <span class="loader-spinner"></span> 
            <span class="loading">${randomMessage}</span>
        </div>
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: userPrompt })
        });
        
        outputDiv.classList.add('has-content'); 

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