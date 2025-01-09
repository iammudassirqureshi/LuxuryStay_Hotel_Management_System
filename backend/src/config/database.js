import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true, // Disables auto-index creation in production for better performance
      serverSelectionTimeoutMS: 5000, // Retry up to 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("Error Connecting to MongoDB Database", err);
    // Retry logic
    if (process.env.NODE_ENV !== "production") {
      setTimeout(connectDB, 5000); // Retry connection after 5 seconds
    } else {
      process.exit(1); // Exit process with failure code in production
    }
  }
};

// Handle process termination and close the connection gracefully
const handleExit = async (signal) => {
  console.log(`Received ${signal}. Closing MongoDB connection...`);
  try {
    await mongoose.connection.close(); // Now using async/await
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error while closing MongoDB connection:", err);
    process.exit(1);
  }
};

process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);

// Handle unexpected errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  handleExit("uncaughtException");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  handleExit("unhandledRejection");
});
