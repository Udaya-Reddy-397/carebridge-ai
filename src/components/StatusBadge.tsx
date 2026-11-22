"use client";

import { TaskStatus } from "@/types";
import { cn } from "@/lib/utils";

const styles: Record<TaskStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  acknowledged: "bg-sky-50 text-sky-700 border-sky-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  overdue: "bg-rose-50 text-rose-700 border-rose-200",
  help_requested: "bg-violet-50 text-violet-700 border-violet-200",
};

const labels: Record<TaskStatus, string> = {
  pending: "Pending",
  acknowledged: "Acknowledged",
  completed: "Completed",
  overdue: "Overdue",
  help_requested: "Help requested",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}
