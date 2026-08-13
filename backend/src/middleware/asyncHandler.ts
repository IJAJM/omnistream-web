import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Bungkus controller async supaya error yang ke-throw di dalamnya otomatis
 * diteruskan ke error handler (src/middleware/errorHandler.ts), bukan bikin
 * proses Node crash atau request nge-hang tanpa response.
 */
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
