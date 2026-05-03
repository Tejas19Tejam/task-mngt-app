import type { Response } from "express";
import type { PaginationMeta } from "@/types";

// ─── Response Envelopes ───────────────────────────────────────────────────────

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
  requestId?: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Send a unified success response.
 *
 * @param res        Express Response object
 * @param data       Payload to return under the `data` key
 * @param message    Human-readable summary (default: "Success")
 * @param statusCode HTTP status code (default: 200)
 * @param meta       Optional pagination / cursor metadata
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  meta?: PaginationMeta,
): void {
  const payload: SuccessResponse<T> = {
    success: true,
    message,
    data,
    ...(meta !== undefined ? { meta } : {}),
  };
  res.status(statusCode).json(payload);
}

/**
 * Send a unified error response.
 *
 * @param res       Express Response object
 * @param status    HTTP status code
 * @param code      Machine-readable error code (e.g. "VALIDATION_ERROR")
 * @param message   Human-readable error description
 * @param requestId Optional request ID for log correlation
 * @param details   Optional field-level validation error details
 */
export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  requestId?: string,
  details?: unknown[],
): void {

  
  const payload: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && details.length > 0 ? { details } : {}),
    },
    ...(requestId ? { requestId } : {}),
  };
  res.status(status).json(payload);
}
