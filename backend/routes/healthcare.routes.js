import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/nearby", async (req, res) => {
  try {
    const type = String(req.query.type || "hospital").toLowerCase();

    if (!["hospital", "diagnostic"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Use hospital or diagnostic.",
      });
    }

    const lat = Number(req.query.lat || 23.7808);
    const lng = Number(req.query.lng || 90.3791);
    const limit = Math.min(Math.max(Number(req.query.limit || 10), 1), 50);

    const distanceSql = `
      6371 * ACOS(
        LEAST(1, GREATEST(-1,
          COS(RADIANS(?)) *
          COS(RADIANS(latitude)) *
          COS(RADIANS(longitude) - RADIANS(?)) +
          SIN(RADIANS(?)) *
          SIN(RADIANS(latitude))
        ))
      )
    `;

    const sql = `
      SELECT
        id,
        facility_type,
        name,
        division,
        district,
        area,
        address,
        latitude,
        longitude,
        phone,
        services,
        beds,
        rating,
        country,
        ROUND(${distanceSql}, 2) AS distance_km
      FROM healthcare_locations
      WHERE country = 'Bangladesh'
        AND facility_type = ?
        AND is_active = 1
      ORDER BY distance_km ASC
      LIMIT ${limit}
    `;

    const [rows] = await pool.query(sql, [lat, lng, lat, type]);

    const data = rows.map((row) => ({
      ...row,
      latitude: Number(row.latitude),
      longitude: Number(row.longitude),
      distance_km: Number(row.distance_km),
      rating: row.rating !== null ? Number(row.rating) : null,
      beds: row.beds !== null ? Number(row.beds) : null,
      services: row.services
        ? row.services.split(",").map((item) => item.trim()).filter(Boolean)
        : [],
    }));

    res.json({
      success: true,
      type,
      country: "Bangladesh",
      origin: {
        lat,
        lng,
      },
      data,
    });
  } catch (error) {
    console.error("Healthcare nearby error:", error);

    res.status(500).json({
      success: false,
      message: "Could not load healthcare locations.",
    });
  }
});

export default router;