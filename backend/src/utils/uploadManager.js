import multer from "multer";
import mimetype from "mime-types";
import path from "path";
import ErrorResponse from "./errorResponse.js";

// Configure storage settings with dynamic destination
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    // Check the file type and set the appropriate folder
    if (file.mimetype.startsWith("image/")) {
      uploadPath = path.join(path.resolve(), "uploads", "images");
    } else if (file.mimetype.startsWith("video/")) {
      uploadPath = path.join(path.resolve(), "uploads", "videos");
    } else {
      return cb(
        new ErrorResponse(
          "Invalid file type. Only images and videos are allowed.",
          400
        ),
        false
      );
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    let extension = mimetype.extension(file.mimetype);
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + extension;
    cb(null, file.fieldname + "-" + uniqueSuffix); // Use fieldname for more consistent filenames
  },
});

// Image filter to validate image files only
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new ErrorResponse("Invalid file type. Only images are allowed.", 400),
      false
    );
  }
};

// Video filter to validate video files only
const videoFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(
      new ErrorResponse("Invalid file type. Only videos are allowed.", 400),
      false
    );
  }
};

// Set file size limits
const limits = {
  imageSize: 5 * 1024 * 1024, // 5MB for images
  videoSize: 50 * 1024 * 1024, // 50MB for videos (adjust as necessary)
};

// Create separate upload middlewares for images and videos
export const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: limits.imageSize },
  onError: function (err, next) {
    console.error("Error occurred during image upload:", err);
    next(new ErrorResponse("Image upload failed. Please try again.", 500));
  },
});

export const uploadVideo = multer({
  storage: storage,
  fileFilter: videoFilter,
  limits: { fileSize: limits.videoSize },
  onError: function (err, next) {
    console.error("Error occurred during video upload:", err);
    next(new ErrorResponse("Video upload failed. Please try again.", 500));
  },
});
