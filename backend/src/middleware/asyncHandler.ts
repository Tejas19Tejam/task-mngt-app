import type { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

/**
 * Wraps an async Express route handler so that any rejected promise or thrown
 * error is automatically forwarded to Express's `next(err)` — eliminating
 * repetitive try/catch boilerplate in every controller.
 *
 * Usage:
 *   router.get("/", asyncHandler(myController.list));
 *
 * The global errorHandler middleware then takes over for all unhandled errors.
 */
export const asyncHandler =
  (fn: AsyncFn): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
