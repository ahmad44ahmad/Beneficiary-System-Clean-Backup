
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY || '');

export const analyzeReport = async (reportData: any) => {
    if (!API_KEY) {
        throw new Error('API Key is missing');
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
        Act as a professional Catering Auditor for the Ministry of Human Resources.
        Analyze the following monthly catering report data:
        ${JSON.stringify(reportData, null, 2)}
        
        Please provide a brief executive summary in Arabic (Markdown format) covering:
        1. **General Consumption Trends** (Trends in meal types).
        2. **Quality & Penalties** (Evaluate contractor performance based on penalties).
        3. **Recommendations** (Cost saving or quality improvement tips).
        
        Keep the tone formal and objective. Use bullet points.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error calling Gemini:', error);
        throw error;
    }
};
