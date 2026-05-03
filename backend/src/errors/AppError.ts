/**
 * Base operational error class.
 *
 * isOperational = true  → the error is known / expected (e.g. validation fail,
 *                          not-found).  Details are safe to expose to clients.
 * isOperational = false → unexpected / programming error.  Only a generic
 *                          message is exposed to clients; full details are
 *                          logged server-side only.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown[];

  constructor(
    statusCode: number,
    code: string,
    message: string,
    isOperational = true,
    details?: unknown[],
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── 400 Bad Request ──────────────────────────────────────────────────────────

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown[]) {
    super(400, "VALIDATION_ERROR", message, true, details);
  }
}

// ─── 401 Unauthorized ─────────────────────────────────────────────────────────

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication is required") {
    super(401, "UNAUTHORIZED", message, true);
  }
}

// ─── 403 Forbidden ────────────────────────────────────────────────────────────

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to perform this action") {
    super(403, "FORBIDDEN", message, true);
  }
}

// ─── 404 Not Found ────────────────────────────────────────────────────────────

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found") {
    super(404, "NOT_FOUND", message, true);
  }
}

// ─── 409 Conflict ─────────────────────────────────────────────────────────────

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, "CONFLICT", message, true);
  }
}

// ─── 422 Unprocessable Entity ─────────────────────────────────────────────────

export class UnprocessableError extends AppError {
  constructor(message: string, details?: unknown[]) {
    super(422, "UNPROCESSABLE_ENTITY", message, true, details);
  }
}

// ─── 500 Internal Server Error ────────────────────────────────────────────────

export class InternalError extends AppError {
  constructor(message = "Internal server error") {
    super(500, "INTERNAL_ERROR", message, false);
  }
}
