import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiRefreshCw, FiMic } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

function Chat() {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hello! I'm your AI Financial Advisor. I can help you with:\n\n"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const recognition = useRef(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { type: 'bot', content: "Error: " + data.error }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', content: "Server connection failed" }]);
    }
  
    setIsLoading(false);
  };
  
  const resetChat = () => {
    setMessages([
      {
        type: 'bot',
        content: "Hello! I'm your AI Financial Advisor. I can help you with:\n\n"
      }
    ]);
  };

  const startListening = () => {
    if (recognition.current) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0A0F1E]">
      <div className="bg-[#1A1F2E] border-b border-[#2A2F3E] p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-[#E4E7EB] flex items-center gap-2">
            <span className="text-[#4CAF50]">●</span> Financial AI Advisor
          </Link>
          <button
            onClick={resetChat}
            className="p-2 text-[#6B7280] hover:text-[#E4E7EB] transition-colors"
            title="Reset conversation"
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-[#0A0F1E]">
        <div className="h-full max-w-7xl mx-auto px-4 py-6">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 pb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xl p-4 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-[#2A2F3E] text-[#E4E7EB]'
                        : 'bg-[#1A1F2E] text-[#E4E7EB] border border-[#2A2F3E]'
                    }`}
                  >
                    <ReactMarkdown className="prose prose-invert prose-sm">
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1F2E] rounded-lg p-4 border border-[#2A2F3E]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-[#2A2F3E] pt-4">
              <form onSubmit={handleSubmit}>
                <div className="relative flex">
                  <button
                    type="button"
                    onClick={startListening}
                    className={`p-2 mr-2 text-[#6B7280] hover:text-[#4CAF50] transition-colors rounded-lg ${isListening ? 'text-[#4CAF50]' : ''}`}
                    title="Speak"
                  >
                    <FiMic className="w-6 h-6" />
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about market trends, company analysis, or investment strategies..."
                    className="w-full px-4 py-3 bg-[#1A1F2E] text-[#E4E7EB] placeholder-[#6B7280] border border-[#2A2F3E] rounded-lg focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 p-2 text-[#6B7280] hover:text-[#4CAF50] transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <FiSend className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
