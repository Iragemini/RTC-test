/**
 * Create a new instance of BaseError
 */
class BaseError extends Error {
  constructor(public name: string, public status: number, public message: string) {
    super(message);
    this.name = name;
    this.status = status;
    this.message = message;
  }
}

export default BaseError;
