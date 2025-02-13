import express from "express";
import { editUser, fetchProfile, registerUser } from "../controllers/userController";
import { authorization } from "../middleware/authMiddleware";

const router = express.Router();


// register user
router.post("/register", registerUser);

// Edit user
router.put("/edit", authorization, editUser);

router.get("/profile", authorization, fetchProfile);


export default router;