class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500);
  }
}

module.exports = {
  ValidationError,
  NotFoundError,
  DatabaseError,
};
