import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["confirmed", "pending", "checked-in", "checked-out", "cancelled"],
      default: "confirmed",
    },
    totalAmount: { type: Number, required: true },
    adult: { type: Number, required: true },
    children: { type: Number, required: true },
  },
  { timestamps: true }
);

const Reservation = mongoose.model("reservation", reservationSchema);
export default Reservation;
