import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"
import incidentRoutes from "./modules/incident/incident.routes.js"
import uploadRoutes from "./modules/upload/upload.routes.js"

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "ResQNet Backend Running 🚀",
  });
});

export default app;