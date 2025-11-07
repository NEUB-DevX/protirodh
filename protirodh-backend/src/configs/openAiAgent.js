import { OpenAI } from "openai";
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Function to generate a completion from OpenAI's chat endpoint with retries
 */
async function getOpenAiChatCompletion(sysPrompt, usrPrompt, options = {}) {
  const {
    retries = 5,
    backoffMs = 1000,
    model = "gpt-4o-mini",
    max_tokens = 4500,
    temperature = 0.8
  } = options;

  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user", content: usrPrompt },
        ],
        max_tokens,
        temperature,
      });

      let response = completion.choices[0]?.message?.content
        ?.trim()
        .replace(/^\s*["']|["']\s*$/g, '');

      if (!response) {
        throw new Error("Empty response from Guru");
      }

      return response;
    } catch (error) {
      lastError = error;
      // If this was the last attempt, break and throw
      if (attempt === retries) break;
      // Otherwise wait and retry
      console.warn(`AI call failed (attempt ${attempt}): ${error.message}`);
      await new Promise(res => setTimeout(res, backoffMs * Math.pow(2, attempt - 1)));
    }
  }

  console.error("All AI attempts failed:", lastError);
  throw new Error("Could not generate a response. Please try again later.");
}

export default getOpenAiChatCompletion;
