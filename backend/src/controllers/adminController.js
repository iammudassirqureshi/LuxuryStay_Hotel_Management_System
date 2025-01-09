import User from "../schemas/User.js";
import Room from "../schemas/Room.js";
import Reservation from "../schemas/Reservation.js";
import Payment from "../schemas/Payment.js";
import errorResponse from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/asyncMiddleware.js";

// Get admin dashboard data
export const adminDashboard = asyncHandler(async (req, res, next) => {
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
