import {
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
} from "../http_status_code.js";

class AppError extends Error {
  constructor(message, statusCode, statusText) {
    super(message);
    this.statusCode = statusCode;
    this.statusText = statusText || "Fail";
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  static createError(message, statusCode, statusText) {
    return new AppError(message, statusCode, statusText);
  }
}

export default AppError;

export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "Recourse Not Found") {
    super(message, NOT_FOUND);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = "Bad Request") {
    super(message, BAD_REQUEST);
  }
}

export class InternalServerError extends CustomError {
  constructor(message = "server error") {
    super(message, INTERNAL_SERVER_ERROR);
  }
}

export class UnAuthorizedError extends CustomError {
  constructor(message = "Un Authorized") {
    super(message, UNAUTHORIZED);
  }
}
