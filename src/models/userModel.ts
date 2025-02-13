import mongoose, { Schema, Document } from "mongoose";

// Define an interface for the User model
export interface IUser extends Document {
    userName: string;
    userEmail: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

// Create User Schema
const UserSchema: Schema = new Schema<IUser>({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
},
    { timestamps: true }
);

// Create and export the User model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
