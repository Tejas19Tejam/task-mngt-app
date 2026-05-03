import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import type {
  Task,
  TaskStatus,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/features/tasks";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useUpdateTaskStatus,
  TaskDetailTable,
  TaskTable,
  TaskFilters,
  TaskForm,
} from "@/features/tasks";
import { useDebounce } from "@/hooks/useDebounce";
import { Modal } from "@/components/Modal";
import { Pagination } from "@/components/Pagination";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";

const TASKS_PER_PAGE = 10;

export default function App() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isError, error, refetch } = useTasks({
    page,
    limit: TASKS_PER_PAGE,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
  });

  const tasks = data?.data ?? [];
  const pagination = data?.pagination ?? null;

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const updateTaskStatus = useUpdateTaskStatus();

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleOpenView = (task: Task) => {
    setViewingTask(task);
  };

  const handleCloseView = () => {
    setViewingTask(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleFormSubmit = async (data: CreateTaskInput | UpdateTaskInput) => {
    try {
      if (editingTask) {
        await updateTask.mutateAsync({
          id: editingTask.id,
          data: data as UpdateTaskInput,
        });
        toast.success("Task updated successfully");
      } else {
        await createTask.mutateAsync(data as CreateTaskInput);
        toast.success("Task created successfully");
      }
      handleCloseModal();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save task");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask.mutateAsync(id);
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const handleStatusChange = async (id: number, status: TaskStatus) => {
    try {
      await updateTaskStatus.mutateAsync({ id, status });
      toast.success("Status updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status",
      );
    }
  };

  const isFiltered = Boolean(debouncedSearch || statusFilter);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-sm shadow-violet-200">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div className="leading-none">
              <p className="text-sm font-bold text-slate-900">TaskFlow</p>
              <p className="text-[11px] text-slate-400">Your workspace</p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600">
                <span className="text-[10px] font-bold text-white">T</span>
              </div>
              <span className="text-xs font-medium text-slate-600">
                Test User
              </span>
            </div>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-violet-200 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all"
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
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">New Task</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Page title */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
            {pagination && (
              <p className="mt-0.5 text-sm text-slate-500">
                {pagination.total} task{pagination.total !== 1 ? "s" : ""}
                {isFiltered && " · filtered"}
              </p>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <TaskFilters
            search={search}
            status={statusFilter}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
          />
        </div>

        {/* Content area */}
        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-red-700">
              {error instanceof Error ? error.message : "Failed to load tasks"}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            message={
              isFiltered ? "No tasks match your filters" : "No tasks yet"
            }
            onCreate={!isFiltered ? handleOpenCreate : undefined}
          />
        ) : (
          <TaskTable
            tasks={tasks}
            onView={handleOpenView}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </main>

      {/* Detail preview modal */}
      <Modal
        isOpen={viewingTask !== null}
        onClose={handleCloseView}
        title="Task Details"
      >
        {viewingTask && <TaskDetailTable task={viewingTask} />}
      </Modal>

      {/* Edit / create modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTask ? "Edit Task" : "New Task"}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
      <Toaster
        position="bottom-right"
        containerStyle={{ bottom: "env(safe-area-inset-bottom, 16px)" }}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "500",
          },
          success: {
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            },
            iconTheme: { primary: "#16a34a", secondary: "#f0fdf4" },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
            },
            iconTheme: { primary: "#dc2626", secondary: "#fef2f2" },
          },
        }}
      />
    </div>
  );
}
