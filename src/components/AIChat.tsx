import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Volume2 } from 'lucide-react';
import { generateText, generateSpeech } from '../lib/gemini';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white dark:bg-black rounded-2xl shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="bg-black dark:bg-zinc-950 p-4 flex items-center gap-3 text-white">
        <Bot className="w-6 h-6 text-emerald-400" />
        <div>
          <h3 className="font-semibold">Number Theory Assistant</h3>
          <p className="text-xs text-zinc-400">Powered by Gemini 3.1 Pro</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-black">
        {messages.length === 0 && (
          <div className="text-center py-10 text-zinc-500 dark:text-zinc-400">
            <p>Ask me anything about Number Theory!</p>
            <p className="text-sm italic">"What are Mersenne primes?" or "Explain modular arithmetic."</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", 
              msg.role === 'user' ? "bg-zinc-900 dark:bg-emerald-600 text-white" : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400")}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn("max-w-[80%] p-3 rounded-2xl relative group", 
              msg.role === 'user' ? "bg-zinc-900 dark:bg-emerald-600 text-white rounded-tr-none" : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-tl-none text-zinc-800 dark:text-zinc-100 shadow-sm")}>
              <div className="prose prose-sm max-w-none prose-zinc dark:prose-invert">
                <Markdown>{msg.content}</Markdown>
              </div>
              {msg.role === 'assistant' && (
                <button 
                  onClick={() => handleTTS(msg.content, i)}
                  className="absolute -right-10 top-0 p-2 text-zinc-400 hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100"
                  disabled={isSpeaking !== null}
                >
                  {isSpeaking === i ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-zinc-300 dark:bg-zinc-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-zinc-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-zinc-900 dark:bg-emerald-600 text-white p-2 rounded-xl hover:bg-zinc-800 dark:hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-zinc-200 dark:shadow-emerald-900/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
