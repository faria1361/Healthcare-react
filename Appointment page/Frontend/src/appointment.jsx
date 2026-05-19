import React, { useState } from "react";
import "./Appointment.css";

const Appointment = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    doctor: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Appointment Data:", form);
    alert("Appointment Booked Successfully!");

    setForm({
      name: "",
      email: "",
      phone: "",
      doctor: "",
      date: "",
      time: "",
    });
  };

  return (
    <div className="appointment-container">
      <div className="appointment-card">

        {/* LEFT SIDE */}
        <div className="left">
          <h1>Book Appointment</h1>
          <p>Schedule your visit with expert doctors easily.</p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
            alt="doctor"
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="right">
          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <select
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              required
            >
              <option value="">Select Doctor</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Dermatologist">Dermatologist</option>
            </select>

            <input type="date" name="date" value={form.date} onChange={handleChange} required />
            <input type="time" name="time" value={form.time} onChange={handleChange} required />

            <button type="submit">Confirm Appointment</button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Appointment;