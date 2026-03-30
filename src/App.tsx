import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Lessons from './components/Lessons';
import Tools from './components/Tools';
import FloatingAIChat from './components/FloatingAIChat';
import AboutMe from './components/AboutMe';
import QuizModal from './components/QuizModal';
import { Sparkles, MessageSquare, BrainCircuit, Trophy, ArrowRight } from 'lucide-react';

export default function App() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      
      <main>
        <section id="home">
          <Hero />
        </section>
        
        <section id="lessons">
          <Lessons />
        </section>

        <section id="tools" className="py-24 bg-white">
          <Tools />
          
          {/* Plaque Card Notice */}
          <div id="practice" className="max-w-4xl mx-auto px-4 mt-12">
            <div className="bg-zinc-900 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-zinc-200 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-emerald-500/20 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -ml-32 -mb-32 group-hover:bg-indigo-500/20 transition-colors duration-500" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-emerald-400 border border-white/10 shadow-2xl">
                  <Trophy className="w-10 h-10" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-white tracking-tight mb-2">Ready for a Challenge?</h3>
                  <p className="text-zinc-400 font-medium max-w-md">
                    Test your knowledge of number theory with our randomized assessment drill. 10 questions to prove your mastery.
                  </p>
                </div>
                <button 
                  onClick={() => setIsQuizOpen(true)}
                  className="bg-emerald-500 text-zinc-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2 group/btn active:scale-95"
                >
                  Start Drill <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="about">
        </section>
      </main>

      <footer className="py-24 bg-zinc-900 text-white border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4">
          <AboutMe />
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                <span className="font-bold">#</span>
              </div>
              <span className="font-black text-xl tracking-tighter">NT EXPLORER</span>
            </div>
            <p className="text-zinc-500 text-sm mb-8">
              Built with passion for mathematics and technology. © 2026 Joshua Bugayong.
            </p>
            <div className="flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-600">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
      <FloatingAIChat />
    </div>
  );
}

