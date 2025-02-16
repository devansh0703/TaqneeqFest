import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('Missing Gemini API key. Please ensure VITE_GEMINI_API_KEY is set in your .env file.');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Format the prompt to handle special formatting
function formatPrompt(prompt: string) {
  return `Please format your response according to these rules:
- Use "**text**" for bold text, which should appear on a new line
- When you see a bullet point, start the content on a new line
- Organize information clearly with proper spacing
- Be detailed and thorough in your response
- Provide at least 5-7 detailed points for each response
- Include specific examples and actionable steps

Here's the question: ${prompt}

Remember to:
1. Start with a bold headline summarizing the key point
2. Follow with detailed explanations
3. Include practical, actionable steps
4. End with a conclusion or next steps`;
}

export async function getGeminiResponse(prompt: string) {
  if (!apiKey) {
    throw new Error('API key not configured. Please check your environment settings.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Please provide a valid question or prompt.');
    }

    const formattedPrompt = formatPrompt(prompt);
    const result = await model.generateContent(formattedPrompt);
    
    if (!result || !result.response) {
      throw new Error('No response received from Gemini API');
    }

    const response = result.response;
    const text = response.text();
    
    if (!text || text.trim().length === 0) {
      throw new Error('Received empty response from Gemini API');
    }

    return text;
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    
    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your configuration.');
      }
      if (error.message.includes('network')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.');
      }
      // Pass through the original error message if it's one we threw
      if (error.message.includes('Please provide a valid question') || 
          error.message.includes('API key not configured') ||
          error.message.includes('Received empty response')) {
        throw error;
      }
    }
    
    // Generic error for unexpected cases
    throw new Error('An unexpected error occurred. Please try again.');
  }
}