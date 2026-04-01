import dotenv from 'dotenv';
dotenv.config();
import { OAuth2Client } from 'google-auth-library';
console.log("Checking GOOGLE_CLIENT_ID from .env...");
console.log("Value:", process.env.GOOGLE_CLIENT_ID);
try {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  console.log("✅ Success: OAuth2Client initialized.");
} catch (err) {
  console.error("❌ Error initializing OAuth2Client:", err.message);
}
process.exit();
