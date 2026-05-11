import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const result = await login(form.email, form.password);

      if (result.success) {
        navigate("/hospitals");
      } else {
        setError(result.message || "Login failed.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <p>Access your HealthCare Service account.</p>

        {error && <div className="form-error">{error}</div>}

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
            placeholder="Enter your password"
          />
        </label>

        <button className="primary-button full-button" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="auth-switch">
          Do not have an account? <Link to="/signup">Create account</Link>
        </p>
      </form>
    </section>
  );
}