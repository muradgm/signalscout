import 'express';

declare global {
  namespace Express {
    interface Request {
      params: {
        id?: string;
        [key: string]: string | string[] | undefined;
      };
    }
  }
}