import express from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

const bdLocations = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail"],
  Chattogram: ["Chattogram", "Cox's Bazar", "Cumilla", "Feni"],
  Rajshahi: ["Rajshahi", "Bogura", "Pabna"],
  Khulna: ["Khulna", "Jashore", "Kushtia"],
  Barishal: ["Barishal", "Bhola", "Patuakhali"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Gaibandha"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona"],
};

router.get("/locations", (req, res) => {
  res.json({ success: true, data: bdLocations });
});

router.get("/donors", async (req, res) => {
  try {
    const { blood_group, division, district } = req.query;

    let sql = "SELECT * FROM blood_bank_donors WHERE available = 1";
    const params = [];

    if (blood_group) {
      sql += " AND blood_group = ?";
      params.push(blood_group);
    }

    if (division) {
      sql += " AND division = ?";
      params.push(division);
    }

    if (district) {
      sql += " AND district = ?";
      params.push(district);
    }

    sql += " ORDER BY total_donations DESC, name ASC";

    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Donor fetch error:", error);
    res.status(500).json({ success: false, message: "Could not load donors." });
  }
});

router.post("/donors", requireAuth, async (req, res) => {
  try {
    const {
      name,
      age,
      blood_group,
      phone,
      email,
      division,
      district,
      address,
      last_donation_date,
    } = req.body;

    if (!name || !age || !blood_group || !phone || !division || !district) {
      return res.status(400).json({
        success: false,
        message: "Required donor fields are missing.",
      });
    }

    await pool.query(
      `INSERT INTO blood_bank_donors
      (user_id, name, age, blood_group, phone, email, division, district, address, last_donation_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        name,
        age,
        blood_group,
        phone,
        email || req.user.email || null,
        division,
        district,
        address || "",
        last_donation_date || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Donor registered successfully.",
    });
  } catch (error) {
    console.error("Donor create error:", error);
    res.status(500).json({ success: false, message: "Could not register donor." });
  }
});

router.get("/requests/open", async (req, res) => {
  try {
    const { blood_group, division, district } = req.query;

    let sql = "SELECT * FROM blood_bank_requests WHERE status = 'pending'";
    const params = [];

    if (blood_group) {
      sql += " AND blood_group = ?";
      params.push(blood_group);
    }

    if (division) {
      sql += " AND division = ?";
      params.push(division);
    }

    if (district) {
      sql += " AND district = ?";
      params.push(district);
    }

    sql += " ORDER BY is_emergency DESC, date_needed ASC, created_at DESC";

    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Open request fetch error:", error);
    res.status(500).json({ success: false, message: "Could not load requests." });
  }
});

router.post("/requests", requireAuth, async (req, res) => {
  try {
    const {
      patient_name,
      blood_group,
      contact,
      hospital_location,
      division,
      district,
      date_needed,
      units_required,
      is_emergency,
      additional_notes,
    } = req.body;

    if (
      !patient_name ||
      !blood_group ||
      !contact ||
      !hospital_location ||
      !division ||
      !district ||
      !date_needed
    ) {
      return res.status(400).json({
        success: false,
        message: "Required request fields are missing.",
      });
    }

    await pool.query(
      `INSERT INTO blood_bank_requests
      (requester_user_id, patient_name, blood_group, contact, hospital_location, division, district, date_needed, units_required, is_emergency, additional_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        patient_name,
        blood_group,
        contact,
        hospital_location,
        division,
        district,
        date_needed,
        units_required || 1,
        is_emergency ? 1 : 0,
        additional_notes || "",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Blood request created successfully.",
    });
  } catch (error) {
    console.error("Request create error:", error);
    res.status(500).json({ success: false, message: "Could not create request." });
  }
});

router.patch("/requests/:id/accept", requireAuth, async (req, res) => {
  try {
    const requestId = req.params.id;

    const [result] = await pool.query(
      `UPDATE blood_bank_requests
       SET status = 'accepted', donor_user_id = ?, updated_at = NOW()
       WHERE id = ? AND status = 'pending'`,
      [req.user.id, requestId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Request not found or already handled.",
      });
    }

    res.json({
      success: true,
      message: "Blood request accepted successfully.",
    });
  } catch (error) {
    console.error("Request accept error:", error);
    res.status(500).json({ success: false, message: "Could not accept request." });
  }
});

export default router;