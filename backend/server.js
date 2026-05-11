import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testDatabaseConnection } from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import healthcareRoutes from "./routes/healthcare.routes.js";
import bloodbankRoutes from "./routes/bloodbank.routes.js";
import pharmacyRoutes from "./routes/pharmacy.routes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/healthcare", healthcareRoutes);
app.use("/api/bloodbank", bloodbankRoutes);
app.use("/api/pharmacy", pharmacyRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HealthCare Service API is running",
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await testDatabaseConnection();

    res.json({
      success: true,
      message: "Backend and MySQL are working",
    });
  } catch (error) {
    console.error("Health check error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});



app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    await testDatabaseConnection();
  } catch (error) {
    console.error("Initial database connection failed:", error.message);
  }
});