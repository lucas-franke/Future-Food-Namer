const { GoogleGenAI } = require('@google/genai');

// Load API Key from environment variables
const API_KEY = process.env.GEMINI_API_KEY; 
const MODEL_NAME = "gemini-2.5-flash-lite";

const ai = new GoogleGenAI({apiKey: API_KEY});

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    try {
        const body = JSON.parse(event.body);
        const userPrompt = body.prompt;

        if (!userPrompt) {
            return { statusCode: 400, body: JSON.stringify({ error: "Eingabe fehlt." }) };
        }

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: [{
                role: "user",
                parts: [{ text: userPrompt }]
            }],
            config: {
                systemInstruction: "Du bist ein kreativer Produkt-Umschreiber, der vegane Lebensmittel so umbenennt, dass keine klassischen fleischbezogenen Begriffe (wie Wurst, Salami, Steak, Schinken) verwendet werden. Erfinde stattdessen blumige, phantasievolle Umschreibungen, die den Geschmack, die Textur oder die Form beschreiben, aber immer nur EINEN Satz lang sind.",
                temperature: 0.8,
                maxOutputTokens: 100
            }
        });
        return {
            statusCode: 200,
            body: JSON.stringify({
                renamed_product: response.text
            })
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Fehler bei der KI-Generierung. Kontingent aufgebraucht?' })
        };
    }
};