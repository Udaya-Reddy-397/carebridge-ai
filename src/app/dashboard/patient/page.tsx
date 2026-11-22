"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import {
  getSeedStore,
  loadStore,
  saveStore,
  INITIAL_TASKS,
} from "@/lib/mock-data";
import { AppHeader } from "@/components/AppHeader";
import { TaskCard } from "@/components/TaskCard";
import { SahaayakChat } from "@/components/SahaayakChat";
import { MotionCard } from "@/components/MotionCard";
import { CareTask, User, TaskStatus } from "@/types";
import { v4 as uuid } from "uuid";

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const u = getCurrentUser();
    if (!u || u.role === "doctor") {
      router.replace("/login");
      return;
    }
    setUser(u);

    // Load or seed store
    let store = loadStore();
    if (!store) {
      store = getSeedStore();
      saveStore(store);
    }
    // Show tasks for this patient (or all demo patient tasks if new user)
    const myTasks = store.tasks.filter(
      (t: CareTask) =>
        t.patientId === u.id ||
        t.patientName.toLowerCase().includes(u.name.split(" ")[0].toLowerCase()) ||
        // fallback: show Priya's tasks for any new patient demo
        (u.id.startsWith("u_") && t.patientId === "p1")
    );
    setTasks(myTasks.length ? myTasks : store.tasks.filter((t: CareTask) => t.patientId === "p1"));
  }, [router]);

  const persist = useCallback(
    (nextTasks: CareTask[]) => {
      setTasks(nextTasks);
      const store = loadStore() || getSeedStore();
      // merge back into full list
      const others = store.tasks.filter(
        (t: CareTask) => !nextTasks.find((nt) => nt.id === t.id)
      );
      store.tasks = [...others, ...nextTasks];
      saveStore(store);
    },
    []
  );

  const handleAction = (
    taskId: string,
    action: "acknowledge" | "complete" | "help"
  ) => {
    const next = tasks.map((t) => {
      if (t.id !== taskId) return t;
      if (action === "acknowledge") {
        return {
          ...t,
          status: "acknowledged" as TaskStatus,
          acknowledgedAt: new Date().toISOString(),
        };
      }
      if (action === "complete") {
        return {
          ...t,
          status: "completed" as TaskStatus,
          completedAt: new Date().toISOString(),
        };
      }
      return {
        ...t,
        status: "help_requested" as TaskStatus,
        notes: "Patient requested help",
      };
    });
    persist(next);

    // add audit
    const store = loadStore() || getSeedStore();
    store.audit = [
      {
        id: uuid(),
        action:
          action === "acknowledge"
            ? "Task acknowledged"
            : action === "complete"
            ? "Task completed"
            : "Help requested",
        actor: user?.name || "Patient",
        actorRole: "patient",
        targetId: taskId,
        timestamp: new Date().toISOString(),
      },
      ...store.audit,
    ];
    saveStore(store);
  };

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const counts = {
    pending: tasks.filter((t) => t.status === "pending").length,
    acknowledged: tasks.filter((t) => t.status === "acknowledged").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter((t) => t.status === "overdue" || t.status === "help_requested").length,
  };

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader user={user} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Hello, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Your care tasks and Sahaayak assistant
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Pending", value: counts.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Acknowledged", value: counts.acknowledged, icon: ClipboardList, color: "text-sky-600 bg-sky-50" },
            { label: "Completed", value: counts.completed, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
            { label: "Needs attention", value: counts.overdue, icon: AlertTriangle, color: "text-rose-600 bg-rose-50" },
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

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Tasks */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-brand-500" />
                Your tasks
              </h2>
              <div className="flex gap-1 flex-wrap">
                {(["all", "pending", "acknowledged", "completed", "overdue"] as const).map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`text-xs px-2.5 py-1 rounded-lg capitalize transition-colors ${
                        filter === f
                          ? "bg-brand-500 text-white"
                          : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-100"
                      }`}
                    >
                      {f === "all" ? "All" : f.replace("_", " ")}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No tasks in this filter
                </div>
              ) : (
                filtered.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onAction={handleAction}
                  />
                ))
              )}
            </div>
          </div>

          {/* Sahaayak */}
          <div className="lg:col-span-2">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-brand-500" />
              Sahaayak AI Assistant
            </h2>
            <SahaayakChat />
          </div>
        </div>
      </main>
    </div>
  );
}
