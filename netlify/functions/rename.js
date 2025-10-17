const { GoogleGenAI } = require('@google/genai');

const API_KEY = process.env.GEMINI_API_KEY; 
const MODEL_NAME = "gemini-2.5-flash-lite";

const ai = new GoogleGenAI({apiKey: API_KEY});

const HEADERS = {
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'POST, OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event, context) => {

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200, 
            headers: HEADERS,
            body: ''
        };
    }
    
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            body: 'Method Not Allowed',
            headers: HEADERS 
        };
    }
    
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

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: [{
                role: "user",
                parts: [{ text: userPrompt }]
            }],
            config: {
                systemInstruction: "You are a creative product relabeler who generates alternative names for vegan products. Your task is to apply the following rules to the user's input: 1. **Adopt the language of the user's input for your answer.** (e.g., if the user writes in French, answer in French). 2. Never use classic meat-related terms (sausage, steak, ham) in the relabeling. 3. The relabeling must be a single, descriptive sentence focusing on taste, texture, or shape. 4. The original name must not appear in the relabeling. Example (German input): For 'Seitan Salami' answer with 'Gewürzte Weizeneiweiß-Rolle nach pikanter Art'. Example (English input): For 'Soy Burger' answer with 'Savory ground vegetable patty, pan-ready for cooking'.",
                temperature: 0.8,
                maxOutputTokens: 100
            }
        });

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