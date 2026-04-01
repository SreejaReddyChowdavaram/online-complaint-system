import express from "express";
import Feedback from "../models/Feedback.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chat", protect, async (req, res) => {
  try {
    const { message, role, name, complaintId, officer, department } = req.body;
    
    // ----- ROLE-SPECIFIC NAVIGATION & PERMISSIONS -----
    const rules = {
      Citizen: {
        location: "Left sidebar → Post Complaint",
        features: ["Raise Complaint", "View Complaints", "Track status", "Update Profile"],
        nav: {
          "post complaint": "📍 Location: Left sidebar → Post Complaint \n\n → Fill complaint form (center) \n\n → Submit \n\n Complaint registered successfully ✅",
          "view complaints": "📍 Location: Left sidebar → My Complaints \n\n → View all submitted complaints \n\n List displayed successfully ✅",
          "track status": "📍 Location: Left sidebar → My Complaints \n\n → Check 'Status' column \n\n Real-time status visible ✅",
          "update profile": "📍 Location: Left sidebar → Profile \n\n → Click 'Edit Profile' \n\n → Update details and save \n\n Profile updated successfully ✅"
        }
      },
      Officer: {
        location: "Dashboard → Assigned Complaints",
        features: ["View Assigned Complaints", "Update complaint status", "View feedback", "Check performance"],
        nav: {
          "view complaints": "📍 Location: Dashboard → Assigned Complaints \n\n → Open complaint \n\n → View details and update status \n\n Complaint data displayed ✅",
          "update status": "📍 Location: Dashboard → Assigned Complaints \n\n → Select complaint → Change status \n\n Status updated successfully ✅",
          "view feedback": "📍 Location: Left sidebar → Feedback / Performance \n\n → View citizen comments and ratings \n\n Feedback list visible ✅",
          "performance": "📍 Location: Left sidebar → Performance \n\n → View average rating and metrics \n\n Performance data displayed ✅"
        }
      },
      Admin: {
        location: "Left sidebar",
        features: ["View Dashboard", "View Complaints", "Officer Performance", "Manage Users & Officers", "View Reports"],
        nav: {
          "dashboard": "📍 Location: Left sidebar → Dashboard \n\n → View real-time system overview \n\n Analytics displayed ✅",
          "manage users": "📍 Location: Left sidebar → Manage Users & Officers \n\n → View all users and officers \n\n → Select user → Change role or Delete \n\n Changes applied successfully ✅",
          "officer performance": "📍 Location: Left sidebar → Officer Performance \n\n → Select officer profile \n\n Performance breakdown visible ✅",
          "reports": "📍 Location: Left sidebar → Reports/Performance \n\n → View system-wide data \n\n Reports generated successfully ✅"
        }
      }
    };

    const currentRules = rules[role] || rules.Citizen; // Default to Citizen if ambiguous

    // ----- CONTEXT FETCH (REAL-TIME DATA) -----
    let statsContext = "";
    if (role === "Officer") {
      const allFeedback = await Feedback.find({ officerName: name });
      const total = allFeedback.length;
      const avg = total > 0 ? (allFeedback.reduce((s, f) => s + f.rating, 0) / total).toFixed(1) : 0;
      statsContext = `[OFFICER PERFORMANCE: Avg ${avg} ⭐ from ${total} reviews]`;
    }

    // ----- CORE SYSTEM PROMPT (STRICT) -----
    const systemPrompt = `
IDENTITY: SYSTEM AUTOMATED ASSISTANT for Civic Complaint Management System.
ROLE: ${role} Assistant.

CRITICAL RULES:
1. DETECT INTENT: If input matches any feature in ${JSON.stringify(currentRules.features)}, guide the user.
2. PRONOUN RESTRICTION: NEVER use "I", "me", "my", "mine", "I'm". Use third-person or passive voice only.
3. NAVIGATION FORMAT:
   📍 Location: [UI Path]
   → [Step 1]
   → [Step 2]
   [Result] ✅
4. SCOPE GUARD: If question is NOT about ${JSON.stringify(currentRules.features)} or system operation, respond ALWAYS with: "This feature is not available in the system ⚠️"
5. NO EXTERNAL KNOWLEDGE: Ignore general info or other apps.
6. NO EXTRA CONVERSATION: Provide steps only.

ROLE SPECIFIC DATA:
- Role: ${role}
- Name: ${name}
- Context ID: ${complaintId || "None"}
- Analytics: ${statsContext}

EXAMPLES:
User: "how to delete user" (Role: Admin)
Response: "📍 Location: Left sidebar → Manage Users & Officers \n\n → Select target user \n\n → Click Delete icon \n\n User removed successfully ✅"

User: "What is the weather?"
Response: "This feature is not available in the system ⚠️"
`;

    // ----- CALL AI MODEL -----
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.1, // High precision
        max_tokens: 150
      })
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("❌ [OPENROUTER ERROR]:", data.error);
      return res.status(502).json({ reply: "AI failed to respond due to API error." });
    }

    let reply = data.choices?.[0]?.message?.content || "AI failed to respond.";

    // Backup scope check if AI hallucinations occur
    const isOutOfScope = reply.toLowerCase().includes("i ") || reply.toLowerCase().includes(" help") || !reply.includes("📍");
    if (isOutOfScope && !reply.includes("⚠️")) {
      // reply = "This feature is not available in the system ⚠️"; // Commented out to allow AI a chance first
    }

    res.json({ reply });

  } catch (error) {
    console.error("🔥 [SERVER AI ERROR]:", error);
    res.status(500).json({ reply: "AI failed to respond. Please check backend logs." });
  }
});

export default router;