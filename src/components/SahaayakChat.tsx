"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, BookOpen, AlertCircle } from "lucide-react";
import { ChatMessage } from "@/types";
import { generateSahaayakReply } from "@/lib/sahaayak";
import { v4 as uuid } from "uuid";
import { cn } from "@/lib/utils";

export function SahaayakChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Namaste! I am Sahaayak. I explain your care instructions in plain English or Hindi using only approved sources. I never diagnose or prescribe. Ask me about any task in your plan.",
      sources: ["Sahaayak introduction"],
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;
    const userMsg: ChatMessage = {
      id: uuid(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    // Simulate thinking delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
    const reply = generateSahaayakReply(text);
    setMessages((m) => [...m, reply]);
    setTyping(false);
  };

  return (
    <div className="flex flex-col h-[420px] bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-brand-50 to-accent-50 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-semibold text-sm text-slate-900">Sahaayak AI</p>
          <p className="text-xs text-slate-500">Explains · Cites · Never diagnoses</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-2",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-brand-600" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm",
                  msg.role === "user"
                    ? "bg-brand-500 text-white rounded-br-md"
                    : "bg-slate-50 text-slate-800 rounded-bl-md border border-slate-100"
                )}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && msg.role === "assistant" && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Sources
                    </p>
                    <ul className="space-y-0.5">
                      {msg.sources.map((s, i) => (
                        <li key={i} className="text-xs text-slate-500">
                          · {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-slate-600" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex gap-2 items-center text-slate-400 text-sm">
            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-brand-600" />
            </div>
            <span className="animate-pulse">Thinking…</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask about a test, medicine, or task… (English or Hindi)"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={send}
            disabled={!input.trim() || typing}
            className="rounded-xl bg-brand-500 text-white p-2.5 disabled:opacity-40 hover:bg-brand-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          AI with boundaries · Citations shown · Urgent symptoms trigger fixed pathway
        </p>
      </div>
    </div>
  );
}
