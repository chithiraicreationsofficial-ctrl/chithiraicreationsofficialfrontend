

import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/diwali-registrations", label: "Diwali Registrations", icon: "🪔" },
    { path: "/admin/tickets", label: "All Tickets", icon: "🎫" },
    { path: "/admin/manual-entry", label: "Manual Entry", icon: "✍️" },
    { path: "/admin/verification", label: "Verify Tickets", icon: "🔍" },
    { path: "/admin/profile", label: "My Profile", icon: "👤" },
    ...(adminInfo.role === "super_admin"
      ? [{ path: "/admin/manage-admins", label: "Manage Admins", icon: "👥" }]
      : []),  ...(adminInfo.role === "super_admin"
        ? [{ path: "/admin/sponsorships", label: "Manage Sponsors", icon: "👥" }]
        : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoginTime");
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <img
            src="https://res.cloudinary.com/dlcgqwmin/image/upload/v1763730196/logo_header_yaeedm.png"
            alt="Logo"
            className="sidebar-logo"
          />
          <h3>Admin Panel</h3>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <div className="admin-info-sidebar">
          <div className="admin-avatar-sidebar">
            {adminInfo.name?.charAt(0).toUpperCase()}
          </div>
          {sidebarOpen && (
            <div className="admin-details-sidebar">
              <h4>{adminInfo.name}</h4>
              <p className="admin-email-sidebar">{adminInfo.email}</p>
              <span className={`role-badge-sidebar role-${adminInfo.role}`}>
                {adminInfo.role?.replace("_", " ")}
              </span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActiveRoute(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        <div className="admin-header">
          <div className="header-left">
            <h1>
              {menuItems.find((item) => item.path === location.pathname)
                ?.label || "Admin Panel"}
            </h1>
            <p className="breadcrumb">
              Admin Panel /{" "}
              {menuItems.find((item) => item.path === location.pathname)
                ?.label || "Dashboard"}
            </p>
          </div>
          <div className="header-right">
            <div className="admin-welcome">
              <span>👋 Welcome, {adminInfo.name}</span>
              {adminInfo.lastLogin && (
                <span className="login-time">
                  Last login:{" "}
                  {new Date(adminInfo.lastLogin).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
