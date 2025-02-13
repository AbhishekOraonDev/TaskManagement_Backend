class ErrorHandler extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        // Maintains proper stack trace (only needed for V8 engines)
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;
