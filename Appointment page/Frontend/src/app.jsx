import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppointmentPage from "./pages/AppointmentPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<h1>Healthcare Home</h1>} />
        <Route path="/appointment" element={<AppointmentPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;