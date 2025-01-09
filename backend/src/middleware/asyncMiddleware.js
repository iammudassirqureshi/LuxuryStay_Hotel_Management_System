export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      // Custom logging or error tracking can be done here
      console.error("An error occurred:", err.message);
      next(err);
    });
  };
};
