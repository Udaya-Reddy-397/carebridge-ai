"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, Mail, ArrowRight, ShieldCheck, Stethoscope, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentUser, loginWithEmail, isValidEmail } from "@/lib/auth";
import { UserRole } from "@/types";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"google" | "email" | "role">("google");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.replace(
        user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient"
      );
    }
  }, [router]);

  const handleGoogleClick = () => {
    // Demo flow: simulate Google consent then ask for email (real Google OAuth needs client IDs)
    setStep("email");
  };

  const handleEmailContinue = () => {
    setError("");
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address (e.g. you@gmail.com)");
      return;
    }
    setStep("role");
  };

  const handleRoleSelect = (role: UserRole) => {
    setLoading(true);
    // Simulate network
    setTimeout(() => {
      loginWithEmail(email, role, name || undefined);
      router.push(role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient");
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-brand-50/40 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to CareBridge</h1>
          <p className="mt-1 text-slate-500 text-sm">
            Sign in with your Google account to continue
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6">
          <AnimatePresence mode="wait">
            {step === "google" && (
              <motion.div
                key="google"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleClick}
                  className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-medium py-3.5 px-4 rounded-xl transition-all shadow-sm hover:shadow"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </motion.button>
                <p className="mt-4 text-xs text-center text-slate-400">
                  Demo mode: we ask for your real email after Google-style consent.
                  Production would use official Google OAuth.
                </p>
              </motion.div>
            )}

            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Your Google email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 text-sm"
                      autoFocus
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Display name (optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 text-sm"
                  />
                </div>
                {error && (
                  <p className="text-sm text-rose-600">{error}</p>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmailContinue}
                  className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <button
                  onClick={() => setStep("google")}
                  className="w-full text-sm text-slate-400 hover:text-slate-600"
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {step === "role" && (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-3"
              >
                <p className="text-sm text-slate-600 text-center mb-2">
                  Continue as
                </p>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  onClick={() => handleRoleSelect("patient")}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-brand-300 hover:bg-brand-50/50 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Patient</p>
                    <p className="text-xs text-slate-500">
                      View tasks, acknowledge & complete care actions
                    </p>
                  </div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  onClick={() => handleRoleSelect("doctor")}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-slate-100 hover:border-accent-300 hover:bg-accent-50/50 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Doctor / Provider</p>
                    <p className="text-xs text-slate-500">
                      Care Intelligence dashboard & overdue review
                    </p>
                  </div>
                </motion.button>
                {loading && (
                  <p className="text-center text-sm text-slate-400 animate-pulse">
                    Signing you in…
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Demo only · Synthetic data · No real PHI stored
        </p>
      </motion.div>
    </div>
  );
}
