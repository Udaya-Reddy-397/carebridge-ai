"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

export function MotionCard({ children, className, onClick, delay = 0 }: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, type: "spring", stiffness: 120 }}
      whileHover={{
        y: -6,
        scale: 1.02,
        rotateX: 2,
        rotateY: -1,
        boxShadow: "0 20px 40px -12px rgba(14, 165, 233, 0.18)",
      }}
      whileTap={{ scale: 0.98 }}
      style={{ transformPerspective: 1000 }}
      onClick={onClick}
      className={cn(
        "bg-white rounded-2xl border border-slate-100 shadow-card p-5 cursor-default transition-colors",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
