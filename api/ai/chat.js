import { withAuth } from "../../lib/authMiddleware.js";
import Feedback from "../../models/Feedback.js";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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

    const currentRules = rules[role] || rules.Citizen;

    // ----- CONTEXT FETCH (REAL-TIME DATA) -----
    let statsContext = "";
    if (role === "Officer") {
      const allFeedback = await Feedback.find({ officerName: name });
      const total = allFeedback.length;
      const avg = total > 0 ? (allFeedback.reduce((s, f) => s + f.rating, 0) / total).toFixed(1) : 0;
      statsContext = `[OFFICER PERFORMANCE: Avg ${avg} ⭐ from ${total} reviews]`;
    }

    // ----- CORE SYSTEM PROMPT -----
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
`;

    // ----- CALL AI MODEL (OPENROUTER) -----
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
        temperature: 0.1,
        max_tokens: 150
      })
    });

    const data = await aiResponse.json();
    const reply = data.choices?.[0]?.message?.content || "AI failed to respond.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default withAuth(handler);
