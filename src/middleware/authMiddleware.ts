import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Joi from "joi";
import BlackList from "../models/blackListModel";
import { catchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";

// Extend Express Request type
interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        userName: string;
        userEmail: string;
    };
    token?: string;
}

// Joi schema to validate token format
const tokenSchema = Joi.string().required();

export const authorization = catchAsyncError(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const token = req.cookies.access_token;
        if (!token) return next(new ErrorHandler("Logged out, please login!", 403));

        // Validate token format using Joi
        const { error } = tokenSchema.validate(token);
        if (error) return next(new ErrorHandler("Invalid token format", 400));

        try {
            // Check if token is blacklisted
            const isBlacklisted = await BlackList.findOne({ token });
            if (isBlacklisted) {
                return next(new ErrorHandler("You are logged out, please login to continue", 401));
            }

            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { 
                _id: string; 
                userName: string; 
                userEmail: string;
            };
            if (!decoded) return next(new ErrorHandler("Error Authorizing", 401));

            // Attach user data to request
            req.user = {
                _id: decoded._id,
                userName: decoded.userName,
                userEmail: decoded.userEmail,
            };
            req.token = token;

            next();
        } catch (err: any) {
            next(new ErrorHandler(err.message || "Internal server error", 500));
        }
    }
);
