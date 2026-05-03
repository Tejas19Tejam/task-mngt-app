import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";

/**
 * Request-ID middleware.
 *
 * - Reads an existing `x-request-id` from the incoming request header
 *   (useful when an upstream proxy / load-balancer already stamps one).
 * - Falls back to a new `crypto.randomUUID()` (UUID v4).
 * - Stores the ID in `res.locals.requestId` for downstream middleware /
 *   controllers to access.
 * - Echoes the ID back on the response as `x-request-id` so clients can
 *   correlate their logs with server logs.
 */
export const requestId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const id =
    (req.headers["x-request-id"] as string | undefined) || randomUUID();

  res.locals["requestId"] = id;
  res.setHeader("x-request-id", id);

  next();
};
