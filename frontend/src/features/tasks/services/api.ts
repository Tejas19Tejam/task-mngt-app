import { apiClient } from "@/lib/apiClient";
import type {
  Task,
  TasksResponse,
  CreateTaskInput,
  UpdateTaskInput,
  TaskStatus,
} from "@/features/tasks/types";

// ─── Backend response envelope ────────────────────────────────────────────────
// The backend wraps every successful response in:
//   { success: true, message: string, data: T, meta?: PaginationMeta }
// We unwrap here so the rest of the frontend keeps its existing shape.

interface BackendEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: TasksResponse["pagination"];
}

export const api = {
  async listTasks(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
  }): Promise<TasksResponse> {
    const { data: envelope } = await apiClient.get<BackendEnvelope<Task[]>>(
      "/tasks",
      { params },
    );
    // Re-map to the shape the rest of the frontend expects
    return {
      data: envelope.data,
      pagination: envelope.meta ?? {
        page: params.page,
        limit: params.limit,
        total: 0,
        totalPages: 0,
      },
    };
  },

  async getTask(id: number): Promise<Task> {
    const { data: envelope } = await apiClient.get<BackendEnvelope<Task>>(
      `/tasks/${id}`,
    );
    return envelope.data;
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    const { data: envelope } = await apiClient.post<BackendEnvelope<Task>>(
      "/tasks",
      input,
    );
    return envelope.data;
  },

  async updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
    const { data: envelope } = await apiClient.put<BackendEnvelope<Task>>(
      `/tasks/${id}`,
      input,
    );
    return envelope.data;
  },

  async deleteTask(id: number): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const { data: envelope } = await apiClient.patch<BackendEnvelope<Task>>(
      `/tasks/${id}/status`,
      { status },
    );
    return envelope.data;
  },
};
