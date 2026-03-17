import dotenv from 'dotenv';

// Load .env early for all modules that follow.
dotenv.config();

// Normalize common env names used by various Google GenAI client libraries.
// If the project sets GEMINI_API_KEY, also set GOOGLE_API_KEY so libraries that
// expect that name will find it.
if (process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
  process.env.GOOGLE_API_KEY = process.env.GEMINI_API_KEY;
}
if (process.env.GEMINI_API_KEY && !process.env.GENAI_API_KEY) {
  process.env.GENAI_API_KEY = process.env.GEMINI_API_KEY;
}

// If a path to a service account JSON is provided, leave it as-is. No further action.

console.log('Environment loaded (loadEnv).');
