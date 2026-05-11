import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  return (
    <div className="app-container">
      <Header />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}