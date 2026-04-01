import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, X, Bot } from "lucide-react";
import "./ChatBot.css";

const ChatBot = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [feedbackContext, setFeedbackContext] = useState(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Listen for external context changes (e.g. from ViewComplaints)
  useEffect(() => {
    const handleSetContext = (event) => {
      const { complaintId, officer, department } = event.detail;
      setFeedbackContext({ complaintId, officer, department });
      setOpen(true);
      
      const promptTitle = t("complaints.chatbot.feedback_prompt", { id: complaintId, officer });
      setMessages(prev => [...prev, { text: promptTitle, sender: "bot" }]);
    };

    window.addEventListener("setChatContext", handleSetContext);
    return () => window.removeEventListener("setChatContext", handleSetContext);
  }, [t]);

  // Initialize greeting based on role (Third-person professional)
  useEffect(() => {
    let greeting = "System analysis active. Guidance for platform features is ready.";
    
    if (user?.role === "Officer") {
      greeting = `Officer ${user.name} identification verified. System assistant for officer operations is active.`;
    } else if (user?.role === "Admin") {
      greeting = `Admin ${user.name} identification verified. System assistant for platform oversight is active.`;
    } else if (user?.name) {
      greeting = `Citizen ${user.name} identification verified. System assistant for complaint registration is active.`;
    }

    setMessages([{ text: greeting, sender: "bot" }]);
  }, [user]);

  // 📝 Listen for contextual feedback trigger
  useEffect(() => {
    const handleFeedbackTrigger = async (e) => {
      const { complaintId, officer, department } = e.detail;
      setOpen(true);
      
      const initialMsg = `I want to give feedback for complaint #${complaintId}. Officer: ${officer}, Dept: ${department}.`;
      setMessages(prev => [...prev, { text: initialMsg, sender: "user" }]);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ 
            message: initialMsg,
            role: user?.role || "Citizen",
            name: user?.name || "Guest"
          })
        });

        const data = await res.json();
        setMessages(prev => [...prev, { text: data.reply || "AI failed to respond.", sender: "bot" }]);
      } catch (err) {
        console.error("Feedback trigger error:", err);
      }
    };

    window.addEventListener("openChatWithFeedback", handleFeedbackTrigger);
    return () => window.removeEventListener("openChatWithFeedback", handleFeedbackTrigger);
  }, [user]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user"
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ 
          message: input,
          role: user?.role || "Citizen",
          name: user?.name || "Guest",
          ...feedbackContext
        })
      });

      const data = await res.json();
      let botText = data.reply || "AI did not respond.";

      // 🔍 DETECT STRUCTURED DATA (FOR FEEDBACK SUBMISSION)
      if (botText.includes('complaintId') && botText.includes('rating') && botText.includes('{')) {
        try {
          const jsonMatch = botText.match(/\{[\s\S]*?"complaintId"[\s\S]*?\}/);
          if (jsonMatch) {
            const structuredData = JSON.parse(jsonMatch[0]);
            
            // Auto-submit feedback to backend
            await axios.post("/api/feedback", {
              officerName: structuredData.officer,
              department: structuredData.department,
              complaintId: structuredData.complaintId,
              type: structuredData.type,
              rating: structuredData.rating,
              message: structuredData.message,
              sentiment: structuredData.sentiment || "Neutral",
              escalated: !!structuredData.escalated
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            // Remove the JSON block from the bot's reply for a clean UI
            botText = botText.replace(jsonMatch[0], "").trim();
            setFeedbackContext(null); // Clear context after submission
          }
        } catch (e) {
          console.error("Error parsing/submitting feedback:", e);
        }
      }

      const botReply = {
        text: botText,
        sender: "bot"
      };

      setMessages(prev => [...prev, botReply]);

    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [
        ...prev,
        { text: t("complaints.chatbot.error"), sender: "bot" }
      ]);
    }

    setInput("");
  };

  return (
    <div className="chatbot-container">

      {open && (
        <div className="chat-window">

          <div className="chat-header">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <span className="font-bold tracking-tight">{t("complaints.chatbot.name")}</span>
            </div>
            <span
              className="close-btn"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </span>
          </div>

          <div className="chat-messages">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender}`}
              >
                {msg.text}
              </div>
            ))}

          </div>

          <div className="chat-input">

            <input
              type="text"
              placeholder={t("complaints.chatbot.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button onClick={sendMessage}>
              {t("complaints.chatbot.send")}
            </button>

          </div>

        </div>
      )}

      <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Open Chatbot"
      >
        <MessageSquare size={24} />
      </button>

    </div>
  );
};

export default ChatBot;