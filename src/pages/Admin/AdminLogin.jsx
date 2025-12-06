// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { adminAPI } from '../../services/apiService';
// import './AdminLogin.css';

// const AdminLogin = () => {
//     const [twoFACode, setTwoFACode] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {

//         try {
//             const response = await adminAPI.login(twoFACode);

//             console.log(response, "response");

//             if (response.data.success) {

//                 localStorage.setItem('adminToken', response.data.data.token);
//                 localStorage.setItem('adminLoginTime', new Date().toISOString());
//                 navigate('/admin/dashboard');
//             }
//         } catch (error) {
//             setError(error.response?.data?.message || 'Login failed');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="admin-login-container">
//             <div className="admin-login-card">
//                 <div className="admin-login-header">
//                     <h2>Admin Portal</h2>
//                     <p>New Year Celebration 2025</p>
//                 </div>

//                 <div className="admin-login-form" >
//                     <div className="form-group">
//                         <label htmlFor="twoFACode">2FA Code</label>
//                         <input
//                             type="text"
//                             id="twoFACode"
//                             value={twoFACode}
//                             onChange={(e) => setTwoFACode(e.target.value)}
//                             placeholder="Enter 6-digit 2FA code"
//                             className={error ? 'error' : ''}
//                             disabled={isLoading}
//                         />
//                         {error && <div className="error-message">{error}</div>}
//                     </div>

//                     <button
//                         type="submit"
//                         className="login-btn"
//                         disabled={isLoading}
//                         onClick={() => handleLogin()}
//                     >
//                         {isLoading ? 'Logging in...' : 'Login to Admin Portal'}
//                     </button>
//                 </div>

//                 <div className="admin-login-info">
//                     <p>🔒 Secure admin access with two-factor authentication</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminLogin;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/apiService";
import "./AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const navigate = useNavigate();

  const handleLoginStep1 = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await adminAPI.loginStep1(email, password);

      if (response.data.success) {
        if (response.data.data.requires2FA) {
          setRequires2FA(true);
          setAdminInfo(response.data.data.admin);
        } else {
          // Handle direct login (if configured)
          localStorage.setItem("adminToken", response.data.data.token);
          localStorage.setItem("adminLoginTime", new Date().toISOString());
          localStorage.setItem(
            "adminInfo",
            JSON.stringify(response.data.data.admin)
          );
          navigate("/admin/dashboard");
        }
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Check email and password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginStep2 = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await adminAPI.loginStep2(email, twoFACode);

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.data.token);
        localStorage.setItem("adminLoginTime", new Date().toISOString());
        localStorage.setItem(
          "adminInfo",
          JSON.stringify(response.data.data.admin)
        );
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid 2FA code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setRequires2FA(false);
    setTwoFACode("");
    setError("");
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img
            src="https://res.cloudinary.com/dlcgqwmin/image/upload/v1763730196/logo_header_yaeedm.png"
            alt="Logo"
            className="login-logo"
          />
          <h2>Admin Portal</h2>
          <p>New Year Celebration 2025</p>
        </div>

        {!requires2FA ? (
          <form onSubmit={handleLoginStep1} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@chithiraicreations.com"
                className={error ? "error" : ""}
                disabled={isLoading}
                required
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
              {isLoading ? "Verifying..." : "Continue to 2FA"}
            </button>

            <div className="login-help">
              <p>Use your registered admin email and password</p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLoginStep2} className="admin-login-form">
            <div className="twofa-header">
              <h3>Two-Factor Authentication</h3>
              <p>Welcome, {adminInfo?.name}</p>
              <p className="small-text">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="twoFACode">6-digit Code</label>
              <input
                type="text"
                id="twoFACode"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value)}
                placeholder="000000"
                maxLength="6"
                className={error ? "error" : ""}
                disabled={isLoading}
                required
              />
              <div className="input-hint">
                <span>Example: 123456</span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="twofa-actions">
              <button
                type="button"
                className="back-btn"
                onClick={handleBack}
                disabled={isLoading}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="verify-btn"
                disabled={isLoading || twoFACode.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify & Login"}
              </button>
            </div>

            <div className="twofa-help">
              <p>🔒 Using Google Authenticator or Authy</p>
              <p>⏱️ Code refreshes every 30 seconds</p>
            </div>
          </form>
        )}

        <div className="admin-login-info">
          <p>🔐 Secure admin access with two-factor authentication</p>
          <p className="small-text">
            If you're having trouble, contact super admin
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
