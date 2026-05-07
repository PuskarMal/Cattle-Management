import React from 'react'
import chatbot from '/chatbot.png'
import { useNavigate } from 'react-router-dom'

const VoiceBotLogo = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center z-50" onClick={() => navigate("/voicebot")}>
        <img
          src={chatbot}
          alt="Chatbot"
          className="w-14 h-14 rounded-full shadow-lg border-2 border-gray-300 cursor-pointer hover:scale-105 transition"
        />
        <p className="text-xs mt-1 text-gray-600">Your Assistant</p>
      </div>
  )
}

export default VoiceBotLogo