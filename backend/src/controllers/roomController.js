import Room from "../schemas/Room.js";
import Reservation from "../schemas/Reservation.js";
import Payment from "../schemas/Payment.js";

import errorResponse from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/asyncMiddleware.js";
import { parsedRoom, parsedRooms } from "../utils/tokenResponse.js";
import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

// get single room by id
export const getRoomById = asyncHandler(async (req, res, next) => {
  try {
    const { roomId } = req.query;
    if (!roomId) {
      return next(
        new errorResponse("Please provide roomId", 400, {
          type: "REQUIRED_FIELDS",
        })
      );
    }

    const room = await Room.findOne({ _id: roomId });
    res.status(200).json({
      success: true,
      message: "Room fetched successfully",
      data: parsedRoom(room),
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

export const roomReservation = asyncHandler(async (req, res, next) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    if (!roomId || !checkInDate || !checkOutDate) {
      return next(
        new errorResponse("Please provide all required fields", 400, {
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

    const reservation = await Reservation.create({
      guest: req.user._id,
      room: roomId,
      checkInDate,
      checkOutDate,
      totalAmount: room.price,
    });

    res.status(201).json({
      success: true,
      message: "Room reserved successfully",
      data: reservation,
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

export const checkRoomAvailability = asyncHandler(async (req, res, next) => {
  try {
    const { checkInDate, checkOutDate, adults } = req.body;
    if (!checkInDate || !checkOutDate) {
      return next(
        new errorResponse("Please provide check-in and check-out dates", 400, {
          type: "REQUIRED_FIELDS",
        })
      );
    }

    if (checkInDate == checkOutDate) {
      return next(
        new errorResponse(
          "Check-in and check-out dates cannot be for the same day",
          400,
          {
            type: "INVALID_DATES",
          }
        )
      );
    }

    const reservations = await Reservation.find({
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const reservedRooms = reservations.map((reservation) => reservation.room);
    const rooms = await Room.find({ _id: { $nin: reservedRooms } });

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

export const bookRoomOnline = asyncHandler(async (req, res, next) => {
  try {
    const { roomId, checkInDate, checkOutDate, adults, children, guestId } =
      req.body;
    if (!roomId || !checkInDate || !checkOutDate || !adults || !children) {
      return next(
        new errorResponse("Please provide all required fields", 400, {
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

    const reservation = await Reservation.create({
      guest: guestId,
      room: roomId,
      checkInDate,
      checkOutDate,
      totalAmount: room.price,
      adult: adults,
      children,
      status: "pending",
    });

    const totalAmount = room.price + room.tax;
    const amountInCents = Math.round(totalAmount * 100);

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      payment_method_types: ["card"],
      metadata: {
        reservation_id: reservation._id.toString(),
      },
    });

    res.status(201).json({
      success: true,
      message: "Room reserved successfully",
      data: {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});

export const confirmReservation = asyncHandler(async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;

    // Verify the payment intent on Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      return next(
        new errorResponse("Payment not successful", 400, {
          type: "PAYMENT_FAILED",
        })
      );
    }

    const reservationId = paymentIntent.metadata.reservation_id;
    const reservation = await Reservation.findById(reservationId);

    // Create Payment document
    const payment = await Payment.create({
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Convert cents to dollars
      status: paymentIntent.status,
      reservation: reservationId,
    });

    // Update reservation status
    reservation.status = "confirmed";
    reservation.payment = payment._id;
    await reservation.save();

    res.status(201).json({
      success: true,
      message: "Reservation confirmed successfully",
      data: reservation,
    });
  } catch (error) {
    console.error(error);
    return next(new errorResponse("Server error", 500));
  }
});
