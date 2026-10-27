import React, { useState, useEffect, useCallback } from "react";
import { diwaliAPI, getAdminInfo } from "../../services/apiService";
import { toast } from "react-toastify";
import "./DiwaliRegistrations.css";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiMail,
  FiExternalLink,
  FiX,
  FiUser,
  FiDollarSign,
  FiAward,
  FiTrash2,
  FiCalendar,
  FiAlertTriangle,
} from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";

const BACKEND_URL = "http://localhost:8000";

export default function DiwaliRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    verifiedRegistrations: 0,
    pendingRegistrations: 0,
    reelCategoryCount: 0,
    photoCategoryCount: 0,
    totalFeeCollected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Modal states
  const [screenshotModal, setScreenshotModal] = useState(null); // { url, participant }
  const [detailsModal, setDetailsModal] = useState(null); // participant object
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null); // participant object to delete

  const adminInfo = getAdminInfo();

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const [regRes, statsRes] = await Promise.all([
        diwaliAPI.getRegistrations({
          status: statusFilter,
          category: categoryFilter,
          search: search.trim(),
          date: dateFilter || undefined,
        }),
        diwaliAPI.getStats(),
      ]);

      if (regRes.data?.success) {
        setRegistrations(regRes.data.data || []);
      }
      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error("Error fetching diwali registrations:", err);
      toast.error("Failed to load registrations from database.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, search, dateFilter]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Handle Verify Participant & Send Token
  const handleVerify = async (participant) => {
    const confirmVerify = window.confirm(
      `Verify payment proof for ${participant.name}? This will assign a sequential token (e.g. DDPVREG01) and email it to ${participant.email}.`
    );
    if (!confirmVerify) return;

    try {
      setVerifyingId(participant.id);
      const res = await diwaliAPI.verifyParticipant(participant.id, {
        verifiedBy: adminInfo.name || "Admin",
      });

      if (res.data?.success) {
        toast.success(
          `✅ Verified! Token ${res.data.token} generated & emailed to ${participant.email}`
        );

        // Update local state immediately
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === participant.id
              ? {
                  ...r,
                  status: "VERIFIED",
                  token: res.data.token,
                  verified_at: new Date().toISOString(),
                  verified_by: adminInfo.name || "Admin",
                }
              : r
          )
        );

        // Close screenshot modal if open for this participant
        if (screenshotModal?.participant?.id === participant.id) {
          setScreenshotModal(null);
        }

        // Refresh stats
        const statsRes = await diwaliAPI.getStats();
        if (statsRes.data?.success) setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error("Verification failed:", err);
      const msg = err.response?.data?.message || "Failed to verify participant.";
      toast.error(msg);
    } finally {
      setVerifyingId(null);
    }
  };

  // Handle Resend Token Email
  const handleResendToken = async (participant) => {
    try {
      setResendingId(participant.id);
      const res = await diwaliAPI.resendToken(participant.id);
      if (res.data?.success) {
        toast.success(`Token email resent to ${participant.email}`);
      }
    } catch (err) {
      console.error("Resend token error:", err);
      toast.error(err.response?.data?.message || "Failed to resend token email.");
    } finally {
      setResendingId(null);
    }
  };

  // Handle Delete Registration
  const confirmDeleteRegistration = async () => {
    if (!deleteConfirmModal) return;
    const participant = deleteConfirmModal;
    try {
      setDeletingId(participant.id);
      const res = await diwaliAPI.deleteRegistration(participant.id);
      if (res.data?.success) {
        toast.success(
          `🗑️ Registration for ${participant.name} (${participant.token || participant.registration_id}) deleted successfully.`
        );
        setRegistrations((prev) => prev.filter((r) => r.id !== participant.id));
        setDeleteConfirmModal(null);
        if (detailsModal?.id === participant.id) {
          setDetailsModal(null);
        }
        if (screenshotModal?.participant?.id === participant.id) {
          setScreenshotModal(null);
        }
        // Refresh stats
        const statsRes = await diwaliAPI.getStats();
        if (statsRes.data?.success) setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.message || "Failed to delete registration.");
    } finally {
      setDeletingId(null);
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${BACKEND_URL}${path}`;
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="diwali-admin-container">
      {/* Top Banner */}
      <div className="diwali-admin-header">
        <div className="header-text-group">
          <div className="festive-badge">🪔 Digital Diwali Palagaram Villa 2026</div>
          <h2>Contest Registrations &amp; Verification</h2>
          <p>
            Official participant entries, payment proof verification, token issuance (DDPVREG01 series), and record management
          </p>
        </div>
        <div className="header-actions-group">
          <button
            className="btn-refresh"
            onClick={fetchRegistrations}
            disabled={loading}
            title="Refresh Data"
          >
            <FiRefreshCw className={loading ? "spin-icon" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="diwali-stats-grid">
        <div className="stat-card total-card">
          <div className="stat-icon-wrap">
            <FiUser />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Entries</span>
            <span className="stat-value">{stats.totalRegistrations}</span>
            <span className="stat-sub">Entry fee: ₹249</span>
          </div>
        </div>

        <div className="stat-card verified-card">
          <div className="stat-icon-wrap">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <span className="stat-label">Verified &amp; Tokens Sent</span>
            <span className="stat-value">{stats.verifiedRegistrations}</span>
            <span className="stat-sub">Official Tokens Issued</span>
          </div>
        </div>

        <div className="stat-card pending-card">
          <div className="stat-icon-wrap">
            <FiClock />
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Verification</span>
            <span className="stat-value">{stats.pendingRegistrations}</span>
            <span className="stat-sub">Action required</span>
          </div>
        </div>

        <div className="stat-card revenue-card">
          <div className="stat-icon-wrap">
            <FiDollarSign />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Fees Recorded</span>
            <span className="stat-value">₹{stats.totalFeeCollected.toLocaleString("en-IN")}</span>
            <span className="stat-sub">
              {stats.reelCategoryCount} Reels • {stats.photoCategoryCount} Photos
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="diwali-filter-toolbar">
        {/* Search */}
        <div className="search-input-wrap">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, phone, email, district, token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-search-input"
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch("")} title="Clear search">
              <FiX />
            </button>
          )}
        </div>

        {/* Dropdowns & Date Filter Group */}
        <div className="dropdown-filters-group">
          {/* Status Filter */}
          <div className="filter-select-wrap">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending (Unverified)</option>
              <option value="VERIFIED">Verified</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="filter-select-wrap">
            <label>Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Categories</option>
              <option value="Reel Category">Reel Category</option>
              <option value="Photo Category">Photo Category</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="filter-select-wrap filter-date-wrap">
            <label htmlFor="regDateInput">
              <FiCalendar className="filter-label-icon" /> Date:
            </label>
            <div className="date-input-container">
              <input
                type="date"
                id="regDateInput"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-date-input"
              />
              {dateFilter && (
                <button
                  className="clear-date-btn"
                  onClick={() => setDateFilter("")}
                  title="Clear date filter"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          {/* Quick Date Pills */}
          <div className="quick-date-pills">
            <button
              className={`date-pill-btn ${!dateFilter ? "active" : ""}`}
              onClick={() => setDateFilter("")}
              title="Show all dates"
            >
              All
            </button>
            <button
              className={`date-pill-btn ${dateFilter === todayStr ? "active" : ""}`}
              onClick={() => setDateFilter(todayStr)}
              title="Filter by today's date"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Filter Info Bar */}
      <div className="filter-info-bar">
        <span className="results-count">
          Showing <strong>{registrations.length}</strong> registration{registrations.length === 1 ? "" : "s"}
          {dateFilter && (
            <span className="active-date-tag">
              • Filtered by Date: <strong>{dateFilter}</strong>
              <button onClick={() => setDateFilter("")} className="tag-remove-btn" title="Remove date filter">
                <FiX />
              </button>
            </span>
          )}
        </span>
      </div>

      {/* Mobile Scroll Cue */}
      <div className="mobile-table-hint">
        <span>↔ Swipe table horizontally to view full details &amp; actions</span>
      </div>

      {/* Registrations Table */}
      <div className="table-responsive-wrapper">
        <table className="diwali-registrations-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Token / Status</th>
              <th>Participant</th>
              <th>Contact Details</th>
              <th>District</th>
              <th>Instagram</th>
              <th>Sweet / Palagaram</th>
              <th>Payment Proof</th>
              <th className="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && registrations.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-5">
                  <div className="loading-state">
                    <FiRefreshCw className="spin-icon fs-3 mb-2" />
                    <p>Loading registrations...</p>
                  </div>
                </td>
              </tr>
            ) : registrations.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-5 text-muted">
                  <div className="empty-state-wrap">
                    <p className="mb-2">No registrations found matching your criteria.</p>
                    {(search || statusFilter !== "ALL" || categoryFilter !== "ALL" || dateFilter) && (
                      <button
                        className="btn-clear-all-filters"
                        onClick={() => {
                          setSearch("");
                          setStatusFilter("ALL");
                          setCategoryFilter("ALL");
                          setDateFilter("");
                        }}
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              registrations.map((item, index) => {
                const isVerified = item.status === "VERIFIED";
                return (
                  <tr key={item.id} className={isVerified ? "row-verified" : "row-pending"}>
                    <td className="col-index">{index + 1}</td>

                    {/* Token & Status */}
                    <td className="col-status">
                      {isVerified ? (
                        <div className="token-verified-badge">
                          <FiCheckCircle className="badge-icon" />
                          <span className="token-code">{item.token}</span>
                          <span className="status-label">VERIFIED</span>
                        </div>
                      ) : (
                        <div className="token-pending-badge">
                          <FiClock className="badge-icon" />
                          <span className="status-label">PENDING</span>
                        </div>
                      )}
                      <span className="reg-id-subtext">{item.registration_id}</span>
                      {item.created_at && (
                        <span className="reg-date-subtext">
                          {new Date(item.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </td>

                    {/* Participant */}
                    <td className="col-participant">
                      <div className="participant-name">{item.name}</div>
                      <div className="participant-meta">
                        {item.gender} • {item.age} yrs
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="col-contact">
                      <div className="contact-phone">
                        <a href={`tel:${item.phone}`}>📞 {item.phone}</a>
                      </div>
                      <div className="contact-email">
                        <a href={`mailto:${item.email}`}>✉️ {item.email}</a>
                      </div>
                    </td>

                    {/* District */}
                    <td className="col-district">
                      <span className="district-pill">{item.district}</span>
                      <div className="state-name">{item.state || "Tamil Nadu"}</div>
                    </td>

                    {/* Instagram */}
                    <td className="col-instagram">
                      <a
                        href={
                          item.instagram_profile.startsWith("http")
                            ? item.instagram_profile
                            : `https://instagram.com/${item.instagram_profile.replace("@", "")}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="insta-link"
                      >
                        <FaInstagram /> {item.instagram_profile}
                      </a>
                    </td>

                    {/* Sweet & Category */}
                    <td className="col-sweet">
                      <div className="sweet-name-text">🍬 {item.sweet_name}</div>
                      <span
                        className={`category-pill ${
                          item.category?.includes("Reel") ? "pill-reel" : "pill-photo"
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>

                    {/* Payment Proof Screenshot */}
                    <td className="col-screenshot">
                      {item.payment_screenshot ? (
                        <div
                          className="screenshot-thumb-wrap"
                          onClick={() =>
                            setScreenshotModal({
                              url: getFullImageUrl(item.payment_screenshot),
                              participant: item,
                            })
                          }
                          title="Click to view payment proof"
                        >
                          <img
                            src={getFullImageUrl(item.payment_screenshot)}
                            alt="Payment Proof"
                            className="screenshot-thumb"
                          />
                          <div className="thumb-overlay">
                            <FiEye /> View
                          </div>
                        </div>
                      ) : (
                        <span className="no-screenshot-badge">No File</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="col-actions">
                      <div className="table-actions-group">
                        {!isVerified ? (
                          <button
                            className="btn-action-verify"
                            onClick={() => handleVerify(item)}
                            disabled={verifyingId === item.id}
                            title="Verify Payment & Send Token Email"
                          >
                            {verifyingId === item.id ? (
                              <>
                                <FiRefreshCw className="spin-icon" /> Verifying...
                              </>
                            ) : (
                              <>
                                <FiCheckCircle /> Verify &amp; Token
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            className="btn-action-resend"
                            onClick={() => handleResendToken(item)}
                            disabled={resendingId === item.id}
                            title="Resend Token Email to Participant"
                          >
                            <FiMail /> {resendingId === item.id ? "Sending..." : "Resend"}
                          </button>
                        )}

                        {/* Details Button */}
                        <button
                          className="btn-action-details"
                          onClick={() => setDetailsModal(item)}
                          title="View Full Details"
                        >
                          <FiEye /> Details
                        </button>

                        {/* Delete Button */}
                        <button
                          className="btn-action-delete"
                          onClick={() => setDeleteConfirmModal(item)}
                          disabled={deletingId === item.id}
                          title="Delete Registration"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="admin-modal-backdrop" onClick={() => setDeleteConfirmModal(null)}>
          <div className="admin-modal-dialog delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon-wrap">
              <FiAlertTriangle className="delete-warning-icon" />
            </div>
            <h3 className="delete-modal-title">Delete Registration?</h3>
            <p className="delete-modal-text">
              Are you sure you want to permanently delete registration for{" "}
              <strong>{deleteConfirmModal.name}</strong> (
              <code>{deleteConfirmModal.token || deleteConfirmModal.registration_id}</code>)?
            </p>
            <div className="delete-modal-details-box">
              <div className="del-row">
                <span className="del-lbl">Phone:</span>
                <span className="del-val">{deleteConfirmModal.phone}</span>
              </div>
              <div className="del-row">
                <span className="del-lbl">Email:</span>
                <span className="del-val">{deleteConfirmModal.email}</span>
              </div>
              <div className="del-row">
                <span className="del-lbl">Dish:</span>
                <span className="del-val">{deleteConfirmModal.sweet_name} ({deleteConfirmModal.category})</span>
              </div>
              <div className="del-row">
                <span className="del-lbl">Status:</span>
                <span className="del-val">{deleteConfirmModal.status}</span>
              </div>
            </div>
            <p className="delete-warning-note">
              ⚠️ This action cannot be undone. Contestant data and uploaded payment proof will be permanently deleted.
            </p>
            <div className="delete-modal-actions">
              <button
                className="btn-delete-cancel"
                onClick={() => setDeleteConfirmModal(null)}
                disabled={deletingId === deleteConfirmModal.id}
              >
                Cancel
              </button>
              <button
                className="btn-delete-confirm"
                onClick={confirmDeleteRegistration}
                disabled={deletingId === deleteConfirmModal.id}
              >
                {deletingId === deleteConfirmModal.id ? (
                  <>
                    <FiRefreshCw className="spin-icon" /> Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 /> Permanently Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Modal */}
      {screenshotModal && (
        <div className="admin-modal-backdrop" onClick={() => setScreenshotModal(null)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <h4>Payment Screenshot Verification</h4>
                <p>
                  Participant: <strong>{screenshotModal.participant.name}</strong> • Phone:{" "}
                  <strong>{screenshotModal.participant.phone}</strong>
                </p>
              </div>
              <button className="btn-modal-close" onClick={() => setScreenshotModal(null)}>
                <FiX />
              </button>
            </div>

            <div className="admin-modal-body text-center">
              <div className="modal-image-preview-box">
                <img
                  src={screenshotModal.url}
                  alt="Payment Screenshot Full"
                  className="modal-screenshot-full"
                />
              </div>
              <div className="modal-quick-meta mt-3">
                <span>Entry Fee: <strong>₹249</strong></span>
                <span>•</span>
                <span>UPI ID: <strong>7010240042@upi</strong></span>
                <span>•</span>
                <a
                  href={screenshotModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-img-link"
                >
                  <FiExternalLink /> Open Original Image
                </a>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="btn-modal-secondary"
                onClick={() => setScreenshotModal(null)}
              >
                Close
              </button>
              {screenshotModal.participant.status !== "VERIFIED" && (
                <button
                  className="btn-modal-primary"
                  onClick={() => handleVerify(screenshotModal.participant)}
                  disabled={verifyingId === screenshotModal.participant.id}
                >
                  {verifyingId === screenshotModal.participant.id ? (
                    "Verifying & Sending Token..."
                  ) : (
                    <>
                      <FiCheckCircle /> Confirm &amp; Send Token
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Details Modal */}
      {detailsModal && (
        <div className="admin-modal-backdrop" onClick={() => setDetailsModal(null)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <h4>Registration Details: {detailsModal.name}</h4>
                <p>
                  Token: <strong>{detailsModal.token || "Not Assigned"}</strong> • Status:{" "}
                  <strong>{detailsModal.status}</strong>
                </p>
              </div>
              <button className="btn-modal-close" onClick={() => setDetailsModal(null)}>
                <FiX />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="details-list-grid">
                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-val">{detailsModal.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Age &amp; Gender</span>
                  <span className="detail-val">{detailsModal.age} years • {detailsModal.gender}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">WhatsApp Mobile</span>
                  <span className="detail-val">{detailsModal.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-val">{detailsModal.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">District &amp; State</span>
                  <span className="detail-val">{detailsModal.district}, {detailsModal.state || "Tamil Nadu"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Instagram Profile</span>
                  <span className="detail-val">{detailsModal.instagram_profile}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sweet / Palagaram Name</span>
                  <span className="detail-val">{detailsModal.sweet_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category</span>
                  <span className="detail-val">{detailsModal.category}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">Ingredients &amp; Cooking Process</span>
                  <span className="detail-val text-pre">
                    {detailsModal.ingredients || "None specified"}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Registered At</span>
                  <span className="detail-val">
                    {new Date(detailsModal.created_at).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Verified By &amp; When</span>
                  <span className="detail-val">
                    {detailsModal.verified_by || "—"} ({detailsModal.verified_at ? new Date(detailsModal.verified_at).toLocaleString("en-IN") : "—"})
                  </span>
                </div>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button
                className="btn-modal-delete-danger"
                onClick={() => {
                  const target = detailsModal;
                  setDetailsModal(null);
                  setDeleteConfirmModal(target);
                }}
              >
                <FiTrash2 /> Delete Registration
              </button>
              <button
                className="btn-modal-secondary"
                onClick={() => setDetailsModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
