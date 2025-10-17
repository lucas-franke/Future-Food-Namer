const { GoogleGenAI } = require('@google/genai');

// Load the API Key securely from Netlify Environment Variables
const API_KEY = process.env.GEMINI_API_KEY; 
const MODEL_NAME = "gemini-2.5-flash-lite";

// Initialize the AI client
const ai = new GoogleGenAI({apiKey: API_KEY});

// CORS Headers necessary to allow cross-origin requests from the frontend
const HEADERS = {
    'Access-Control-Allow-Origin': '*', // Allows all domains to access the function
    'Access-Control-Allow-Methods': 'POST, OPTIONS', // Must explicitly allow POST and OPTIONS
    'Access-Control-Allow-Headers': 'Content-Type',
};

// Main handler for the Netlify Function
exports.handler = async (event, context) => {

    // 1. Handle OPTIONS request (CORS Preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200, // Success code for preflight checks
            headers: HEADERS,
            body: ''
        };
    }
    
    // 2. Reject all other non-POST requests
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            body: 'Method Not Allowed',
            headers: HEADERS 
        };
    }
    
    // 3. Process the POST request
    try {
        const body = JSON.parse(event.body);
        const userPrompt = body.prompt;

        if (!userPrompt) {
            return { 
                statusCode: 400, 
                headers: HEADERS,
                body: JSON.stringify({ error: "Input prompt missing." }) 
            };
        }

        // Call the Gemini API with the system instruction
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: [{
                role: "user",
                parts: [{ text: userPrompt }]
            }],
            config: {
                systemInstruction: "Du bist ein kreativer Produkt-Umschreiber, der vegane Lebensmittel so umbenennt, dass keine klassischen fleischbezogenen Begriffe (wie Wurst, Salami, Steak, Schinken) verwendet werden. Erfinde stattdessen blumige, phantasievolle Umschreibungen, die den Geschmack, die Textur oder die Form beschreiben, aber immer nur EINEN Satz lang sind. Der Name des Originals darf in der Umschreibung nicht vorkommen. Beispiel: Für 'Seitan Salami' antworte mit 'Gewürzte Weizeneiweiß-Rolle nach pikanter Art'.",
                temperature: 0.8,
                maxOutputTokens: 100
            }
        });

        // Send the generated AI response back to the frontend
        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify({
                renamed_product: response.text
            })
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({ error: 'AI generation failed. Quota exceeded or internal error.' })
        };
    }
};