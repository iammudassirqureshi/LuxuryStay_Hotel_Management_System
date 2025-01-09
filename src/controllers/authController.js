import User from "../schemas/User.js";
import errorResponse from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/asyncMiddleware.js";
import { parsedUser } from "../utils/tokenResponse.js";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res, next) => {
  try {
    // check if user exists
    const existinUser = await User.findOne({ email: req.body.email });
    if (existinUser) {
      return next(
        new errorResponse("User already exists", 400, {
          type: "USER_ALREADY_EXISTS",
        })
      );
    }

    req.body.preferences = JSON.parse(req.body.preferences);
    req.body.picture = req.file ? req.file.filename : "";
    const user = await User.create(req.body);
    if (!user) {
      return next(new errorResponse("User not registered", 400));
    }

    res
      .status(201)
      .cookie("token", user.token)
      .json({
        success: true,
        message: "User registered successfully",
        token: user.token,
        data: parsedUser(user),
      });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return next(
        new errorResponse("Please provide email and password", 400, {
          type: "INVALID_CREDENTIALS",
        })
      );

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return next(
        new errorResponse("Invalid credentials", 401, {
          type: "INVALID_CREDENTIALS",
        })
      );

    const isPasswordMatched = await user.matchPassword(password);
    if (!isPasswordMatched) {
      return next(
        new errorResponse("Invalid credentials", 401, {
          type: "INVALID_CREDENTIALS",
        })
      );
    }

    let isTokenValid = false;
    if (user.token) {
      try {
        jwt.verify(user.token, process.env.JWT_ACCESS_TOKEN_SECRET);
        isTokenValid = true;
      } catch (error) {
        console.log("Token expired or invalid, generating a new one.");
      }
    }

    if (!isTokenValid) {
      user.token = user.getSignedToken();
      await user.save();
    }

    res
      .status(200)
      .cookie("token", user.token)
      .json({
        success: true,
        message: "User logged in successfully",
        token: user.token,
        data: parsedUser(user),
      });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

export const logout = asyncHandler(async (req, res, next) => {
  try {
    req.user.token = "";
    await req.user.save();
    res
      .status(200)
      .clearCookie("token")
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});
