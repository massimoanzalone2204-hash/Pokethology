import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Copy, Check, User, BrainCircuit, Globe } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface ChatMessageItemProps {
  msg: { role: string; text: string };
  isLightMode: boolean;
  sounds?: any;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ msg, isLightMode, sounds }) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (isSpeaking && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  const handleTTS = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = msg.text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      .replace(/^#+\s+/gm, '')
      .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .replace(/^\s*>\s+/gm, '')
      .replace(/^\s*[\*\-\+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/\|/g, ', ')
      .replace(/[\n\r]+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen')));
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    try { sounds?.button?.(); } catch (_) {}
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    try { sounds?.scan?.(); } catch (_) {}
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = msg.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex w-full gap-2.5 py-3 relative z-10 border-b border-cyan-900/20 last:border-0",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn("shrink-0 mt-1 flex items-center justify-center", isUser ? (isLightMode ? 'text-slate-500' : 'text-slate-400') : (isLightMode ? 'text-cyan-600' : 'text-cyan-400'))}>
        {isUser ? <User className="w-4 h-4" /> : <BrainCircuit className="w-4 h-4" />}
      </div>
      <div className={cn("flex flex-col w-full min-w-0 max-w-[85%]", isUser ? "items-end" : "items-start")}>
        <div className="flex items-center justify-between w-full mb-1">
          <span className={cn("text-[7px] font-hud font-bold uppercase tracking-widest", isUser ? "text-slate-500" : "text-cyan-500/70")}>
            {isUser ? 'Operator' : 'Pokéthology AI'}
          </span>

          {/* Hear and Copy buttons for AI messages */}
          {!isUser && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleTTS}
                onMouseEnter={() => sounds?.hover?.()}
                className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-hud font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer border",
                  isSpeaking
                    ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-pulse"
                    : isLightMode
                      ? "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                      : "bg-cyan-950/60 border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/60 hover:border-cyan-400"
                )}
                title={isSpeaking ? "Stop Speaking" : "Listen to Message"}
              >
                {isSpeaking ? <VolumeX className="w-3 h-3 text-slate-950" /> : <Volume2 className="w-3 h-3" />}
                <span>{isSpeaking ? "STOP" : "HEAR"}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                onMouseEnter={() => sounds?.hover?.()}
                className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-hud font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer border",
                  copied
                    ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    : isLightMode
                      ? "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                      : "bg-cyan-950/60 border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/60 hover:border-cyan-400"
                )}
                title="Copy Message"
              >
                {copied ? <Check className="w-3 h-3 text-slate-950" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "COPIED" : "COPY"}</span>
              </button>
            </div>
          )}
        </div>

        <div className={cn(
          "markdown-body select-text text-[11px] sm:text-[12px] font-sans leading-relaxed break-words rounded-xl px-3 py-2 text-left w-full",
          isUser
            ? (isLightMode ? "bg-slate-200 text-slate-800" : "bg-slate-800 text-slate-200")
            : (isLightMode ? "bg-slate-100/90 text-cyan-950 border border-slate-200" : "bg-slate-900/80 text-cyan-100 border border-cyan-900/40")
        )}>
          <Markdown
            components={{
              a: ({ href, children }) => (
                <span className="inline-block">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline font-semibold inline-flex items-center gap-1"
                  >
                    {children}
                    <Globe className="w-2.5 h-2.5 inline text-cyan-400/80" />
                  </a>
                </span>
              )
            }}
          >
            {msg.text}
          </Markdown>
        </div>
      </div>
    </motion.div>
  );
};
