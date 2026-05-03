import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { GetTasksParams, CreateTaskData, UpdateTaskData } from "@/types";
import { NotFoundError } from "@/errors/AppError";

// ─── List ─────────────────────────────────────────────────────────────────────

export const getTasks = async (params: GetTasksParams) => {
  const { page, limit, search, status, userId } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.TasksWhereInput = {
    user_id: userId,
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [tasks, total] = await Promise.all([
    prisma.tasks.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    }),
    prisma.tasks.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ─── Get by ID ────────────────────────────────────────────────────────────────

export const getTaskById = async (id: number, userId: number) => {
  const task = await prisma.tasks.findFirst({
    where: { id, user_id: userId },
  });



  if (!task) {
    throw new NotFoundError(`Task with id ${id} was not found`);
  }

  return task;
};

// ─── Create ───────────────────────────────────────────────────────────────────

export const createTask = async (data: CreateTaskData, userId: number) => {
  return prisma.tasks.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? "OPEN",
      user_id: userId,
    },
  });
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateTask = async (
  id: number,
  data: UpdateTaskData,
  userId: number,
) => {
  // Verifies the task exists and belongs to this user (throws NotFoundError if not)
  await getTaskById(id, userId);

  return prisma.tasks.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined
        ? { description: data.description }
        : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
    },
  });
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const deleteTask = async (id: number, userId: number) => {
  // Verifies the task exists and belongs to this user (throws NotFoundError if not)
  await getTaskById(id, userId);
  await prisma.tasks.delete({ where: { id } });
};
