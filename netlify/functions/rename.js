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
                systemInstruction: "You are a creative product relabeler who renames vegan foods so that no classic meat-related terms (like sausage, salami, steak, ham) are used. Instead, invent flowery, imaginative descriptions that describe the taste, texture, or shape, but are always only ONE sentence long. The name of the original product must not appear in the description. Example: For 'Seitan Salami' answer with 'Spiced wheat protein roll prepared in a savory style'.",
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