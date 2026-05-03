import type { TaskStatus } from "@/features/tasks/types";

interface Props {
  status: TaskStatus;
}

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; dot: string; badge: string }
> = {
  OPEN: {
    label: "Open",
    dot: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700 ring-sky-200",
  },
  IN_PROGRESS: {
    label: "In Progress",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  DONE: {
    label: "Done",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
};

export function StatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.OPEN;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${config.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
