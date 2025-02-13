import mongoose, { Schema, Document } from "mongoose";


export interface IBlackList extends Document {
    token: string;
    createdAt: Date;
}

const blackListSchema = new Schema<IBlackList>(
    {
        token: { type: String, required: true, unique: true },
        createdAt: { type: Date, default: Date.now, expires: "24h" }, // Auto-delete after 24 hours
    },
    { timestamps: true }
);

// Create and export Mongoose model
const BlackList = mongoose.model<IBlackList>("BlackList", blackListSchema);
export default BlackList;
