const Appointment = require("../models/Appointment");

// CREATE APPOINTMENT
const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL APPOINTMENTS
const getAppointments = async (req, res) => {
  try {
    const data = await Appointment.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
};