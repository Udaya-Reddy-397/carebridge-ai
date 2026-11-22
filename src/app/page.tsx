"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HeartPulse,
  ArrowRight,
  Shield,
  WifiOff,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

const features = [
  {
    icon: CheckCircle2,
    title: "Follow-up Loop",
    desc: "Pending → Acknowledged → Completed / Help → Provider review. Nothing falls through.",
  },
  {
    icon: Sparkles,
    title: "Sahaayak AI",
    desc: "Plain English & Hindi explanations with citations. Never diagnoses or prescribes.",
  },
  {
    icon: Users,
    title: "Caregiver Connect",
    desc: "Patient-authorised, scoped & revocable access. Every action is attributed.",
  },
  {
    icon: WifiOff,
    title: "Offline Support",
    desc: "Plans & tasks readable offline. Updates queue and sync when you reconnect.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getCurrentUser();
    if (user) {
      router.replace(
        user.role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient"
      );
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-brand-50/30">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-sm">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900">CareBridge AI</span>
        </div>
        <Link href="/login">
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors"
          >
            Sign in
          </motion.button>
        </Link>
      </nav>

      <section className="max-w-6xl mx-auto px-4 pt-12 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full mb-4">
                <Shield className="w-3.5 h-3.5" />
                VITB – JHU Health-Hack 2027
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                Closing the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-accent-500">
                  instruction-to-action
                </span>{" "}
                gap in healthcare
              </h1>
              <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-lg">
                Understand the care. Complete the task. Close the loop. CareBridge turns
                healthcare instructions into owned, tracked actions—even offline and in Hindi.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-brand-500/25 transition-colors"
                  >
                    Continue with Google
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <motion.a
                  href="#features"
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-2 text-slate-600 font-medium px-5 py-3 rounded-xl border border-slate-200 hover:bg-white transition-colors"
                >
                  See how it works
                </motion.a>
              </div>
            </motion.div>
          </div>

          <div className="relative h-[340px] hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8, rotate: -1 }}
              className="absolute top-4 right-8 w-64 bg-white rounded-2xl shadow-hover border border-slate-100 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs font-medium text-slate-500">Pending</span>
              </div>
              <p className="font-semibold text-sm">Complete blood test (CBC)</p>
              <p className="text-xs text-slate-400 mt-1">Due in 2 days · Owner: You</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              whileHover={{ y: -8, rotate: 1 }}
              className="absolute top-32 left-4 w-60 bg-white rounded-2xl shadow-hover border border-slate-100 p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-slate-500">Completed</span>
              </div>
              <p className="font-semibold text-sm">Morning walk 30 min</p>
              <p className="text-xs text-slate-400 mt-1">Logged yesterday</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -8 }}
              className="absolute bottom-2 right-16 w-56 bg-gradient-to-br from-brand-500 to-accent-500 rounded-2xl shadow-lg p-4 text-white"
            >
              <p className="text-xs opacity-80 mb-1">Sahaayak says</p>
              <p className="text-sm font-medium leading-snug">
                Fasting required. Water is OK after midnight.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Six connected modules</h2>
          <p className="mt-2 text-slate-500">
            Built for completion, not information alone.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        <p>
          CareBridge AI · Team CareBridge · VIT Bhopal University · JHU Health-Hack 2027
        </p>
        <p className="mt-1 text-xs">
          Prototype for demonstration. No clinical outcome claims. Synthetic data only.
        </p>
      </footer>
    </div>
  );
}
