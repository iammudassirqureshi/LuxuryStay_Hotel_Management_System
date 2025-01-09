class errorResponse extends Error {
    constructor(message, statusCode, details = {}) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;

        // Capture the stack trace for better debugging
        Error.captureStackTrace(this, this.constructor);
    }

    // Optional: Method to format the error response
    toJSON() {
        return {
            success: false,
            statusCode: this.statusCode,
            message: this.message,
            details: this.details,
        };
    }
}

export default errorResponse;
