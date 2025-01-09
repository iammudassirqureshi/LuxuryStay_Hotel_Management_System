import User from "../schemas/User.js";
import errorResponse from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/asyncMiddleware.js";
import { parsedUser } from "../utils/tokenResponse.js";

export const addUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    const existinUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existinUser) {
      return next(
        new errorResponse("User already exists", 400, {
          type: "USER_ALREADY_EXISTS",
        })
      );
    }

    // if body have preferences in string then parse it to JSON
    req.body.preferences = JSON.parse(req.body.preferences);
    // if body have picture then assign it to req.body.picture
    req.body.picture = req.file ? req.file.filename : "";

    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      message: "User added successfully",
      data: parsedUser(user),
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const { isActive } = req.query;
  try {
    const filters = isActive == 1 ? { isActive: true } : {};
    const users = await User.find(filters);

    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

export const updateUser = asyncHandler(async (req, res, next) => {
  try {
    const { userId, ...updateData } = req.body;
    if (!userId) {
      return next(
        new errorResponse("Params are required", 400, {
          type: "PARAMS_REQUIRED",
        })
      );
    }

    if (req.body.preferences) {
      updateData.preferences = JSON.parse(req.body.preferences);
    }

    if (req.file) {
      updateData.picture = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(
        new errorResponse("User not found", 404, {
          type: "USER_NOT_FOUND",
        })
      );
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

export const deactivateUser = asyncHandler(async (req, res, next) => {
  try {
    const { userId, isActive } = req.query;
    if (!userId && !isActive) {
      return next(
        new errorResponse("Params are required", 400, {
          type: "PARAMS_REQUIRED",
        })
      );
    }

    let filters = {};
    if (isActive == 1) {
      filters = { isActive: true };
    } else {
      filters = { isActive: false };
    }
    const user = await User.findByIdAndUpdate(userId, filters, { new: true });

    res.status(200).json({
      success: true,
      message: `User account ${
        isActive == 1 ? "activated" : "deactivated"
      } successfully`,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return next(
        new errorResponse("Params are required", 400, {
          type: "PARAMS_REQUIRED",
        })
      );
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});
