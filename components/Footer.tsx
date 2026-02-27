'use client';

import { motion } from 'motion/react';
import { Download, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-32 px-6 z-10 bg-black/80 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-space text-5xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20"
        >
          Ready to go local?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mb-16 font-light"
        >
          Join the resistance. Download NELA and take back control of your knowledge intelligence today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: 'spring', bounce: 0.5 }}
          className="mb-32"
        >
          <button className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#00ffcc] text-black rounded-full font-bold text-xl overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,255,204,0.3)] hover:shadow-[0_0_60px_rgba(0,255,204,0.5)]">
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center gap-2">
              <Download className="w-6 h-6" />
              Download NELA
            </span>
          </button>
        </motion.div>

        <div className="w-full border-t border-white/10 pt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-space text-2xl font-bold tracking-tighter">NELA</div>
          
          <div className="flex gap-6 text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
          </div>
          
          <div className="text-sm text-gray-600 font-mono">
            © {new Date().getFullYear()} NELA Intelligence. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
