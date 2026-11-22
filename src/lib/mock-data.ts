import { CarePlan, CareTask, User, AuditEntry } from "@/types";
import { v4 as uuid } from "uuid";

export const DEMO_PATIENTS: User[] = [
  {
    id: "p1",
    email: "priya.sharma@gmail.com",
    name: "Priya Sharma",
    role: "patient",
  },
  {
    id: "p2",
    email: "rahul.verma@gmail.com",
    name: "Rahul Verma",
    role: "patient",
  },
  {
    id: "p3",
    email: "anita.desai@gmail.com",
    name: "Anita Desai",
    role: "patient",
  },
];

export const DEMO_DOCTOR: User = {
  id: "d1",
  email: "dr.mehta@clinic.in",
  name: "Dr. Ananya Mehta",
  role: "doctor",
};

const now = new Date();
const days = (n: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const INITIAL_TASKS: CareTask[] = [
  {
    id: "t1",
    title: "Complete blood test (CBC + HbA1c)",
    description:
      "Fasting blood sample required. Go to the lab between 8–10 AM. Bring the form given at the clinic.",
    patientId: "p1",
    patientName: "Priya Sharma",
    ownerId: "p1",
    ownerName: "Priya Sharma",
    ownerRole: "patient",
    dueDate: days(2),
    status: "pending",
    createdAt: days(-1),
    priority: "high",
    category: "test",
  },
  {
    id: "t2",
    title: "Follow-up visit – Diabetes review",
    description:
      "Bring recent sugar readings and the blood report. Appointment window: 10:00–11:30.",
    patientId: "p1",
    patientName: "Priya Sharma",
    ownerId: "p1",
    ownerName: "Priya Sharma",
    ownerRole: "patient",
    dueDate: days(7),
    status: "acknowledged",
    createdAt: days(-2),
    acknowledgedAt: days(-1),
    priority: "medium",
    category: "visit",
  },
  {
    id: "t3",
    title: "Daily morning walk 30 minutes",
    description:
      "Brisk walk preferred. If knee pain increases, rest and note it for the next visit.",
    patientId: "p1",
    patientName: "Priya Sharma",
    ownerId: "p1",
    ownerName: "Priya Sharma",
    ownerRole: "patient",
    dueDate: days(0),
    status: "completed",
    createdAt: days(-5),
    completedAt: days(-1),
    priority: "low",
    category: "home_care",
  },
  {
    id: "t4",
    title: "Take Metformin 500 mg after dinner",
    description:
      "Do not skip. If stomach upset occurs for more than 2 days, contact the clinic.",
    patientId: "p2",
    patientName: "Rahul Verma",
    ownerId: "p2",
    ownerName: "Rahul Verma",
    ownerRole: "patient",
    dueDate: days(-1),
    status: "overdue",
    createdAt: days(-10),
    priority: "high",
    category: "medication",
  },
  {
    id: "t5",
    title: "Chest X-ray appointment",
    description: "Report to radiology at City Hospital. No special preparation needed.",
    patientId: "p2",
    patientName: "Rahul Verma",
    ownerId: "p2",
    ownerName: "Rahul Verma",
    ownerRole: "patient",
    dueDate: days(3),
    status: "pending",
    createdAt: days(-1),
    priority: "medium",
    category: "test",
  },
  {
    id: "t6",
    title: "Seek help if fever > 101°F or breathing difficulty",
    description:
      "Contact emergency or the clinic helpline immediately. Do not wait for next appointment.",
    patientId: "p3",
    patientName: "Anita Desai",
    ownerId: "p3",
    ownerName: "Anita Desai",
    ownerRole: "patient",
    dueDate: days(14),
    status: "acknowledged",
    createdAt: days(-3),
    acknowledgedAt: days(-2),
    priority: "high",
    category: "seek_help",
  },
];

export const INITIAL_PLANS: CarePlan[] = [
  {
    id: "cp1",
    patientId: "p1",
    patientName: "Priya Sharma",
    title: "Type 2 Diabetes – 3 month plan",
    summary:
      "Focus on glycaemic control, lifestyle and timely labs. Next formal review in 8 weeks.",
    createdBy: "Dr. Ananya Mehta",
    createdAt: days(-14),
    tasks: INITIAL_TASKS.filter((t) => t.patientId === "p1"),
  },
  {
    id: "cp2",
    patientId: "p2",
    patientName: "Rahul Verma",
    title: "Post-discharge respiratory follow-up",
    summary: "Monitor recovery after recent lower respiratory infection.",
    createdBy: "Dr. Ananya Mehta",
    createdAt: days(-7),
    tasks: INITIAL_TASKS.filter((t) => t.patientId === "p2"),
  },
];

export const INITIAL_AUDIT: AuditEntry[] = [
  {
    id: uuid(),
    action: "Task assigned",
    actor: "Dr. Ananya Mehta",
    actorRole: "doctor",
    targetId: "t1",
    timestamp: days(-1),
    details: "CBC + HbA1c assigned to Priya Sharma",
  },
  {
    id: uuid(),
    action: "Task acknowledged",
    actor: "Priya Sharma",
    actorRole: "patient",
    targetId: "t2",
    timestamp: days(-1),
    details: "Follow-up visit acknowledged",
  },
];

// Simple in-browser store helpers (used by client components)
const STORAGE_KEY = "carebridge_demo_v1";

export function loadStore() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStore(data: {
  tasks: CareTask[];
  plans: CarePlan[];
  audit: AuditEntry[];
  user?: User | null;
}) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getSeedStore() {
  return {
    tasks: INITIAL_TASKS,
    plans: INITIAL_PLANS,
    audit: INITIAL_AUDIT,
    user: null as User | null,
  };
}
