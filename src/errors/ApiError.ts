import BaseError from './BaseError.js';
import { INTERNAL_SERVER_ERROR } from '../constants';

/**
 * Create a new instance of ApiError
 */
class ApiError extends BaseError {
  constructor(public message: string, public status: number = INTERNAL_SERVER_ERROR) {
    super('ApiError', status, message);
  }
}

export default ApiError;
