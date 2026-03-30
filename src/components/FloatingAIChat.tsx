import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Volume2, X, MessageSquare, Sparkles } from 'lucide-react';
import { generateText, generateSpeech } from '../lib/gemini';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function FloatingAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const lessonsSection = document.getElementById('lessons');
      const homeSection = document.getElementById('home');
      
      if (lessonsSection && homeSection) {
        const lessonsRect = lessonsSection.getBoundingClientRect();
        const homeRect = homeSection.getBoundingClientRect();
        
        // Show when lessons section is in view or below it
        // Hide when home section is fully in view (at the top)
        if (lessonsRect.top <= window.innerHeight * 0.8) {
          setIsVisible(true);
        } else if (homeRect.top >= -100) {
          setIsVisible(false);
          setIsOpen(false); // Close chat if we scroll back to top
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateText(
        input,
        "You are a helpful Number Theory expert. Explain concepts clearly, provide examples, and help users understand the beauty of numbers. Keep responses concise but informative."
      );
      setMessages((prev) => [...prev, { role: 'assistant', content: response || "I'm sorry, I couldn't generate a response." }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', content: "Error: Failed to connect to the AI." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTTS = async (text: string, index: number) => {
    if (isSpeaking !== null) return;
    setIsSpeaking(index);
    try {
      const base64Audio = await generateSpeech(text);
      if (base64Audio) {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audio.onended = () => setIsSpeaking(null);
        audio.play();
      } else {
        setIsSpeaking(null);
      }
    } catch (error) {
      console.error(error);
      setIsSpeaking(null);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 right-8 z-[100] flex flex-col items-end"
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, width: 0, opacity: 0 }}
                animate={{ 
                  height: 'min(50vh, 600px)', 
                  width: 'min(90vw, 450px)', 
                  opacity: 1 
                }}
                exit={{ height: 0, width: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="mb-4 bg-white rounded-[32px] shadow-2xl overflow-hidden border border-zinc-200 flex flex-col origin-bottom-right"
              >
                {/* Chat Header */}
                <div className="bg-zinc-900 p-4 flex items-center justify-between text-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00ff87] to-[#60efff] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-zinc-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">NT Assistant</h3>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">Gemini 3.1 Pro</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50">
                  {messages.length === 0 && (
                    <div className="text-center py-10 space-y-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-zinc-900">Ask me anything!</p>
                        <p className="text-xs text-zinc-500 max-w-[200px] mx-auto">"What are Mersenne primes?" or "Explain modular arithmetic."</p>
                      </div>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", 
                        msg.role === 'user' ? "bg-zinc-900 text-white" : "bg-emerald-100 text-emerald-700")}>
                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                      </div>
                      <div className={cn("max-w-[85%] p-3 rounded-2xl relative group", 
                        msg.role === 'user' ? "bg-zinc-900 text-white rounded-tr-none" : "bg-white border border-zinc-200 rounded-tl-none text-zinc-800 shadow-sm")}>
                        <div className="prose prose-sm max-w-none prose-zinc dark:prose-invert text-sm leading-relaxed">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                        {msg.role === 'assistant' && (
                          <button 
                            onClick={() => handleTTS(msg.content, i)}
                            className="absolute -right-8 top-0 p-1.5 text-zinc-400 hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100"
                            disabled={isSpeaking !== null}
                          >
                            {isSpeaking === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Loader2 className="w-3 h-3 animate-spin" />
                      </div>
                      <div className="bg-white border border-zinc-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-zinc-300 rounded-full animate-bounce" />
                          <div className="w-1 h-1 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                          <div className="w-1 h-1 bg-zinc-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-zinc-100 shrink-0">
                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your question..."
                      className="flex-1 bg-zinc-100 border-none rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="bg-zinc-900 text-white p-2 rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all shadow-lg shadow-zinc-200"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl transition-all duration-500",
              "bg-gradient-to-r from-[#00ff87] to-[#60efff] text-zinc-900 font-black uppercase tracking-widest text-xs",
              isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Learn with AI</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
