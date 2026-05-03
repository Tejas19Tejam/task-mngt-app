export type TaskStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export const TASK_STATUSES: TaskStatus[] = ["OPEN", "IN_PROGRESS", "DONE"];

export interface GetTasksParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  userId: number;
}

export interface CreateTaskData {
  title: string;
  description?: string | null;
  status?: TaskStatus;
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
