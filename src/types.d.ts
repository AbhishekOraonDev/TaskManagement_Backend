import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        userName: string;
        userEmail: string;
    };
    token?: string;
    cookies: { access_token?: string };
}
