

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./AdminLayout.css";
import { FiMenu, FiX } from "react-icons/fi";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 991);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const navigate = useNavigate();
  const location = useLocation();

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  // Keep window resize listener for responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 991;
      setIsMobile(mobile);
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Clean menu: Hidden the other 3 tickets items (All Tickets, Manual Entry, Verify Tickets)
  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/diwali-registrations", label: "Diwali Registrations", icon: "🪔" },
    { path: "/admin/profile", label: "My Profile", icon: "👤" },
    ...(adminInfo.role === "super_admin"
      ? [{ path: "/admin/manage-admins", label: "Manage Admins", icon: "👥" }]
      : []),
    ...(adminInfo.role === "super_admin"
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

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="sidebar-backdrop-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? "open" : "closed"} ${
          isMobile ? "mobile-drawer" : ""
        }`}
      >
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
            aria-label="Toggle navigation menu"
          >
            {isMobile ? <FiX size={20} /> : sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <div className="admin-info-sidebar">
          <div className="admin-avatar-sidebar">
            {adminInfo.name?.charAt(0).toUpperCase() || "A"}
          </div>
          {sidebarOpen && (
            <div className="admin-details-sidebar">
              <h4>{adminInfo.name || "Admin"}</h4>
              <p className="admin-email-sidebar">{adminInfo.email || ""}</p>
              <span className={`role-badge-sidebar role-${adminInfo.role || "admin"}`}>
                {adminInfo.role?.replace("_", " ") || "Admin"}
              </span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${isActiveRoute(item.path) ? "active" : ""}`}
              onClick={() => handleNavClick(item.path)}
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
      </aside>

      {/* Main Content */}
      <div className="admin-main-content">
        <header className="admin-header">
          <div className="header-left">
            {/* Hamburger button for mobile / tablet */}
            <button
              className="mobile-menu-trigger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </button>
            <div className="header-titles">
              <h1>
                {menuItems.find((item) => item.path === location.pathname)
                  ?.label || "Admin Panel"}
              </h1>
              <p className="breadcrumb">
                Admin Panel /{" "}
                {menuItems.find((item) => item.path === location.pathname)
                  ?.label || "Diwali Registrations"}
              </p>
            </div>
          </div>
          <div className="header-right">
            <div className="admin-welcome">
              <span>👋 Welcome, {adminInfo.name || "Admin"}</span>
              {adminInfo.lastLogin && (
                <span className="login-time">
                  Last login:{" "}
                  {new Date(adminInfo.lastLogin).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
