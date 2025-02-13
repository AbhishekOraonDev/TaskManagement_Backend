import mongoose, { Schema, Document } from "mongoose";

// Interface for Task Document
export interface ITask extends Document {
    userId: mongoose.Schema.Types.ObjectId; // Relationship with User
    taskName: string;
    status: "pending" | "in-progress" | "completed";
}

// Task Schema
const TaskSchema = new Schema<ITask>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", // Establishes relationship with User Model
            required: true,
        },
        taskName: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Export Task Model
const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
