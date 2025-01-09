import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentIntentId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: { type: String, required: true },
    reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
