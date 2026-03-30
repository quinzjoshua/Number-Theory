import React from 'react';
import { Hash, Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden bg-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex flex-wrap gap-10 p-10 font-mono text-8xl font-bold text-zinc-900">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i}>{Math.floor(Math.random() * 1000)}</span>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-600 text-sm font-medium mb-6">
            <Hash className="w-4 h-4" />
            <span>The Queen of Mathematics</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-zinc-900 tracking-tighter mb-8">
            NUMBER <br />
            <span className="text-emerald-500">THEORY</span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Explore the hidden patterns of the universe. From prime numbers to cryptography, 
            discover why numbers are the foundation of everything.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Interactive Tools", desc: "Play with prime factors, GCD, and modular arithmetic in real-time." },
            { icon: Shield, title: "AI Powered", desc: "Get instant answers and image analysis from our advanced Gemini integration." },
            { icon: Globe, title: "Virtual Lessons", desc: "Access immersive digital learning experiences and interactive number theory modules." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (i + 1) }}
              className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 hover:border-emerald-200 transition-colors group"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">{feature.title}</h3>
              <p className="text-zinc-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
