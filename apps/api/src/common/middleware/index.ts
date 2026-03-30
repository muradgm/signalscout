import type { NextFunction, Request, Response } from 'express';
import { ZodError, type AnyZodObject } from 'zod';
import { AppError, ValidationError } from '../errors/index.js';

export const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const issues = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));

      next(new ValidationError(JSON.stringify(issues)));
      return;
    }

    req.body = result.data.body;
    req.params = result.data.params as Request['params'];
    req.query = result.data.query as Request['query'];

    next();
  };

export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new AppError('Route not found', 404));
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof AppError) {
    let details: unknown = undefined;

    if (error.name === 'ValidationError') {
      try {
        details = JSON.parse(error.message);
      } catch {
        details = undefined;
      }
    }

    if (error.name === 'ConflictError') {
      res.status(409).json({
        success: false,
        error: error.message,
      });
      return;
    }

    res.status(error.statusCode).json({
      success: false,
      error:
        error.name === 'ValidationError' ? 'Validation failed' : error.message,
      ...(details ? { details } : {}),
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error',
  });
};