import { useQuery } from "@tanstack/react-query";
import { api } from "@/features/tasks/services/api";
import type { TasksResponse } from "@/features/tasks/types";

interface UseTasksParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export const taskKeys = {
  all: ["tasks"] as const,
  list: (params: UseTasksParams) => ["tasks", "list", params] as const,
};

export function useTasks(params: UseTasksParams) {
  return useQuery<TasksResponse>({
    queryKey: taskKeys.list(params),
    queryFn: () => api.listTasks(params),
  });
}
