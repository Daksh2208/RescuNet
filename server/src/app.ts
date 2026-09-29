import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"
import incidentRoutes from "./modules/incident/incident.routes.js"
import uploadRoutes from "./modules/upload/upload.routes.js"
import reunificationRoutes from "./routes/reunification.routes.js";
import shelterRoutes from "./routes/shelter.routes.js";
import communityRoutes from "./routes/community.routes.js";
import geocodeRoutes from "./routes/geocode.routes.js";
import taskRoutes from "./routes/task.routes.js";
import fosterRoutes from "./routes/foster.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminUserRoutes from "./routes/adminUser.routes.js";
import adminIncidentRoutes from "./routes/adminIncident.routes.js";
import adminResourceRoutes from "./routes/adminResource.routes.js";
import adminBroadcastRoutes from "./routes/adminBroadcast.routes.js";
import adminAuditLogRoutes from "./routes/adminAuditLog.routes.js";

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
app.use("/api/reunification", reunificationRoutes);
app.use("/api/shelters", shelterRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/geocode", geocodeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/foster", fosterRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/incidents", adminIncidentRoutes);
app.use("/api/admin/resources", adminResourceRoutes);
app.use("/api/admin/broadcast", adminBroadcastRoutes);
app.use("/api/admin/audit-logs", adminAuditLogRoutes);

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "ResQNet Backend Running 🚀",
  });
});

export default app;