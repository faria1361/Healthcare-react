import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signup(
        form.name,
        form.email,
        form.password,
        form.confirmPassword
      );

      if (result.success) {
        navigate("/hospitals");
      } else {
        setError(result.message || "Signup failed.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Register a new HealthCare Service account.</p>

        {error && <div className="form-error">{error}</div>}

        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={updateField}
            required
            placeholder="Enter your full name"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            required
            placeholder="Enter your email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={updateField}
            required
            placeholder="Create a password"
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={updateField}
            required
            placeholder="Confirm your password"
          />
        </label>

        <button className="primary-button full-button" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </section>
  );
}