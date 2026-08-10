import React, { useState, useRef, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const AiChatbot = () => {
  const { backendUrl, currency, navigate } = useContext(ShopContext);

  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "👋 Hi! I'm **Smarty AI**, your personal shopping assistant.\n\nAsk me anything about our clothing collections, bestsellers, sizes, returns, or shipping fees!",
      recommendedProducts: [],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text || text.trim() === "" || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await axios.post(`${backendUrl}/api/ai/chat`, {
        message: text.trim(),
        history: historyPayload
      });

      if (res.data && res.data.success) {
        const botMsg = {
          id: Date.now() + 1,
          sender: "bot",
          text: res.data.reply,
          recommendedProducts: res.data.recommendedProducts || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(res.data?.message || "Failed to get response");
      }
    } catch (error) {
      console.error("Smarty Error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: "I'm having trouble retrieving store data right now. Please try asking again!",
        recommendedProducts: [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Conversation reset! How can I assist you with your shopping today?",
        recommendedProducts: [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  const renderFormattedText = (content) => {
    if (!content) return null;

    const paragraphs = content.split("\n");

    return paragraphs.map((para, pIdx) => {
      if (!para.trim()) return <div key={pIdx} className="h-2" />;

      const parts = para.split(/(\*\*.*?\*\*|\*.*?\*)/g);

      return (
        <p key={pIdx} className="mb-1 leading-relaxed text-sm">
          {parts.map((part, idx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={idx} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith("*") && part.endsWith("*")) {
              return <em key={idx} className="italic text-gray-800">{part.slice(1, -1)}</em>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-2.5 bg-gray-900 hover:bg-black text-white px-5 py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-800"
        >
          {hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
            </span>
          )}
          {/* Minimal Chat Icon */}
          <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-semibold text-sm tracking-wide">Smarty AI</span>
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Clean Professional Header */}
          <div className="bg-gray-900 text-white px-4 py-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-white shadow-sm text-sm">
                  S
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-gray-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-semibold text-sm tracking-wide text-white">
                  Smarty AI
                </h3>
                <p className="text-[11px] text-emerald-400 font-medium">
                  Online • Ready to help
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-gray-300">
              <button
                onClick={handleClearChat}
                title="Clear Chat"
                className="p-1.5 hover:text-white hover:bg-gray-800 rounded-lg transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 hover:text-white hover:bg-gray-800 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm text-sm ${
                    msg.sender === "user"
                      ? "bg-gray-900 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-none"
                  }`}
                >
                  {renderFormattedText(msg.text)}

                  {/* Recommended Product Cards */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      <p className="text-[11px] font-semibold text-gray-500 tracking-wider uppercase">
                        Recommended Items:
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.recommendedProducts.map((prod) => (
                          <div
                            key={prod._id}
                            onClick={() => {
                              setIsOpen(false);
                              navigate(`/product/${prod._id}`);
                            }}
                            className="group flex items-center gap-3 p-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition cursor-pointer"
                          >
                            <img
                              src={Array.isArray(prod.image) ? prod.image[0] : prod.image}
                              alt={prod.name}
                              className="w-12 h-12 object-cover rounded-lg bg-gray-200"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-gray-900 truncate">
                                {prod.name}
                              </h4>
                              <p className="text-xs font-bold text-gray-900 mt-0.5">
                                {currency}{prod.price}
                              </p>
                            </div>
                            <span className="text-[11px] bg-gray-900 text-white group-hover:bg-black px-2.5 py-1 rounded-md transition font-medium">
                              View
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-white border border-gray-200 p-3.5 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Smarty AI about products, policy..."
              disabled={isLoading}
              className="flex-1 bg-gray-100 text-gray-900 text-sm px-3.5 py-2.5 rounded-xl border border-transparent focus:border-gray-900 focus:bg-white focus:outline-none transition placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gray-900 hover:bg-black text-white p-2.5 rounded-xl transition disabled:opacity-40 disabled:hover:bg-gray-900 flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiChatbot;
