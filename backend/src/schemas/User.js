import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      sparse: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: { type: String, unique: true, sparse: true },
    password: {
      type: String,
      required: false,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "receptionist", "housekeeping", "guest"],
      required: true,
      default: "guest",
    },
    picture: { type: String },
    address: { type: String },
    dob: { type: String },
    token: { type: String },
    isActive: { type: Boolean, default: true },
    preferences: { type: Object },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
    },
    cnic: { type: String, unique: true, sparse: true },
    emergencyContact: {
      name: { type: String },
      relation: { type: String },
      phone: { type: String },
    },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt before saving to database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate JWT token automatically before saving user to database
UserSchema.pre("save", async function (next) {
  if (!this.token) {
    this.token = jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }
  return next();
});

// Sign JWT and return
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// indexes for email and phone
UserSchema.indexes({ email: 1, phone: 1 }, { unique: true });

const User = mongoose.model("User", UserSchema);
export default User;
