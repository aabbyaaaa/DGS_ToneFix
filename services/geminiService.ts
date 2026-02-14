import { PolishRequest, PolishResponse, Tone } from "../types";

// User requested Gemini 3 Flash Preview.
// Using OpenRouter convention "google/" prefix.
// If this specific ID is not yet active on OpenRouter, you may need to fallback to 'google/gemini-2.0-flash-001'
export const MODEL_NAME = 'google/gemini-3-flash-preview';

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const polishText = async (request: PolishRequest): Promise<PolishResponse> => {
  const { sourceText, customerName, customerTitle } = request;
  
  // 1. Get API Key at runtime (prevents app crash if key is missing during init)
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your Vercel Environment Variables.");
  }

  // 2. Construct the prompt
  const greetingInstruction = (customerName || customerTitle)
    ? `Address the customer as "${customerName || ''}${customerTitle || ''}".`
    : `Use a generic professional greeting (e.g., "您好，感謝您的詢問").`;

  // We explicitly include the JSON schema in the system prompt because
  // OpenRouter/OpenAI format works best with explicit schema instructions in text
  // when using response_format: { type: "json_object" }.
  const systemInstruction = `
    You are a specialized "Technical Customer Service Polishing Assistant". 
    Your goal is to take raw technical notes from engineers and convert them into polite, professional customer service replies in Traditional Chinese (繁體中文).
    
    CRITICAL RULES (Hard Constraints):
    1. **Term Integrity**: DO NOT change, translate, or remove any technical terms, model numbers (e.g., ABC-1234), values (e.g., 0.22 μm), units, or part numbers. Verify this strictly.
    2. **Language**: Output MUST be in Traditional Chinese (Taiwan).
    3. **Formatting & Layout Strategy (Crucial)**:
       - **Smart Paragraphing**: Content MUST be broken into logical paragraphs using line breaks. Do not produce a single block of text ("wall of text").
       - **Auto-Bulleting**: REGARDLESS of the tone (Concise, Standard, or Formal), if the content involves technical specifications, step-by-step instructions, multiple distinct issues, or a list of items, **YOU MUST use bullet points (•) or numbered lists (1., 2.)** to present them clearly.
    4. **Tone Variance**: You must generate exactly 3 versions:
       - **Concise (精簡)**: Direct, efficient. Heavily favor bullet points for quick reading.
       - **Standard (標準)**: Balanced, friendly. Use natural paragraphs for explanations and bullet points for specs/steps.
       - **Formal (正式)**: Highly respectful, professional. Structured paragraphs, but use lists for technical details to improve clarity (like a professional report).
    5. **Structure**:
       - ${greetingInstruction}
       - Include the technical content (following the formatting rules above).
       - End with a polite closing (e.g., "如需補充資訊，歡迎告知").
    
    RESPONSE FORMAT:
    You must output a strictly valid JSON object matching this structure:
    {
      "variants": [
        {
          "tone": "concise",
          "subject": "Email Subject",
          "content": "Full response content..."
        },
        {
          "tone": "standard",
          "subject": "Email Subject",
          "content": "Full response content..."
        },
        {
          "tone": "formal",
          "subject": "Email Subject",
          "content": "Full response content..."
        }
      ]
    }
  `;

  const userPrompt = `
    Raw Technical Text:
    """
    ${sourceText}
    """
    
    Please generate the 3 variants now in JSON.
  `;

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://dogger-polisher.vercel.app", // OpenRouter recommendation
        "X-Title": "Dogger Polisher", // OpenRouter recommendation
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }, // Force JSON mode
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const contentString = data.choices[0]?.message?.content;

    if (!contentString) {
      throw new Error("Empty response from AI Provider");
    }

    // Parse the JSON string from the LLM
    const parsed = JSON.parse(contentString) as PolishResponse;
    return parsed;

  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};