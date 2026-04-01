import dotenv from 'dotenv';
dotenv.config();

const testProfessionalSpec = async (message, role, name = "TestUser", stats = {}) => {
  let statsContext = role === "Officer" ? `
[REAL-TIME DATA]
- Rating: 2.0
- Sentiment: Mostly negative
` : "";

    const officerPrompt = `
IDENTITY: SYSTEM AUTOMATED ASSISTANT
TONE: PROFESSIONAL / THIRD-PERSON ONLY
RULE: NO PRONOUNS (I, me, my, mine, I'm, I will, I can, let me) ❌
RULE: ASSIST ONLY WITH SYSTEM UI 📍

[UI LOCATIONS]
- Assigned Complaints: Left sidebar → Assigned Complaints
- Profile: Left sidebar → Profile OR Top right navbar dropdown

[EXAMPLE]
User: "view complaints"
Response: "📍 Location: Left sidebar → Assigned Complaints \n\n → Select complaint \n\n Complaint details displayed ✅"

[REFUSAL]
User: [Out of scope query]
Response: "System assistance is restricted to platform features. Requested information is not available ⚠️"

Officer PERFORMANCE DATA:
${statsContext}
`;

    const citizenPrompt = `
IDENTITY: SYSTEM AUTOMATED ASSISTANT
TONE: PROFESSIONAL / THIRD-PERSON ONLY
RULE: NO PRONOUNS (I, me, my, mine, I'm, I will, I can, let me) ❌
RULE: ASSIST ONLY WITH SYSTEM UI 📍

[UI LOCATIONS]
- Post Complaint: Left sidebar → Register Complaint
- My Complaints: Left sidebar → My Complaints
- Profile / Edit Info: Left sidebar → Profile OR Top right navbar dropdown → My Profile
- Update Phone/Email: Profile page → Edit Profile button → Fill form → Save
- Select Location: Right-side map section in the complaint form
- Upload Photo: Below description field in the complaint form

[EXAMPLE]
User: "edit phone number"
Response: "📍 Location: Left sidebar → Profile → Edit Profile \n\n → Update mobile number field \n\n → Click 'Save Changes' \n\n Profile updated successfully ✅"

[REFUSAL]
User: [Out of scope query]
Response: "System assistance is restricted to platform features. Requested information is not available ⚠️"

Feedback Context: Not provided
`;

    const adminPrompt = `
IDENTITY: SYSTEM AUTOMATED ASSISTANT
TONE: PROFESSIONAL / THIRD-PERSON ONLY
RULE: NO PRONOUNS (I, me, my, mine, I'm, I will, I can, let me) ❌
RULE: ASSIST ONLY WITH SYSTEM UI 📍

[UI LOCATIONS]
- Officer Performance: Left sidebar → Officer Performance
- Manage Users: Left sidebar → Manage Users
- View All Complaints: Left sidebar → View Complaints

[EXAMPLE]
User: "view reports"
Response: "📍 Location: Left sidebar → Officer Performance \n\n → Select officer \n\n Performance data displayed ✅"

[REFUSAL]
User: [Out of scope query]
Response: "System assistance is restricted to platform features. Requested information is not available ⚠️"

System Analytics: Not provided
`;

  let systemPrompt = citizenPrompt;
  if (role === "Officer") systemPrompt = officerPrompt;
  else if (role === "Admin") systemPrompt = adminPrompt;
  else {
    systemPrompt = "System: Identify role to proceed. Assistance is provided only for system features.";
  }

  console.log(`Testing message: "${message}" for role: ${role}`);

  try {
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
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "AI did not respond.";
    console.log("AI Reply:\n", reply);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
  console.log("-----------------------------------\n");
};

(async () => {
  await testProfessionalSpec("select location", "Citizen");
  await testProfessionalSpec("edit phone number", "Citizen");
  await testProfessionalSpec("view complaints", "Officer");
  await testProfessionalSpec("system report", "Admin");
  await testProfessionalSpec("hello", "Guest");
  await testProfessionalSpec("what is the weather like?", "Citizen");
})();
