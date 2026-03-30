import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Hash, Menu, X, MoreHorizontal, Calculator, Lightbulb, Settings, Mail, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import OverflowModal, { ModalTab } from './OverflowModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<ModalTab>('math-facts');
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const sections = ['practice', 'tools', 'lessons', 'home'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const threshold = window.innerHeight * 0.4;
          
          // Special case for practice: if we've scrolled past it, keep it active
          if (section === 'practice' && rect.top <= threshold) {
            return true;
          }
          
          return rect.top <= threshold && rect.bottom >= threshold;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home', href: '#' },
    { name: 'Learn', id: 'lessons', href: '#lessons' },
    { name: 'Tools', id: 'tools', href: '#tools' },
    { name: 'Practice', id: 'practice', href: '#practice' },
  ];

  const overflowItems = [
    { id: 'math-facts', name: 'Math Facts', icon: Calculator },
    { id: 'learning-tips', name: 'Learning Tips', icon: Lightbulb },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'contact', name: 'Contact Us', icon: Mail },
    { id: 'about', name: 'About / Credits', icon: Info },
  ] as const;

  const openModal = (tab: ModalTab) => {
    setActiveModalTab(tab);
    setIsModalOpen(true);
    setIsOverflowOpen(false);
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-4",
        isScrolled ? "pt-4" : "pt-8"
      )}>
        <div className={cn(
          "max-w-5xl mx-auto rounded-2xl transition-all duration-300 flex items-center justify-between px-6 py-3",
          isScrolled ? "bg-white/80 backdrop-blur-xl shadow-lg border border-white/20" : "bg-transparent"
        )}>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-zinc-200">
              <Hash className="w-6 h-6" />
            </div>
            <span className="font-black text-xl tracking-tighter text-zinc-900">NT EXPLORER</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-zinc-100/50 p-1 rounded-xl border border-black/5">
              {navLinks.map((link) => (
                <button 
                  key={link.id} 
                  onClick={() => scrollToSection(link.id)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-bold transition-colors uppercase tracking-widest rounded-lg",
                    activeSection === link.id ? "text-white" : "text-zinc-500 hover:text-zinc-900"
                  )}
                >
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-200"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </button>
              ))}
            </div>
            
            <div className="w-px h-6 bg-zinc-200 mx-2" />

            {/* Overflow Menu Desktop */}
            <div className="relative">
              <button 
                onClick={() => setIsOverflowOpen(!isOverflowOpen)}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  isOverflowOpen ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                )}
                aria-label="More options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {isOverflowOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-[-1]" 
                    onClick={() => setIsOverflowOpen(false)} 
                  />
                  <div className="absolute top-full right-0 mt-4 w-60 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-100 p-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 mb-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Resources</p>
                    </div>
                    {overflowItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => openModal(item.id as ModalTab)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all group"
                        >
                          <Icon className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                          {item.name}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          <button 
            className="md:hidden p-2 text-zinc-900"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-2xl border border-zinc-100 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
            {navLinks.map((link) => (
              <button 
                key={link.id} 
                onClick={() => scrollToSection(link.id)}
                className={cn(
                  "text-left text-lg font-bold transition-colors",
                  activeSection === link.id ? "text-emerald-600" : "text-zinc-900"
                )}
              >
                {link.name}
              </button>
            ))}
            <div className="h-px bg-zinc-100 my-2" />
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Resource Center</p>
            <div className="grid grid-cols-2 gap-3">
              {overflowItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => openModal(item.id as ModalTab)}
                  className="flex flex-col gap-2 p-4 rounded-2xl bg-zinc-50 text-left hover:bg-zinc-100 transition-colors"
                >
                  <item.icon className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-bold text-zinc-900">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <OverflowModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialTab={activeModalTab}
      />
    </>
  );
}
