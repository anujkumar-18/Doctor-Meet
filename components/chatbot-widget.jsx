"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Loader2, 
  Sparkles, 
  RotateCcw, 
  Info,
  Calendar,
  MessageSquareHeart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { askSmartChatbot } from "@/actions/chatbot";
import { getCurrentUser } from "@/actions/onboarding";
import Link from "next/link";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch log-in user details to personalize the chat
  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser();
        if (user) {
          setUserProfile(user);
        }
      } catch (err) {
        console.error("Failed to load user in chatbot widget:", err);
      }
    }
    loadUser();
  }, []);

  // Initialize messages
  useEffect(() => {
    if (messages.length === 0) {
      let welcomeMsg = "Hello! I am DocBuddy 🤖, your AI health assistant. How can I help you feel better today? 🌿";
      
      if (userProfile && userProfile.role === "PATIENT") {
        const name = userProfile.name ? userProfile.name.split(" ")[0] : "there";
        const problem = userProfile.primaryProblem;
        const age = userProfile.age;

        if (problem) {
          welcomeMsg = `Hello ${name}! I am **DocBuddy** 🤖\n\nI see you are ${age ? `${age} years old and ` : ""}experiencing **"${problem}"**.\n\nHow are you feeling now? I can recommend some general over-the-counter medicine or home remedies.`;
        } else {
          welcomeMsg = `Hello ${name}! I am **DocBuddy** 🌿\n\nHow can I help you today? Ask me about common problems like fever, cough, cold, headaches, or stomach acidity.`;
        }
      }

      setMessages([
        {
          id: "welcome",
          text: welcomeMsg,
          sender: "bot",
          time: new Date(),
        }
      ]);
    }
  }, [userProfile, messages.length]);

  // Scroll to bottom when new messages logic triggers
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue;
    setInputValue("");
    
    // Append user message
    const userMsg = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: "user",
      time: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await askSmartChatbot(userMessageText);
      
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        sender: "bot",
        time: new Date(),
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chatbot response failure:", error);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        text: "I met with a technical issue. Please try checking your internet connection or resubmit your query.",
        sender: "bot",
        time: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
  };

  // Convert simple markdown markers like **bold** and * bullet points to JSX elements safely
  const renderMessageContent = (text) => {
    if (!text) return "";
    
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      // 1. Bullet list items
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        const cleanContent = line.trim().replace(/^[\*\-]\s+/, "");
        return (
          <li key={lineIdx} className="ml-4 list-disc text-sm my-1 text-gray-200">
            {parseBoldText(cleanContent)}
          </li>
        );
      }
      
      // 2. Headings or lists starting with warning emoji
      if (line.trim().startsWith("⚠️")) {
        return (
          <p key={lineIdx} className="text-xs text-amber-400 bg-amber-950/20 border border-amber-900/30 p-2 rounded my-2 leading-relaxed">
            {parseBoldText(line)}
          </p>
        );
      }
      
      // 3. Standard paragraphs
      return (
        <p key={lineIdx} className="text-sm my-1 leading-relaxed text-gray-100">
          {parseBoldText(line)}
        </p>
      );
    });
  };

  // Helper utility to parse **text** into <strong> elements
  const parseBoldText = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} className="font-bold text-emerald-400">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded ChatWindow */}
      {isOpen && (
        <Card className="w-[360px] md:w-[400px] h-[550px] shadow-2xl bg-zinc-950/95 border-emerald-900/30 border backdrop-blur-xl flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <CardHeader className="p-4 border-b border-emerald-950 flex flex-row items-center justify-between bg-emerald-950/20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-white">DocBuddy AI 🩺</CardTitle>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  <span className="text-[10px] text-emerald-400 font-medium">Assistant Active</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 text-gray-400 hover:text-emerald-400 hover:bg-emerald-950/30"
                onClick={handleResetChat}
                title="Restart Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-8 h-8 text-gray-400 hover:text-red-400 hover:bg-red-950/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-zinc-900 border border-emerald-950/50 text-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <ul className="list-none space-y-0.5">
                      {renderMessageContent(msg.text)}
                    </ul>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
                <span className="text-[9px] text-gray-500 mt-1 px-1">
                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="bg-zinc-900 border border-emerald-950/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span className="text-xs text-gray-400">DocBuddy is typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Quick Doctor Link banner */}
          <div className="px-4 py-2 bg-emerald-900/10 border-t border-emerald-950 flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Need a real doctor?
            </span>
            <div className="flex gap-2">
              <Link 
                href="/appointments" 
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 underline transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Calendar className="w-3 h-3 inline shrink-0" />
                My Appts
              </Link>
              <Link 
                href="/doctors" 
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5 underline transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Calendar className="w-3 h-3 inline shrink-0" />
                Book
              </Link>
            </div>
          </div>

          {/* Form Input */}
          <form 
            onSubmit={handleSendMessage} 
            className="p-3 border-t border-emerald-950 bg-zinc-950 flex items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Ask DocBuddy about your symptoms..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-zinc-900/80 border-emerald-950/50 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm h-10 text-white placeholder-gray-500"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="bg-emerald-600 hover:bg-emerald-700 h-10 w-10 shrink-0"
              disabled={isLoading || !inputValue.trim()}
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </form>
        </Card>
      )}

      {/* Floating Toggle Button */}
      <div className="animate-docbuddy-float relative">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes docbuddy-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-docbuddy-float {
            animation: docbuddy-float 3s ease-in-out infinite;
          }
        `}} />
        
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-20 h-20 rounded-full p-0 overflow-hidden shadow-2xl bg-zinc-950 border-2 border-emerald-500/50 hover:border-emerald-400 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group relative"
        >
          {isOpen ? (
            <div className="w-full h-full relative bg-zinc-950 flex items-center justify-center">
              <img 
                src="/docbuddy.jpg" 
                alt="DocBuddy" 
                className="w-full h-full object-cover opacity-30 group-hover:opacity-15 transition-opacity"
              />
              <X className="absolute w-8 h-8 text-emerald-400 stroke-[2.5]" />
            </div>
          ) : (
            <div className="w-full h-full relative">
              <img 
                src="/docbuddy.jpg" 
                alt="DocBuddy" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute top-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-zinc-950 flex items-center justify-center animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
