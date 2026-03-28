import { validateAIResponse } from './ai-response.validator.js';
import { BASE_PROMPT } from './ai.prompt.js';

export class AiService {
  private readonly basePrompt = BASE_PROMPT;

  generateTask = async (body) => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
      },
      method: 'POST',
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: this.basePrompt,
          },
          {
            role: 'user',
            content: body.body,
          },
        ],
        temperature: 0,
        max_tokens: 150,
      }),
    });
    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }
    const data = await res.json();
    const text = data.choices[0].message.content;
    const cleaned = text.replace(/```json|```/g, '').trim();
    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { invalid: true };
    }

    return validateAIResponse(parsed);
  };
}
