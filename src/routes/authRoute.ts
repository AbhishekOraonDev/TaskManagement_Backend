import express from "express";
import { logoutUser, logUser } from "../controllers/authController";
import { authorization } from "../middleware/authMiddleware";


const router = express.Router();


// user login
router.post('/login', logUser);

// user logout
router.post("/logout", authorization, logoutUser);


export default router;