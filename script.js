
const API_URL = "/.netlify/functions/rename"; 
async function sendPrompt() {
const promptInput = document.getElementById('promptInput');
const outtputDiv = document.getElementById('output');
const userPrompt = promptInput.value.trim();
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
        alert("Bitte gib einen veganen Produktnamen ein.");
        return;
    }
    // Show funny messages while loading
    let messageIndex = 0;
    let loadingInterval = setInterval(() => {
        outputDiv.innerHTML = `<span class="loading">${loadingMessages[messageIndex]}</span>`;
        messageIndex = (messageIndex + 1) % loadingMessages.length;
    }, 800);


    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: userPrompt })
        });
        
        //Stop the loading messages when response is received
        clearInterval(loadingInterval);

        const data = await response.json();

        if (response.ok) {
            outputDiv.textContent = data.renamed_product;
        } else {
            // Show error message from the API and stop loading
            outputDiv.textContent = `Fehler: ${data.error || 'Unbekannter Fehler bei der Function.'}`;
            console.error('API Error Response:', data);
        }

    } catch (error) {
        clearInterval(loadingInterval);
        outputDiv.textContent = 'Es gab ein Problem beim Senden der Anfrage. Prüfe die Konsole für Details.';
        console.error('Fetch Error:', error);
    }
}}
