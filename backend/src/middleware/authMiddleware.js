import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncMiddleware.js";
import ErrorResponse from "../utils/errorResponse.js";
import User from "../schemas/User.js";

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract the token from the authorization header
    token = req.headers.authorization.split(" ")[1];
  }

  // If token is not found, return an unauthorized error
  if (!token) {
    return next(
      new ErrorResponse("Not authorized to access this route", 401, {
        type: "TokenMissing",
      })
    );
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the decoded token and the specific token
    const user = await User.findOne({ _id: decoded.id, token: token });

    // If the user is not found, return an unauthorized error
    if (!user) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401, {
          type: "UserNotFound",
        })
      );
    }

    // Attach the token and user to the request object
    req.token = token;
    req.user = user;

    // Proceed to the next middleware
    next();
  } catch (err) {
    // Handle token verification errors
    if (err.name === "TokenExpiredError") {
      return next(
        new ErrorResponse("Token expired, please log in again", 401, {
          type: "TokenExpired",
        })
      );
    } else if (err.name === "JsonWebTokenError") {
      return next(
        new ErrorResponse("Invalid token, please log in again", 401, {
          type: "InvalidToken",
        })
      );
    } else {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
  }
});

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is authorized to access the route
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    // Proceed to the next middleware
    next();
  };
};
