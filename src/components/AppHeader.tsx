"use client";

import { motion } from "framer-motion";
import { HeartPulse, LogOut, User as UserIcon } from "lucide-react";
import { User } from "@/types";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function AppHeader({ user }: { user: User }) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.1 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-sm"
          >
            <HeartPulse className="w-4 h-4 text-white" />
          </motion.div>
          <div>
            <p className="font-bold text-sm text-slate-900 leading-none">CareBridge AI</p>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">
              Understand · Complete · Close the loop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
            <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
              <UserIcon className="w-3.5 h-3.5 text-brand-600" />
            </div>
            <div className="text-right">
              <p className="font-medium text-slate-800 leading-none">{user.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Log out
          </motion.button>
        </div>
      </div>
    </header>
  );
}
