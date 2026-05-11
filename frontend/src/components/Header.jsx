import { Link } from "react-router-dom";
import { LogOut, Search, Stethoscope, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header() {
  const { user, authLoading, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container header-content">
        <div className="logo-container">
          <Stethoscope size={36} strokeWidth={2.2} />

          <div>
            <h1 className="app-title">HealthCare Service</h1>
            <p className="app-subtitle">Powered by Team Titans</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search hospitals, doctors..."
            />
          </div>

          {authLoading ? (
            <button className="user-button" type="button">
              Loading...
            </button>
          ) : user ? (
            <div className="auth-area">
              <button className="user-button" type="button">
                <User size={18} />
                {user.name}
              </button>

              <button className="logout-button" type="button" onClick={logout}>
                <LogOut size={17} />
                Logout
              </button>
            </div>
          ) : (
            <Link className="user-button" to="/signin">
              <User size={18} />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}