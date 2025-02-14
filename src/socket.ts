import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import dotenv from "dotenv";
import Task from "./models/taskModel"; // Import the Task model

dotenv.config();

export const setupWebSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "https://task-management-frontend-5ajobql2o-daash23s-projects.vercel.app",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Listen for task creation
    socket.on("createTask", (task) => {
        console.log("Task created:", task);
        io.emit("taskCreated", task); // Emit the entire task object
    });

    // Listen for task updates
    socket.on("updateTask", async (task) => {
        try {
            const updatedTask = await Task.findByIdAndUpdate(
                task._id,
                { taskName: task.taskName, status: task.status },
                { new: true } // Return the updated task
            );
    
            if (updatedTask) {
                console.log("Task updated in DB:", updatedTask);
                // Emit the updated task directly
                io.emit("taskUpdated", updatedTask);
            } else {
                console.log("Task not found");
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    });

    // Listen for task deletion
    socket.on("deleteTask", ({ taskId, userId }) => {
        console.log("Task deleted:", taskId);
        io.emit("taskDeleted", { taskId, userId }); // Emit taskId and userId
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};