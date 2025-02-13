import express from "express";
import dotenv from  "dotenv";
import { connectDB } from "./config/dbConnection";
import errorMiddleware from "./middleware/errorMiddleware";
import authRouter from "./routes/authRoute";
import userRoutes from "./routes/userRoute";
import taskRoutes from "./routes/taskRoute";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();


const PORT = process.env.PORT || 5000;

// ---------------Connect to DB-----------------------
connectDB();


// -----------------Middleware----------------------
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});