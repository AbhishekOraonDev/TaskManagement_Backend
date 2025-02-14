import { catchAsyncError } from "../utils/catchAsyncError";
import { AuthenticatedRequest } from "../types";
import { Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import Joi from "joi";
import Task from "../models/taskModel";
import mongoose from "mongoose";
import { io } from "../index";

// Create task schema
const createTaskSchema = Joi.object({
    taskName: Joi.string().min(1).max(100).required(),
    status: Joi.string().valid("pending", "in-progress", "completed").default("pending"),
});


// Create task API
const createTask = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new ErrorHandler("Unauthorized user!", 401));

    const { _id } = req.user;
    const { taskName, status } = req.body;

    // Validate user
    if (!_id) return next(new ErrorHandler("Unauthorized request!", 401));

    // Validate inputs
    const { error } = createTaskSchema.validate({ taskName, status });
    if (error) return next(new ErrorHandler(error.details[0].message, 400));

    // new task object
    const task = new Task({
        userId: _id,
        taskName,
        status,
    });

    // Save task object
    await task.save();

    // taskcreated real-time update
    io.emit('taskCreated', {
        task,
        userId: _id
    });

    res.status(201).json({
        success: true,
        data: task,
        message: "Task created successfully",
    });
});


// update task schema
const updateTaskSchema = Joi.object({
    taskName: Joi.string().min(1).max(100),
    status: Joi.string().valid("pending", "in-progress", "completed"),
}).or("taskName", "status");


// Edit Task API
const updateTask = catchAsyncError(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return next(new ErrorHandler("Unauthorized user!", 401));

    const { _id } = req.user;
    const { taskId } = req.params;
    const { taskName, status } = req.body;

    // validate input
    const { error } = updateTaskSchema.validate({ taskName, status });
    if (error) return next(new ErrorHandler(error.details[0].message, 400));

    // Find task and check ownership
    const task = await Task.findOne({ _id: taskId, userId: _id });
    if (!task) return next(new ErrorHandler("Task not found or unauthorized!", 404));

    //  Update task fields
    if (taskName) task.taskName = taskName;
    if (status) task.status = status;

    // Save updated task
    await task.save();

    // taskupdate real-time update
    io.emit('taskUpdated', {
        task,
        userId: _id
    });

    res.status(200).json({
        success: true,
        data: task,
        message: "Task updated successfully",
    });
});



// fetch task schema
const fetchTasksSchema = Joi.object({
    search: Joi.string().allow("").optional(), // Search by taskName (optional)
    status: Joi.string().valid("pending", "in-progress", "completed").allow("").optional(), // Filter by status
    page: Joi.number().min(1).default(1), // Pagination (default: page 1)
    limit: Joi.number().min(1).max(100).default(10), // Limit (default: 10, max: 100)
});


const fetchTasks = catchAsyncError(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) return next(new ErrorHandler("Unauthorized user!", 401));

        const { _id } = req.user;
        const { search, status, page, limit } = req.query;

        // Validate query parameters 
        const { error, value } = fetchTasksSchema.validate(req.query);
        if (error) return next(new ErrorHandler(error.details[0].message, 400));

        // Pagination setup
        const pageNumber = Number(value.page);
        const limitNumber = Number(value.limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Query filters
        const filter: any = { userId: _id }; // Fetch only user's tasks
        if (value.search) filter.taskName = { $regex: value.search, $options: "i" }; // Case-insensitive search
        if (value.status) filter.status = value.status;

        //  Fetch tasks with pagination
        const tasks = await Task.find(filter)
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 }); // Sort by newest first

        // Total count for pagination
        const totalTasks = await Task.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: tasks,
            pagination: {
                totalTasks,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalTasks / limitNumber),
            },
            message: "Tasks fetched successfully",
        });
    }
);



// delete task schema
const deleteTaskSchema = Joi.object({
    taskId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error("any.invalid");
            }
            return value;
        }, "MongoDB ObjectId validation")
        .required()
        .messages({
            "any.required": "Task ID is required",
            "any.invalid": "Invalid task ID format",
        }),
});


// delete task API
const deleteTask = catchAsyncError(
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) return next(new ErrorHandler("Unauthorized user!", 401));

        const { _id } = req.user;
        const { taskId } = req.params;

        //  Validate task ID 
        const { error } = deleteTaskSchema.validate({ taskId });
        if (error) return next(new ErrorHandler(error.details[0].message, 400));

        //  Check if task exists
        const task = await Task.findById(taskId);
        if (!task) return next(new ErrorHandler("Task not found!", 404));

        // Ensure user can only delete their own task
        if (task.userId.toString() !== _id) {
            return next(new ErrorHandler("You are not authorized to delete this task!", 403));
        }

        //  Delete task
        await Task.findByIdAndDelete(taskId);

        // DeleteTask real-time 
        io.emit('taskDeleted', {
            taskId,
            userId: _id
        });

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    }
);


export { createTask, updateTask, fetchTasks, deleteTask };
