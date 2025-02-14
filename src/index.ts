import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/dbConnection";
import errorMiddleware from "./middleware/errorMiddleware";
import authRouter from "./routes/authRoute";
import userRoutes from "./routes/userRoute";
import taskRoutes from "./routes/taskRoute";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { setupWebSocket } from "./socket";

dotenv.config();
const app = express();
const httpServer = createServer(app);

// Setup WebSocket
const io = setupWebSocket(httpServer);

const PORT = process.env.PORT || 5000;

// ---------------Connect to DB-----------------------
connectDB();

// -----------------Middleware----------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// -----------------Routes---------------------
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/auth/", authRouter);
app.use("/api/user/", userRoutes);
app.use("/api/task/", taskRoutes);

// --------------Error middleware--------------------
app.use(errorMiddleware);

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { io };