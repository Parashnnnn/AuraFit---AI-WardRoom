import React, { useState } from 'react';
import { Mail, ArrowUpRight, Copy, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const contactName = 'Parash Pratim Bhardwaj';
  const emailAddress = 'parashpratimbhardwaj07@gmail.com';

  const emailSubject = encodeURIComponent('AuraFit — Stylist Feedback & Query');
  const emailBody = encodeURIComponent(
    'Hi Parash,\n\nI have a question / suggestion / feedback regarding AuraFit:\n\n[Your note here]\n\nWarm regards,'
  );

  const mailtoUrl = `mailto:${emailAddress}?subject=${emailSubject}&body=${emailBody}`;

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact-section" className="relative py-12 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-white/80 dark:bg-[#1A1924]/80 backdrop-blur-xl border border-[#E8E2D9] dark:border-[#2D2A3B] shadow-xl text-center relative overflow-hidden">
          {/* Corner Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#8B5CF6]/20 to-[#F472B6]/20 blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] dark:text-[#A78BFA] text-xs font-semibold tracking-widest uppercase mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>DIRECT DIALOGUE</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight uppercase text-neutral-900 dark:text-white">
            LET&apos;S TALK.
          </h2>

          <p className="font-serif italic text-base sm:text-lg text-neutral-600 dark:text-neutral-300 mt-2 max-w-md mx-auto">
            “Have a question, suggestion or issue with AuraFit?”
          </p>

          <div className="my-6 py-5 border-y border-neutral-200/70 dark:border-neutral-800/80 max-w-md mx-auto">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono mb-1">
              Founder &amp; Engineering Lead
            </p>
            <p className="font-display text-lg sm:text-xl font-bold text-neutral-900 dark:text-white tracking-wide">
              {contactName}
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-mono mt-1">
              {emailAddress}
            </p>
          </div>

          {/* Continuous Arc pointing into the Email Button */}
          <div className="flex justify-center mb-4">
            <svg className="w-48 h-6 opacity-60" viewBox="0 0 200 30" fill="none">
              <motion.path
                d="M 10 5 Q 100 28 190 5"
                stroke="url(#contactBtnArc)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
              />
              <defs>
                <linearGradient id="contactBtnArc" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#F472B6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {/* Clickable Mailto Action */}
            <a
              id="btn-email-aurafit"
              href={mailtoUrl}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1C1B1F] dark:bg-[#8B5CF6] hover:bg-black dark:hover:bg-[#7C3AED] text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20 transition-all duration-300 group cursor-pointer"
            >
              <span>EMAIL US →</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Copy Email Button */}
            <button
              id="btn-copy-email"
              onClick={copyEmail}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700/80 text-neutral-800 dark:text-neutral-200 text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer border border-neutral-200 dark:border-neutral-700"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Email Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-neutral-500" />
                  <span>Copy Address</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Opens your default email client directly</span>
          </div>
        </div>
      </div>
    </section>
  );
};
