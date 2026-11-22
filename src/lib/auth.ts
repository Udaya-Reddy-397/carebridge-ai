"use client";

import { User, UserRole } from "@/types";
import { DEMO_DOCTOR, DEMO_PATIENTS } from "./mock-data";

const USER_KEY = "carebridge_user";

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
  // also trigger storage event for other tabs
  window.dispatchEvent(new Event("carebridge-auth-change"));
}

export function loginWithEmail(email: string, role: UserRole, name?: string): User {
  const normalized = email.trim().toLowerCase();
  // Prefer demo identities when email matches
  if (role === "doctor") {
    const u = { ...DEMO_DOCTOR, email: normalized, name: name || DEMO_DOCTOR.name };
    setCurrentUser(u);
    return u;
  }
  const existing = DEMO_PATIENTS.find((p) => p.email === normalized);
  const u: User = existing
    ? { ...existing }
    : {
        id: `u_${Date.now()}`,
        email: normalized,
        name: name || normalized.split("@")[0].replace(/\./g, " "),
        role: "patient",
      };
  setCurrentUser(u);
  return u;
}

export function logout() {
  setCurrentUser(null);
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
