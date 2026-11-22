"use client";

import { CareTask, TaskStatus } from "@/types";
import { MotionCard } from "./MotionCard";
import { StatusBadge } from "./StatusBadge";
import { formatDate, formatRelative } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  HelpCircle,
  Eye,
  Calendar,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: CareTask;
  onAction?: (taskId: string, action: "acknowledge" | "complete" | "help") => void;
  showPatient?: boolean;
  compact?: boolean;
}

export function TaskCard({ task, onAction, showPatient, compact }: TaskCardProps) {
  const canAct =
    onAction &&
    (task.status === "pending" ||
      task.status === "acknowledged" ||
      task.status === "overdue");

  return (
    <MotionCard className={compact ? "p-4" : ""}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <StatusBadge status={task.status} />
            <span className="text-xs text-slate-400 capitalize">{task.category.replace("_", " ")}</span>
            {task.priority === "high" && (
              <span className="text-xs font-medium text-rose-600">High priority</span>
            )}
          </div>
          <h3 className="font-semibold text-slate-900 leading-snug">{task.title}</h3>
          {!compact && (
            <p className="mt-1 text-sm text-slate-600 line-clamp-2">{task.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Due {formatDate(task.dueDate)} · {formatRelative(task.dueDate)}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {task.ownerName}
            </span>
            {showPatient && (
              <span className="text-brand-600 font-medium">{task.patientName}</span>
            )}
          </div>
        </div>
      </div>

      {canAct && (
        <div className="mt-4 flex flex-wrap gap-2">
          {task.status === "pending" && (
            <ActionButton
              icon={<Eye className="w-4 h-4" />}
              label="Acknowledge"
              onClick={() => onAction?.(task.id, "acknowledge")}
              variant="sky"
            />
          )}
          {(task.status === "pending" ||
            task.status === "acknowledged" ||
            task.status === "overdue") && (
            <>
              <ActionButton
                icon={<CheckCircle2 className="w-4 h-4" />}
                label="Mark complete"
                onClick={() => onAction?.(task.id, "complete")}
                variant="emerald"
              />
              <ActionButton
                icon={<HelpCircle className="w-4 h-4" />}
                label="Need help"
                onClick={() => onAction?.(task.id, "help")}
                variant="violet"
              />
            </>
          )}
        </div>
      )}
    </MotionCard>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant: "sky" | "emerald" | "violet";
}) {
  const colors = {
    sky: "bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200",
    emerald: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
    violet: "bg-violet-50 text-violet-700 hover:bg-violet-100 border-violet-200",
  };
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${colors[variant]}`}
    >
      {icon}
      {label}
    </motion.button>
  );
}
