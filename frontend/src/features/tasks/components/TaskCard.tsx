import type { Task, TaskStatus } from "@/features/tasks/types";
import { StatusBadge } from "@/features/tasks/components/StatusBadge";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
}

const STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "DONE", label: "Done" },
];

const STATUS_BORDER: Record<TaskStatus, string> = {
  OPEN: "border-l-sky-500",
  IN_PROGRESS: "border-l-amber-500",
  DONE: "border-l-emerald-500",
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: Props) {
  return (
    <div
      className={`group flex items-start gap-4 rounded-xl border border-slate-200 border-l-4 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-px ${STATUS_BORDER[task.status]}`}
    >
      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={task.status} />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 leading-snug">
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500 leading-relaxed">
            {task.description}
          </p>
        )}
        <p className="mt-2.5 text-xs text-slate-400">
          Created {formatDate(task.created_at)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1.5">
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id, e.target.value as TaskStatus)
          }
          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-600 outline-none hover:border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-colors cursor-pointer"
          title="Change status"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => onEdit(task)}
          title="Edit task"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>

        <button
          onClick={() => onDelete(task.id)}
          title="Delete task"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
