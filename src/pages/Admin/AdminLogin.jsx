import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/apiService";
import logo from "../../assets/logo_header.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          if (admin?.role === "chef" || admin?.email?.toLowerCase().includes("chef")) {
            navigate("/admin/score-card");
          } else {
            navigate("/admin/dashboard");
          }
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
          <div className="quick-login-chips">
            <button
              type="button"
              className="quick-chip-btn"
              onClick={() => {
                setEmail("chef@chitricreations.com");
                setPassword("chef@123!");
                setError("");
              }}
            >
              👨‍🍳 1-Tap Fill Chef Login
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email / Username</label>
            <input
              type="text"
              inputMode="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. chef@chitricreations.com"
              className={error ? "error" : ""}
              disabled={isLoading}
              required
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>

          <div className="form-group">
            <div className="password-label-row">
              <label htmlFor="password">Password</label>
            </div>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={error ? "error" : ""}
                disabled={isLoading}
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex="-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In to Admin Portal"}
          </button>

          <div className="login-help">
            <p>Chef Login: <strong>chef@chitricreations.com</strong> &bull; Password: <strong>chef@123!</strong></p>
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
