import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/apiService";
import logo from "../../assets/logo_header.png";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await adminAPI.loginStep1(email, password);

      if (response.data && response.data.success) {
        const token = response.data.data?.token;
        const admin = response.data.data?.admin;

        if (token) {
          localStorage.setItem("adminToken", token);
          localStorage.setItem("adminLoginTime", new Date().toISOString());
          if (admin) {
            localStorage.setItem("adminInfo", JSON.stringify(admin));
          }
          navigate("/admin/dashboard");
        } else {
          setError("Login failed: Authentication token missing.");
        }
      } else {
        setError(response.data?.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to connect to server. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="login-logo-container">
            <img
              src={logo}
              alt="Chithirai Creations"
              className="login-logo"
              onError={(e) => {
                e.currentTarget.src =
                  "https://res.cloudinary.com/dlcgqwmin/image/upload/v1763730196/logo_header_yaeedm.png";
              }}
            />
          </div>
          <h2>Admin Portal</h2>
          <p className="admin-subtitle">Chithirai Creations Management</p>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@chithiraicreations.in"
              className={error ? "error" : ""}
              disabled={isLoading}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={error ? "error" : ""}
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In to Admin Portal"}
          </button>

          <div className="login-help">
            <p>Use your registered administrator credentials</p>
          </div>
        </form>

        <div className="admin-login-info">
          <p>🔒 Authorized Administrator Access Only</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
