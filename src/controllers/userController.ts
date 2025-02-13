import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import Joi from "joi";
import User from "../models/userModel"; // Adjust path as needed
import { catchAsyncError } from "../utils/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import { AuthenticatedRequest } from "../types";

// Schema for Input Validation
const userSchema = Joi.object({
    userName: Joi.string().min(5).max(30).required(),
    userEmail: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});


// API for register user
const registerUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    // Validate Request Body
    const { error } = userSchema.validate(req.body);
    if (error) {
        return next(new ErrorHandler(error.details[0].message, 400));
    }

    const { userName, userEmail, password } = req.body;

    // Check if User Already Exists
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
        return next(new ErrorHandler("User already exists", 403));
    }

    // Hash the Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create New User Object
    const userData = {
        userName,
        userEmail,
        password: hashedPassword,
    };

    // Save User to Database
    const newUser = await User.create(userData);

    res.status(201).json({
        status: "success",
        data: {
            userName: newUser.userName,
            userEmail: newUser.userEmail,
        },
        message: "Thank you for registering. Your account has been created successfully.",
    });
});


const editUserSchema = Joi.object({
    userName: Joi.string().min(5).max(30).optional(),
    password: Joi.string().min(6).optional(),
}).or("userName", "password");

const editUser = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //Ensure user exists in request
    if (!req.user) {
        return next(new ErrorHandler("Unauthorized: No user found in request", 401));
    }

    const { _id } = req.user;
    const { userName, password } = req.body;

    //  Validate input 
    const { error } = editUserSchema.validate({ userName, password });
    if (error) return next(new ErrorHandler(error.details[0].message, 400));

    try {
        const updateData: Partial<{ userName: string; password: string; updatedAt: Date }> = {
            updatedAt: new Date(),
        };

        if (userName) updateData.userName = userName;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        console.log(_id);

        // Find and update user
        const user = await User.findByIdAndUpdate(_id, updateData, { new: true });

        if (!user) return next(new ErrorHandler("User not found", 404));

        res.status(200).json({
            status: "success",
            data: [user],
            message: "User profile updated successfully.",
        });
    } catch (error: any) {
        next(new ErrorHandler(error.message || "Internal server error", 500));
    }
});


const fetchProfile = catchAsyncError(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    // ensure if user exists in request
    if(!req.user) return next(new ErrorHandler("Unauthorized user !", 401));

    const { _id } = req.user;

    try{
        // find user by ID
        const user = await User.findById(_id);

        // check if user exists
        if(!user) return next(new ErrorHandler("User not found", 404));

        res.status(200).json({
            status: "success",
            data: [user],
            message: "User fetched successfully.",
        })
    }catch(error: any){
        next(new ErrorHandler(error.message || "Internal server error", 500));
    }
})


export {registerUser, editUser, fetchProfile};