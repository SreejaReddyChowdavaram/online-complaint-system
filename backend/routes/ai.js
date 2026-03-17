import express from "express";

const router = express.Router();

router.post("/chat", async (req, res) => {

  try {

    const { message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {

      method: "POST",

      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        model: "openai/gpt-3.5-turbo",

        messages: [

          {
  role: "system",
  content: `
You are an AI assistant for the Online Complaint System.

Your job is to guide users on how to use the website.

You help users with:
- posting complaints
- checking complaint status
- uploading complaint images
- editing profile information (name, phone number, password)
- understanding complaint categories (water, electricity, garbage, roads)

Important rules:
- You do NOT directly change user data.
- Instead, guide the user to the correct page in the system.

Examples:
User: I want to update my phone number
Assistant: Go to the Profile page, click Edit Profile, update your phone number, and save changes.

User: How do I post a complaint?
Assistant: Go to the Post Complaint page, select the category, add description and images, then submit.

If the user asks something unrelated to the system, politely say:
"I can help only with the Online Complaint System."
`
},

          {
            role: "user",
            content: message
          }

        ]

      })

    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "No response";

    res.json({ reply });

  } catch (error) {

    console.error(error);

    res.status(500).json({ reply: "AI failed to respond" });

  }

});

export default router;