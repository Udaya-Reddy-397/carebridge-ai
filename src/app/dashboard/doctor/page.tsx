"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  History,
  Plus,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import {
  getSeedStore,
  loadStore,
  saveStore,
  INITIAL_TASKS,
  DEMO_PATIENTS,
} from "@/lib/mock-data";
import { AppHeader } from "@/components/AppHeader";
import { TaskCard } from "@/components/TaskCard";
import { MotionCard } from "@/components/MotionCard";
import { StatusBadge } from "@/components/StatusBadge";
import { CareTask, User, AuditEntry, TaskStatus } from "@/types";
import { formatDate } from "@/lib/utils";
import { v4 as uuid } from "uuid";

export default function DoctorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [tab, setTab] = useState<"overdue" | "all" | "audit">("overdue");
  const [mounted, setMounted] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPatient, setNewPatient] = useState(DEMO_PATIENTS[0].id);

  useEffect(() => {
    setMounted(true);
    const u = getCurrentUser();
    if (!u || u.role !== "doctor") {
      router.replace("/login");
      return;
    }
    setUser(u);
    refresh();
  }, [router]);

  const refresh = () => {
    let store = loadStore();
    if (!store) {
      store = getSeedStore();
      saveStore(store);
    }
    // Auto-mark overdue
    const now = new Date();
    const updated = store.tasks.map((t: CareTask) => {
      if (
        (t.status === "pending" || t.status === "acknowledged") &&
        new Date(t.dueDate) < now
      ) {
        return { ...t, status: "overdue" as TaskStatus };
      }
      return t;
    });
    store.tasks = updated;
    saveStore(store);
    setTasks(updated);
    setAudit(store.audit || []);
  };

  const handleReview = (taskId: string, decision: "close" | "reopen") => {
    const next = tasks.map((t) => {
      if (t.id !== taskId) return t;
      if (decision === "close") {
        return { ...t, status: "completed" as TaskStatus, completedAt: new Date().toISOString() };
      }
      return { ...t, status: "pending" as TaskStatus };
    });
    setTasks(next);
    const store = loadStore() || getSeedStore();
    store.tasks = next;
    store.audit = [
      {
        id: uuid(),
        action: decision === "close" ? "Provider closed task" : "Provider reopened task",
        actor: user?.name || "Doctor",
        actorRole: "doctor",
        targetId: taskId,
        timestamp: new Date().toISOString(),
      },
      ...store.audit,
    ];
    saveStore(store);
    setAudit(store.audit);
  };

  const assignTask = () => {
    if (!newTitle.trim()) return;
    const patient = DEMO_PATIENTS.find((p) => p.id === newPatient)!;
    const task: CareTask = {
      id: uuid(),
      title: newTitle.trim(),
      description: "Assigned by provider via Care Intelligence dashboard.",
      patientId: patient.id,
      patientName: patient.name,
      ownerId: patient.id,
      ownerName: patient.name,
      ownerRole: "patient",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending",
      createdAt: new Date().toISOString(),
      priority: "medium",
      category: "other",
    };
    const next = [task, ...tasks];
    setTasks(next);
    const store = loadStore() || getSeedStore();
    store.tasks = next;
    store.audit = [
      {
        id: uuid(),
        action: "Task assigned",
        actor: user?.name || "Doctor",
        actorRole: "doctor",
        targetId: task.id,
        timestamp: new Date().toISOString(),
        details: `${task.title} → ${patient.name}`,
      },
      ...store.audit,
    ];
    saveStore(store);
    setAudit(store.audit);
    setNewTitle("");
    setShowAssign(false);
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const overdue = tasks.filter(
    (t) => t.status === "overdue" || t.status === "help_requested"
  );
  const pending = tasks.filter((t) => t.status === "pending" || t.status === "acknowledged");
  const completed = tasks.filter((t) => t.status === "completed");

  const displayTasks =
    tab === "overdue" ? overdue : tab === "all" ? tasks : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader user={user} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Care Intelligence
            </h1>
            <p className="text-slate-500 mt-1">
              Unfinished care surfaces here. You decide.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAssign(true)}
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Assign task
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Overdue / Help", value: overdue.length, icon: AlertTriangle, color: "text-rose-600 bg-rose-50" },
            { label: "In progress", value: pending.length, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Completed", value: completed.length, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
            { label: "Patients", value: DEMO_PATIENTS.length, icon: Users, color: "text-sky-600 bg-sky-50" },
          ].map((s, i) => (
            <MotionCard key={s.label} delay={i * 0.05} className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2">
          {[
            { id: "overdue" as const, label: "Needs review", icon: AlertTriangle },
            { id: "all" as const, label: "All tasks", icon: Activity },
            { id: "audit" as const, label: "Audit log", icon: History },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                tab === t.id
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {tab !== "audit" ? (
          <div className="space-y-3">
            {displayTasks.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>Nothing needs your attention right now.</p>
              </div>
            ) : (
              displayTasks.map((task) => (
                <div key={task.id} className="relative">
                  <TaskCard task={task} showPatient />
                  {(task.status === "overdue" || task.status === "help_requested") && (
                    <div className="mt-2 flex gap-2 pl-1">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleReview(task.id, "close")}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                      >
                        Mark resolved
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleReview(task.id, "reopen")}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                      >
                        Reopen as pending
                      </motion.button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
            <div className="divide-y divide-slate-50">
              {audit.slice(0, 30).map((entry) => (
                <div key={entry.id} className="px-5 py-3.5 flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800">{entry.action}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {entry.actor} · {entry.actorRole}
                      {entry.details ? ` · ${entry.details}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
              ))}
              {audit.length === 0 && (
                <p className="p-8 text-center text-slate-400 text-sm">No audit entries yet</p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Assign modal */}
      {showAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
          >
            <h3 className="font-semibold text-lg text-slate-900 mb-4">Assign new task</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Patient</label>
                <select
                  value={newPatient}
                  onChange={(e) => setNewPatient(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                >
                  {DEMO_PATIENTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Task title</label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Repeat lipid profile in 2 weeks"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40"
                  autoFocus
                />
              </div>
            </div>
            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setShowAssign(false)}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={assignTask}
                className="px-4 py-2 text-sm font-semibold bg-brand-500 text-white rounded-xl hover:bg-brand-600"
              >
                Assign
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
