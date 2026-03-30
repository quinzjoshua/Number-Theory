import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, Lightbulb, Settings, Mail, Info, ChevronRight, Hash, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export type ModalTab = 'math-facts' | 'learning-tips' | 'settings' | 'contact' | 'about';

interface OverflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ModalTab;
}

const tabs = [
  { id: 'math-facts', label: 'Math Facts', icon: Calculator },
  { id: 'learning-tips', label: 'Learning Tips', icon: Lightbulb },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'contact', label: 'Contact Us', icon: Mail },
  { id: 'about', label: 'About / Credits', icon: Info },
] as const;

export default function OverflowModal({ isOpen, onClose, initialTab = 'math-facts' }: OverflowModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>(initialTab);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const [settings, setSettings] = useState([
    { id: 'dark-mode', label: 'Dark Mode', desc: 'Switch to a darker interface for night study.', active: false },
    { id: 'push-notifications', label: 'Push Notifications', desc: 'Get alerted when new challenges are released.', active: true },
    { id: 'sound-effects', label: 'Sound Effects', desc: 'Play subtle sounds on successful interactions.', active: true },
    { id: 'haptic-feedback', label: 'Haptic Feedback', desc: 'Vibrate on mobile devices for key actions.', active: false },
  ]);

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => setIsScrolling(false), 1000);
  };

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setToast({ type: 'success', message: 'Message sent successfully!' });
        setContactForm({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'math-facts':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Math Facts</h3>
              <p className="text-zinc-500">Curated trivia from the world of number theory.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Prime Distribution', content: 'Primes become less frequent as numbers get larger, yet there are infinitely many of them.', color: 'bg-emerald-50' },
                { title: 'Perfect Numbers', content: 'A number equal to the sum of its proper divisors (like 6 or 28).', color: 'bg-indigo-50' },
                { title: 'Mersenne Primes', content: 'Primes of the form 2ⁿ - 1. They are closely linked to perfect numbers.', color: 'bg-amber-50' },
                { title: 'Twin Primes', content: 'Pairs of primes that differ by exactly two, like (11, 13) or (17, 19).', color: 'bg-rose-50' },
              ].map((fact, i) => (
                <div key={i} className={cn("p-6 rounded-[24px] border border-black/5 shadow-sm", fact.color)}>
                  <h4 className="font-bold text-zinc-900 mb-2">{fact.title}</h4>
                  <p className="text-sm text-zinc-600 leading-relaxed">{fact.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'learning-tips':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Learning Tips</h3>
              <p className="text-zinc-500">Actionable advice for mastering mathematics.</p>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Master the Basics', text: 'Don\'t rush into complex theories. Ensure your foundation in arithmetic and algebra is rock solid.' },
                { title: 'Visualize Everything', text: 'Use diagrams, graphs, and mental imagery to turn abstract symbols into concrete concepts.' },
                { title: 'Teach to Learn', text: 'Explaining a concept to someone else is the fastest way to identify gaps in your own knowledge.' },
                { title: 'Daily Practice', text: 'Consistency beats intensity. 15 minutes every day is better than a 4-hour session once a week.' },
              ].map((tip, i) => (
                <div key={i} className="flex gap-6 items-start p-6 rounded-[24px] bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 mb-1">{tip.title}</h4>
                    <p className="text-sm text-zinc-600 leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Settings</h3>
              <p className="text-zinc-500">Customize your learning experience.</p>
            </div>
            <div className="space-y-3">
              {settings.map((set, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-[24px] bg-zinc-50 border border-zinc-100">
                  <div className="pr-4">
                    <h4 className="font-bold text-zinc-900">{set.label}</h4>
                    <p className="text-xs text-zinc-500">{set.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleSetting(set.id)}
                    className={cn(
                      "w-12 h-6 rounded-full relative transition-colors duration-300",
                      set.active ? "bg-emerald-500" : "bg-zinc-300"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                      set.active ? "right-1" : "left-1"
                    )} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 'contact':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">Contact Us</h3>
              <p className="text-zinc-500">Have questions or feedback? We'd love to hear from you.</p>
            </div>
            <form className="space-y-4" onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Name</label>
                  <input 
                    type="text" 
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-emerald-500 outline-none transition-all" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    type="email" 
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-emerald-500 outline-none transition-all" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:bg-white focus:border-emerald-500 outline-none transition-all h-32 resize-none" 
                  placeholder="Your message here..." 
                />
              </div>
              <button 
                disabled={isSubmitting}
                className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Message"}
              </button>
            </form>
          </motion.div>
        );
      case 'about':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-black text-zinc-900 tracking-tight mb-2">About / Credits</h3>
              <p className="text-zinc-500">The story behind NT Explorer.</p>
            </div>
            <div className="bg-zinc-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
              <p className="text-zinc-300 leading-relaxed relative z-10">
                NT Explorer was built to bridge the gap between abstract number theory and interactive learning. 
                By combining modern web technologies with advanced AI, we aim to inspire the next generation of mathematicians.
              </p>
              <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-6 relative z-10">
                <div>
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3">Lead Developer</h4>
                  <p className="font-bold">Joshua Bugayong</p>
                </div>
                <div>
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3">AI Model</h4>
                  <p className="font-bold">Gemini 3.1 Pro</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md z-[60]"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[70] p-6 md:p-16 lg:p-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-5xl h-full max-h-[720px] bg-white/70 backdrop-blur-3xl rounded-[40px] border border-white/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] pointer-events-auto overflow-hidden flex flex-col md:flex-row"
            >
              {/* Sidebar */}
              <div 
                onScroll={handleScroll}
                className={cn(
                  "w-full md:w-80 border-b md:border-b-0 md:border-r border-black/5 p-8 flex flex-col overflow-y-auto transition-all duration-300",
                  isScrolling ? "scrollbar-visible" : "scrollbar-hidden"
                )}
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  .scrollbar-hidden::-webkit-scrollbar { width: 0px; background: transparent; }
                  .scrollbar-visible::-webkit-scrollbar { width: 6px; }
                  .scrollbar-visible::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
                `}} />
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
                      <Hash className="w-5 h-5" />
                    </div>
                    <h2 className="text-xs font-black tracking-[0.2em] text-zinc-900 uppercase">Resource Center</h2>
                  </div>
                  <button onClick={onClose} className="md:hidden p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <nav className="flex flex-col gap-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ModalTab)}
                        className={cn(
                          "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group relative",
                          isActive ? "text-white" : "text-zinc-500 hover:text-zinc-900"
                        )}
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="active-tab-bg"
                            className="absolute inset-0 bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-4">
                          <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-emerald-400" : "text-zinc-400 group-hover:text-zinc-900")} />
                          {tab.label}
                        </div>
                        {isActive && (
                          <motion.div 
                            layoutId="active-pill"
                            className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-full z-20"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-auto pt-8 border-t border-black/5 hidden md:block">
                  <div className="p-4 rounded-2xl bg-zinc-900/5 border border-black/5">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2">
                      {isOnline && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                      <p className={cn("text-xs font-bold", isOnline ? "text-zinc-900" : "text-zinc-400")}>
                        System {isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 md:p-16 relative bg-white/30">
                <button 
                  onClick={onClose} 
                  className="hidden md:flex absolute top-10 right-10 p-3 rounded-full bg-white/50 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-300 shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="max-w-2xl mx-auto">
                  {renderContent()}
                </div>

                {/* Toast Notification */}
                <AnimatePresence>
                  {toast && (
                    <motion.div
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      className={cn(
                        "fixed bottom-8 right-8 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100]",
                        toast.type === 'success' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                      )}
                    >
                      {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      <span className="font-bold text-sm">{toast.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
