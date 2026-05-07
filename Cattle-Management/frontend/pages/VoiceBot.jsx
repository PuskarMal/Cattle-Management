import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from "react-i18next";
import { langMap } from "../utils/langMap";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const defaultPrompts = [
  "What is SAMRIDHI?",
  "How do I register animal details?",
  "What is available in the marketplace?",
];

const VoiceBot = () => {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  const prompts = useMemo(() => defaultPrompts, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const message = text.trim();
    if (!message || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach the chatbot service.");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "I could not find relevant content.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I could not reach the chatbot service. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognitionRef.current = recognition;
    }

    const recognition = recognitionRef.current;
    recognition.lang = langMap[i18n.language] || "en-IN";
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) {
        setInput(transcript);
      }
    };
    recognition.onerror = () => {
      alert("Could not capture voice. Please try again.");
    };
    recognition.start();
  };

  return (
    <div className='p-5 min-h-screen bg-gradient-to-b from-amber-50 via-white to-emerald-50'>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/90 border border-emerald-100 shadow-sm rounded-2xl p-4 md:p-6 min-h-[420px]">
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Smart Animal Management Assistant
            </h2>
          </div>

          <div className="flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-2">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-100 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl px-4 py-3 text-sm bg-amber-100 text-gray-700">
                  Searching local content...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask from chatbot.md or your saved website links..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <button
                type="button"
                onClick={handleMicClick}
                className="px-4 py-3 rounded-xl border border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition"
              >
                Mic
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceBot
