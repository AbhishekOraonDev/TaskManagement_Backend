import express from "express";
import { authorization } from "../middleware/authMiddleware";
import { createTask, deleteTask, fetchTasks, updateTask } from "../controllers/taskController";

const router = express.Router();

// Create Task
router.post("/create", authorization, createTask);

// Get All Tasks with advanced search
router.get("/", authorization, fetchTasks);

// Update Task
router.put("/:taskId", authorization, updateTask);

// Delete Task
router.delete("/:taskId", authorization, deleteTask);

export default router;
