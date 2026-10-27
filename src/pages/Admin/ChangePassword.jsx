import React, { useState } from "react";
import { adminAPI } from "../../services/apiService";
import "./AdminProfile.css";

const AdminProfile = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await adminAPI.changePassword(
        currentPassword,
        newPassword
      );

      if (response.data.success) {
        setMessage("Password changed successfully");
        setMessageType("success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Auto-clear success message
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to change password");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-profile">
      <div className="profile-header">
        <h2>Admin Profile</h2>
        <p>Manage your account settings</p>
      </div>

      <div className="profile-info-card">
        <div className="profile-info-header">
          <div className="admin-avatar">
            {adminInfo.name?.charAt(0).toUpperCase()}
          </div>
          <div className="admin-details">
            <h3>{adminInfo.name}</h3>
            <p className="admin-email">{adminInfo.email}</p>
            <p className="admin-role">
              <span className={`role-badge role-${adminInfo.role}`}>
                {adminInfo.role?.replace("_", " ")}
              </span>
            </p>
            {adminInfo.lastLogin && (
              <p className="last-login">
                Last login: {new Date(adminInfo.lastLogin).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="change-password-card">
        <h3>Change Password</h3>

        {message && <div className={`message ${messageType}`}>{message}</div>}

        <form onSubmit={handleChangePassword} className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              disabled={isLoading}
            />
            <div className="password-hint">
              Password must be at least 6 characters long
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="change-password-btn"
            disabled={isLoading}
          >
            {isLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>

      <div className="security-info mt-5">
        <h4>Security Information</h4>
        <div className="security-items">
          <div className="security-item">
            <span className="icon">🔐</span>
            <div>
              <p className="label">Two-Factor Authentication</p>
              <p className="value">Enabled (Google Authenticator)</p>
            </div>
          </div>
          <div className="security-item">
            <span className="icon">🕒</span>
            <div>
              <p className="label">Session Timeout</p>
              <p className="value">8 hours of inactivity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
