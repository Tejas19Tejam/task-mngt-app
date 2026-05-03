import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import {
  AppError,
  NotFoundError,
  ConflictError,
  InternalError,
  ValidationError,
} from "@/errors/AppError";
import { sendError } from "@/utils/response";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ─── Prisma Error → AppError mapping ─────────────────────────────────────────

function mapPrismaError(
  err: Prisma.PrismaClientKnownRequestError,
): AppError {
  switch (err.code) {
    case "P2025": // Record not found
      return new NotFoundError("The requested resource does not exist");
    case "P2002": // Unique constraint violation
      return new ConflictError(
        "A record with this value already exists",
      );
    case "P2003": // Foreign key constraint
      return new NotFoundError("A related resource was not found");
    case "P2014": // Relation violation
      return new ValidationError("The operation violates a relation constraint");
    default:
      return new InternalError("A database error occurred");
  }
}

// ─── Structured logger ────────────────────────────────────────────────────────

function logError(
  err: AppError,
  originalErr: Error,
  requestId?: string,
): void {
  const timestamp = new Date().toISOString();
  const rid = requestId ?? "-";

  if (err.isOperational) {
    // Known, expected errors — WARN level, no stack trace needed
    console.warn(
      `[${timestamp}] WARN  [${rid}] ${err.code}: ${err.message}`,
    );
  } else {
    // Unexpected errors — ERROR level, include full stack in dev
    console.error(
      `[${timestamp}] ERROR [${rid}] ${err.code}: ${err.message}`,
      IS_PRODUCTION ? "" : originalErr.stack ?? "",
    );
  }
}

// ─── Global Error Handler ─────────────────────────────────────────────────────

/**
 * Express 4-argument error handler.
 *
 * Order of precedence:
 *   1. Already an AppError → use as-is
 *   2. Prisma known error   → map to typed AppError
 *   3. Prisma validation    → ValidationError (400)
 *   4. Anything else        → InternalError (500)
 *
 * Client-facing rule:
 *   - Operational errors expose their real message.
 *   - Non-operational errors expose only a generic message.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const requestId = res.locals["requestId"] as string | undefined;

  let appError: AppError;

  if (err instanceof AppError) {
    appError = err;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    appError = mapPrismaError(err);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    appError = new ValidationError("Invalid data provided to the database");
  } else {
    appError = new InternalError();
  }

  logError(appError, err, requestId);

  const clientMessage = appError.isOperational
    ? appError.message
    : "An unexpected error occurred. Please try again later.";

  sendError(
    res,
    appError.statusCode,
    appError.code,
    clientMessage,
    requestId,
    appError.details,
  );
};

