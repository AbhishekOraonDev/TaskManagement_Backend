import { Request, Response, NextFunction } from "express";

// Custom error type
interface CustomError extends Error {
    statusCode?: number;
}

const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
        return next(err); // If headers are already sent, pass the error to the default Express handler
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
    });
};

export default errorMiddleware;
