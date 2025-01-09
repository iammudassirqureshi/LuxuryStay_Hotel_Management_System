import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["single", "double", "suite"], required: true },
    size: { type: Number, required: true },
    bedSize: {
      type: String,
      enum: ["single", "double", "queen", "king", "twin"],
      required: true,
    },
    view: {
      type: String,
      enum: ["sea", "city", "pool", "garden", "mountains", "river"],
      required: true,
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "reserved", "maintenance"],
      default: "available",
    },
    amenities: { type: [String] },
    thumbnail: { type: String },
    pictures: { type: [String] },
    maxGuests: { type: Number, required: true, max: 2 },
    tax: { type: Number, required: true },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
