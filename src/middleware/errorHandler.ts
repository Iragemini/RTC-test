import { NextFunction, Request, Response } from 'express';
import ApiError from '../errors/ApiError';

interface ErrorResponse {
  status: number;
  message: string;
}

const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  let status = 500;
  const { message = 'Something went wrong...' } = err;

  if (err instanceof ApiError) {
    status = err.status;
  }

  res.status(status).json({ status, message });
};

export default errorHandler;
