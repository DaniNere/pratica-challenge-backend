import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import technicianRoutes from "./modules/technician/technician.routes.js";


export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
app.use("/api", authRoutes);
  app.use("/api", technicianRoutes);

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}