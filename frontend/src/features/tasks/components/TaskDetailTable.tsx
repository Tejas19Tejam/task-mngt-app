import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Task } from "@/features/tasks/types";
import { StatusBadge } from "@/features/tasks/components/StatusBadge";

interface FieldRow {
  field: string;
  value: React.ReactNode;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

const columnHelper = createColumnHelper<FieldRow>();

const columns = [
  columnHelper.accessor("field", {
    header: "Field",
    cell: (info) => (
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("value", {
    header: "Value",
    cell: (info) => (
      <span className="text-sm text-slate-800 break-words">
        {info.getValue()}
      </span>
    ),
  }),
];

interface Props {
  task: Task;
}

export function TaskDetailTable({ task }: Props) {
  const rows: FieldRow[] = [
    { field: "ID", value: `#${task.id}` },
    {
      field: "Title",
      value: <span className="font-semibold">{task.title}</span>,
    },
    {
      field: "Description",
      value: task.description ? (
        task.description
      ) : (
        <span className="italic text-slate-400">No description</span>
      ),
    },
    { field: "Status", value: <StatusBadge status={task.status} /> },
    { field: "User ID", value: task.user_id },
    { field: "Created At", value: formatDate(task.created_at) },
  ];

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[280px]">
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="group">
                {row.getVisibleCells().map((cell, i) => (
                  <td
                    key={cell.id}
                    className={`px-4 py-3 align-top ${
                      i === 0
                        ? "w-28 bg-slate-50 group-first:rounded-tl-xl group-last:rounded-bl-xl"
                        : "bg-white group-first:rounded-tr-xl group-last:rounded-br-xl"
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
