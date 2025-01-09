import errorResponse from "../utils/errorResponse.js";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log the error stack trace for development
  console.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id ${err.value}`;
    error = new errorResponse(message, 404, {
      type: "CastError",
      value: err.value,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const keys = Object.keys(err.keyValue);
    const values = Object.values(err.keyValue);
    const message = `Duplicate field value entered: ${keys.join(
      ", "
    )} (${values.join(", ")})`;
    error = new errorResponse(message, 400, {
      type: "DuplicateKeyError",
      keys,
      values,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    const fields = Object.keys(err.errors);
    error = new errorResponse(messages.join(", "), 400, {
      type: "ValidationError",
      fields,
    });
  }

  // JWT Authentication Error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new errorResponse(message, 401, { type: "JsonWebTokenError" });
  }

  // JWT Expired Error
  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new errorResponse(message, 401, { type: "TokenExpiredError" });
  }

  // Fallback for unknown errors
  res.status(error.statusCode || 500).json(
    error.toJSON
      ? error.toJSON()
      : {
          success: false,
          statusCode: error.statusCode || 500,
          message: error.message || "Server Error",
          details: error.details || {},
        }
  );
};
