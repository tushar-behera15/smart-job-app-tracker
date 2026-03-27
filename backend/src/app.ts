import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import resumeRoutes from "./routes/resume.routes";
import analysisRoutes from "./routes/analysis.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/analysis", analysisRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Smart Job Application Tracker API is running 🚀");
});

// Error handling middleware
app.use(errorHandler);

export default app;