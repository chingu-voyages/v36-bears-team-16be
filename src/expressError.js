class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
  }
}

class NotFoundError extends ExpressError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

class BadRequestError extends ExpressError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

class UnauthorizedError extends ExpressError {
  constructor(message = "Access Forbidden") {
    super(message, 401);
  }
}

module.exports = {
  ExpressError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
};
