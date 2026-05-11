import { NavLink } from "react-router-dom";
import {
  Ambulance as AmbulanceIcon,
  Building2,
  CalendarDays,
  Droplet,
  Hospital,
  Info,
  Microscope,
  Pill,
  Video,
} from "lucide-react";

const navItems = [
  {
    label: "Hospitals",
    path: "/hospitals",
    icon: Hospital,
  },
  {
    label: "Diagnostic Centers",
    path: "/diagnostic-centers",
    icon: Microscope,
  },
  {
    label: "Blood Banks",
    path: "/blood-banks",
    icon: Droplet,
  },
  {
    label: "Pharmacies",
    path: "/pharmacies",
    icon: Pill,
  },
  {
    label: "Ambulance",
    path: "/ambulance",
    icon: AmbulanceIcon,
  },
  {
    label: "Telemedicine",
    path: "/telemedicine",
    icon: Video,
  },
  {
    label: "Drug Interactions",
    path: "/drug-interactions",
    icon: Info,
  },
  {
    label: "Appointments",
    path: "/appointments",
    icon: CalendarDays,
  },
];

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="container nav-container">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}