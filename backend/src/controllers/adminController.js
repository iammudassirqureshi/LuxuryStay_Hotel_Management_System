import User from "../schemas/User.js";
import Room from "../schemas/Room.js";
import Reservation from "../schemas/Reservation.js";
import Payment from "../schemas/Payment.js";
import errorResponse from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/asyncMiddleware.js";
import { parsedUser } from "../utils/tokenResponse.js";

// Get admin dashboard data
export const adminDashboard = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(
      new errorResponse("You are not authorized to access this route", 403, {
        type: "Unauthorized",
      })
    );
  }
  try {
    const totalRooms = await Room.countDocuments();
    const totalGuests = await User.countDocuments({ role: "guest" });
    const totalReservations = await Reservation.countDocuments({
      status: "confirmed",
    });
    const availableRooms = await Room.countDocuments({ status: "available" });
    const revenue = await Payment.aggregate([
      {
        $match: { status: "succeeded" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = revenue.length ? revenue[0].total : 0;

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        totalRooms,
        totalGuests,
        totalReservations,
        availableRooms,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

// get all rooms
export const getAllRooms = asyncHandler(async (req, res, next) => {
  const {
    status,
    type,
    size,
    view,
    startPrice,
    endPrice,
    amenities,
    roomNumber,
  } = req.query;
  try {
    const filters = {};
    if (roomNumber) filters.roomNumber = roomNumber;
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (size) filters.size = size;
    if (view) filters.view = { $regex: new RegExp(view, "i") }; // Create regex for case-insensitive match
    if (startPrice || endPrice) {
      filters.price = {};
      if (startPrice) filters.price.$gte = Number(startPrice);
      if (endPrice) filters.price.$lte = Number(endPrice);
    }
    if (amenities) {
      const amenitiesArray = amenities
        .split(",")
        .map((amenity) => new RegExp(amenity.trim(), "i"));
      filters.amenities = { $in: amenitiesArray };
    }

    const rooms = await Room.find(filters).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Rooms fetched successfully",
      data: parsedRooms(rooms),
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

// add room
export const addRoom = asyncHandler(async (req, res, next) => {
  try {
    const { roomNumber, type, size, bedSize, view, price, amenities } =
      req.body;

    if (!roomNumber || !type || !size || !bedSize || !view || !price) {
      return next(
        new errorResponse("Please provide all required fields", 400, {
          type: "REQUIRED_FIELDS",
        })
      );
    }

    const roomExists = await Room.findOne({ roomNumber });
    if (roomExists) {
      return next(
        new errorResponse("Room already exists", 400, {
          type: "ROOM_EXISTS",
        })
      );
    }

    if (!req.files.thumbnail || !req.files.pictures) {
      return next(
        new errorResponse("Please upload thumbnail or pictures", 400, {
          type: "PICTURES_REQUIRED",
        })
      );
    }

    req.body.amenities = JSON.parse(amenities);

    req.body.thumbnail = req.files ? req.files.thumbnail[0].filename : "";
    req.body.pictures = req.files
      ? req.files.pictures.map((picture) => picture.filename)
      : [];

    const room = await Room.create(req.body);
    res.status(201).json({
      success: true,
      message: "Room added successfully",
      data: parsedRoom(room),
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

// update room status
export const updateRoomStatus = asyncHandler(async (req, res, next) => {
  try {
    const { roomId, status } = req.body;
    if (!roomId && !status) {
      return next(
        new errorResponse("Please provide roomId and status", 400, {
          type: "REQUIRED_FIELDS",
        })
      );
    }

    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      return next(
        new errorResponse("Room not found", 404, {
          type: "ROOM_NOT_FOUND",
        })
      );
    }

    room.status = status;
    await room.save();

    res.status(200).json({
      success: true,
      message: "Room status updated successfully",
      data: parsedRoom(room),
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

// update room details
export const updateRoom = asyncHandler(async (req, res, next) => {
  try {
    const { roomId, ...updateData } = req.body;
    if (!roomId) {
      return next(
        new errorResponse("Please provide roomId", 400, {
          type: "REQUIRED_FIELDS",
        })
      );
    }

    if (req.body.amenities) {
      updateData.amenities = JSON.parse(req.body.amenities);
    }

    if (req.files.thumbnail) {
      updateData.thumbnail = req.files.thumbnail[0].filename;
    }

    if (req.files.pictures) {
      const existingRoom = await Room.findById(roomId); // Retrieve the current room
      updateData.pictures = [
        ...(existingRoom?.pictures || []).filter(
          (pic) => !(req.body.removePictures || []).includes(pic) // Remove specified pictures
        ),
        ...req.files.pictures.map((picture) => picture.filename), // Add new ones
      ];
    }

    const room = await Room.findByIdAndUpdate(
      { _id: roomId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!room) {
      return next(
        new errorResponse("Room not found", 404, { type: "ROOM_NOT_FOUND" })
      );
    }

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: parsedRoom(room),
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

// delete room
export const deleteRoom = asyncHandler(async (req, res, next) => {
  try {
    const { roomId } = req.query;
    if (!roomId) {
      return next(
        new errorResponse("Please provide roomId", 400, {
          type: "REQUIRED_FIELDS",
        })
      );
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return next(
        new errorResponse("Room not found", 404, { type: "ROOM_NOT_FOUND" })
      );
    }

    await room.deleteOne({ _id: roomId });
    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});
