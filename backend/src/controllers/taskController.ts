import type { Request, Response } from "express";
import * as taskService from "@/services/taskService";
import { asyncHandler } from "@/middleware/asyncHandler";
import { ValidationError } from "@/errors/AppError";
import { sendSuccess } from "@/utils/response";
import { ALLOWED_STATUSES, CURRENT_USER_ID } from "@/config/constants";
import type { TaskStatus, UpdateTaskData } from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseId(raw: string): number {
  const id = parseInt(raw, 10);
  if (isNaN(id) || id <= 0) {
    throw new ValidationError("Task ID must be a positive integer");
  }
  return id;
}

function validateStatus(status: string): void {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new ValidationError(
      `Invalid status "${status}". Allowed values: ${ALLOWED_STATUSES.join(", ")}`,
    );
  }
}

// ─── GET /api/tasks ───────────────────────────────────────────────────────────

export const listTasks = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 10),
  );
  const search = (req.query.search as string)?.trim() || undefined;
  const status = (req.query.status as string) || undefined;

  if (status) validateStatus(status);

  const { tasks, pagination } = await taskService.getTasks({
    page,
    limit,
    search,
    status,
    userId: CURRENT_USER_ID,
  });

  sendSuccess(res, tasks, "Tasks fetched successfully", 200, pagination);
});

// ─── GET /api/tasks/:id ───────────────────────────────────────────────────────

export const getTask = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id as string);
  const task = await taskService.getTaskById(id, CURRENT_USER_ID);
  sendSuccess(res, task, "Task fetched successfully");
});

// ─── POST /api/tasks ──────────────────────────────────────────────────────────

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, status } = req.body as {
    title?: unknown;
    description?: unknown;
    status?: unknown;
  };

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    throw new ValidationError("Title is required and must be a non-empty string");
  }
  if (title.trim().length > 255) {
    throw new ValidationError("Title must be 255 characters or less");
  }
  if (status !== undefined && typeof status === "string") {
    validateStatus(status);
  }

  const task = await taskService.createTask(
    {
      title: title.trim(),
      description:
        typeof description === "string" ? description.trim() || null : null,
      status: (status as TaskStatus) || "OPEN",
    },
    CURRENT_USER_ID,
  );

  sendSuccess(res, task, "Task created successfully", 201);
});

// ─── PUT /api/tasks/:id ───────────────────────────────────────────────────────

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id as string);
  const { title, description, status } = req.body as {
    title?: unknown;
    description?: unknown;
    status?: unknown;
  };

  const updateData: UpdateTaskData = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      throw new ValidationError("Title must be a non-empty string");
    }
    if (title.trim().length > 255) {
      throw new ValidationError("Title must be 255 characters or less");
    }
    updateData.title = title.trim();
  }

  if (description !== undefined) {
    updateData.description =
      typeof description === "string" ? description.trim() || null : null;
  }

  if (status !== undefined) {
    if (typeof status !== "string") {
      throw new ValidationError("Status must be a string");
    }
    validateStatus(status);
    updateData.status = status as TaskStatus;
  }

  const task = await taskService.updateTask(id, updateData, CURRENT_USER_ID);
  sendSuccess(res, task, "Task updated successfully");
});

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id as string);
  await taskService.deleteTask(id, CURRENT_USER_ID);
  sendSuccess(res, null, "Task deleted successfully", 200);
});

// ─── PATCH /api/tasks/:id/status ─────────────────────────────────────────────

export const updateTaskStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseId(req.params.id as string);
    const { status } = req.body as { status?: unknown };

    if (!status || typeof status !== "string") {
      throw new ValidationError("Status is required and must be a string");
    }
    validateStatus(status);

    const task = await taskService.updateTask(
      id,
      { status: status as TaskStatus },
      CURRENT_USER_ID,
    );
    sendSuccess(res, task, "Task status updated successfully");
  },
);
