import { useState } from "react";
import "./ChatBot.css";

const ChatBot = () => {

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am your AI assistant. How can I help you?", sender: "bot" }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user"
    };

    setMessages(prev => [...prev, userMessage]);

    try {

      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();

      console.log("AI response:", data);

      const botReply = {
        text: data.reply || "AI did not respond.",
        sender: "bot"
      };

      setMessages(prev => [...prev, botReply]);

    } catch (error) {

      console.error("Chatbot error:", error);

      setMessages(prev => [
        ...prev,
        { text: "AI server error. Please try again.", sender: "bot" }
      ]);

    }

    setInput("");
  };

  return (
    <div className="chatbot-container">

      {open && (
        <div className="chat-window">

          <div className="chat-header">
            AI Assistant
            <span
              className="close-btn"
              onClick={() => setOpen(false)}
            >
              ✖
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
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </div>

        </div>
      )}

      <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

    </div>
  );
};

export default ChatBot;