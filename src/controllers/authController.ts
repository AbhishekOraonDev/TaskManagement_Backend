import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { catchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import BlackList from "../models/blackListModel";
import { AuthenticatedRequest } from "../types";


// schema for input validation
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const logUser = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Validate input 
    const { error } = loginSchema.validate({ email, password });
    if (error) return next(new ErrorHandler(error.details[0].message, 400));

    // Check if the user is already logged in
    const existingToken = req.cookies.access_token;
    if (existingToken) {
        try {
            // Verify the token
            const decoded = jwt.verify(existingToken, process.env.JWT_SECRET_KEY as string) as { _id: string };

            // Check if the token is blacklisted
            const isBlacklisted = await BlackList.findOne({ token: existingToken });
            if (isBlacklisted) {
                console.log("Token is blacklisted, allowing login.");
            } else {
                return next(new ErrorHandler("User already logged in. Please logout first.", 403));
            }
        } catch (err) {
            console.log("Existing token invalid or expired, allowing login.");
        }
    }

    try {
        // Find user by email
        const user = await User.findOne({ userEmail: email });
        if (!user) return next(new ErrorHandler("Wrong email or password!", 401));

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return next(new ErrorHandler("Wrong email or password!", 401));

        // Generate JWT Token
        const token = jwt.sign(
            {
                _id: user._id,
                userEmail: user.userEmail,
                userName: user.userName,
            },
            process.env.JWT_SECRET_KEY as string,
            { expiresIn: "24h" }
        );

        // User data response
        const userData = {
            _id: user._id,
            userEmail: user.userEmail,
            userName: user.userName,
        };

        // Set cookie for authentication
        res.cookie("access_token", token, {
            httpOnly: true, 
            sameSite: "none",
            secure: true, 
            maxAge: 24 * 60 * 60 * 1000, 
        });

        res.status(200).json({
            status: "success",
            data: userData,
            token,
            message: "Login Successful",
        });
    } catch (err: any) {
        console.error("Error logging in user:", err);
        next(new ErrorHandler(err.message || "Internal Server Error", 500));
    }
});




const logoutUser = catchAsyncError(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const token = req.token;
            if (!token) return next(new ErrorHandler("Unauthorized request", 401));

            // Blacklist the token
            const newBlackList = new BlackList({ token });
            await newBlackList.save();

            // Clear the token cookie
            res.clearCookie("access_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Secure in production
                sameSite: "strict",
            });

            res.status(200).json({
                status: "success",
                message: "You have successfully logged out",
            });
        } catch (err: any) {
            console.error("Error during logout:", err);
            next(new ErrorHandler(err.message || "Internal server error", 500));
        }
    }
);



export {logUser, logoutUser};