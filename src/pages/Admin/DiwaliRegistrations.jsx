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
  FiUserPlus,
  FiUploadCloud,
  FiImage,
  FiEdit2,
} from "react-icons/fi";
import { FaInstagram } from "react-icons/fa6";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.PROD
    ? "https://api.chithiraicreations.in"
    : "http://localhost:8000");

// All 38 Districts of Tamil Nadu
const TN_DISTRICTS = [
  "Madurai", "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari",
  "Karur", "Krishnagiri", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris",
  "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga",
  "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar"
];

const initialAdminFormData = {
  name: "",
  age: "",
  gender: "Female",
  state: "Tamil Nadu",
  district: "Madurai",
  instagramProfile: "",
  phone: "",
  email: "",
  sweetName: "",
  category: "Reel Category",
  ingredients: "",
};

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

  // Modals
  const [screenshotModal, setScreenshotModal] = useState(null); // { url, participant }
  const [screenshotError, setScreenshotError] = useState(false);
  const [brokenImages, setBrokenImages] = useState(new Set());
  const [detailsModal, setDetailsModal] = useState(null); // participant object
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(null); // participant object to delete

  // Admin Direct Registration Modal States
  const [showAdminRegisterModal, setShowAdminRegisterModal] = useState(false);
  const [adminFormData, setAdminFormData] = useState(initialAdminFormData);
  const [adminFormScreenshot, setAdminFormScreenshot] = useState(null);
  const [adminFormPreview, setAdminFormPreview] = useState(null);
  const [submittingAdminForm, setSubmittingAdminForm] = useState(false);
  const [adminFormError, setAdminFormError] = useState("");

  // Edit Participant Modal States (Live Data Editing)
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    age: "",
    gender: "Female",
    state: "Tamil Nadu",
    district: "Chennai",
    phone: "",
    email: "",
    instagramProfile: "",
    sweetName: "",
    category: "Photo Category",
    ingredients: "",
    token: "",
    status: "VERIFIED",
    resendEmail: false,
  });
  const [editScreenshotFile, setEditScreenshotFile] = useState(null);
  const [editScreenshotPreview, setEditScreenshotPreview] = useState(null);
  const [submittingEditForm, setSubmittingEditForm] = useState(false);
  const [editFormError, setEditFormError] = useState("");

  const openEditModal = (item) => {
    setEditModal(item);
    setEditForm({
      name: item.name || "",
      age: item.age || "",
      gender: item.gender || "Female",
      state: item.state || "Tamil Nadu",
      district: item.district || "Chennai",
      phone: item.phone || "",
      email: item.email || "",
      instagramProfile: item.instagram_profile || "",
      sweetName: item.sweet_name || "",
      category: item.category || "Photo Category",
      ingredients: item.ingredients || "",
      token: item.token || "",
      status: item.status || "PENDING",
      resendEmail: false,
    });
    setEditScreenshotFile(null);
    setEditScreenshotPreview(null);
    setEditFormError("");
  };

  const handleEditScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setEditFormError("Only image files (JPG, PNG, WEBP) are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setEditFormError("File size cannot exceed 10MB.");
      return;
    }

    setEditScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = () => setEditScreenshotPreview(reader.result);
    reader.readAsDataURL(file);
    setEditFormError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (
      !editForm.name ||
      !editForm.phone ||
      !editForm.email ||
      !editForm.sweetName ||
      !editForm.district
    ) {
      setEditFormError("Please fill in all mandatory fields (Name, Phone, Email, District, Sweet Name).");
      return;
    }

    try {
      setSubmittingEditForm(true);
      setEditFormError("");

      let payload;
      if (editScreenshotFile) {
        payload = new FormData();
        Object.entries(editForm).forEach(([key, val]) => {
          payload.append(key, val);
        });
        payload.append("paymentScreenshot", editScreenshotFile);
      } else {
        payload = { ...editForm };
      }

      const res = await diwaliAPI.updateRegistration(editModal.id, payload);
      if (res.data?.success) {
        toast.success(res.data.message || `Participant ${editForm.name} updated successfully!`);
        if (res.data.emailStatus === "sent") {
          toast.info(`Updated confirmation email sent to ${editForm.email}`);
        }
        setEditModal(null);
        fetchRegistrations();
      } else {
        setEditFormError(res.data?.message || "Failed to update participant.");
      }
    } catch (err) {
      console.error("Edit registration error:", err);
      setEditFormError(err.response?.data?.message || "Failed to update participant. Please try again.");
    } finally {
      setSubmittingEditForm(false);
    }
  };

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
    const isReel = (participant.category || "").toLowerCase().includes("reel");
    const tokenType = isReel ? "REFR (Reel Series)" : "REFP (Photo Series)";
    const confirmVerify = window.confirm(
      `Verify payment proof for ${participant.name}? This will assign a sequential token (${tokenType}) and email it to ${participant.email}.`
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

        if (screenshotModal?.participant?.id === participant.id) {
          setScreenshotModal(null);
        }

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

  // Handle Admin Direct Registration Form Change
  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData((prev) => ({ ...prev, [name]: value }));
    setAdminFormError("");
  };

  const handleAdminScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setAdminFormError("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }

    setAdminFormScreenshot(file);
    setAdminFormPreview(URL.createObjectURL(file));
    setAdminFormError("");
  };

  const handleRemoveAdminScreenshot = () => {
    setAdminFormScreenshot(null);
    if (adminFormPreview) {
      URL.revokeObjectURL(adminFormPreview);
      setAdminFormPreview(null);
    }
  };

  // Handle Admin Direct Registration Submit
  const handleAdminRegisterSubmit = async (e) => {
    e.preventDefault();
    setAdminFormError("");

    if (!adminFormData.name.trim()) {
      setAdminFormError("Please enter participant's full name.");
      return;
    }
    if (!adminFormData.age || Number(adminFormData.age) < 4) {
      setAdminFormError("Minimum age required to participate is 4 years+.");
      return;
    }
    const cleanPhone = adminFormData.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setAdminFormError("Please enter a valid 10-digit mobile number.");
      return;
    }
    const cleanEmail = adminFormData.email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setAdminFormError("Please enter a valid email address.");
      return;
    }
    if (!adminFormData.instagramProfile.trim()) {
      setAdminFormError("Please enter participant's Instagram handle / profile.");
      return;
    }
    if (!adminFormData.sweetName.trim()) {
      setAdminFormError("Please enter the sweet or palagaram dish name.");
      return;
    }

    try {
      setSubmittingAdminForm(true);
      const postData = new FormData();
      postData.append("name", adminFormData.name.trim());
      postData.append("age", adminFormData.age);
      postData.append("gender", adminFormData.gender);
      postData.append("state", adminFormData.state || "Tamil Nadu");
      postData.append("district", adminFormData.district);
      postData.append("instagramProfile", adminFormData.instagramProfile.trim());
      postData.append("phone", cleanPhone);
      postData.append("email", cleanEmail);
      postData.append("sweetName", adminFormData.sweetName.trim());
      postData.append("category", adminFormData.category);
      postData.append("ingredients", adminFormData.ingredients ? adminFormData.ingredients.trim() : "");
      postData.append("adminName", adminInfo.name || "Chithirai Creations Admin");

      if (adminFormScreenshot) {
        postData.append("paymentScreenshot", adminFormScreenshot);
      }

      const res = await diwaliAPI.adminRegister(postData);

      if (res.data?.success) {
        toast.success(
          `🎉 Registered & Verified! Token ${res.data.token} generated & emailed directly to ${cleanEmail}.`
        );
        setShowAdminRegisterModal(false);
        setAdminFormData(initialAdminFormData);
        setAdminFormScreenshot(null);
        if (adminFormPreview) {
          URL.revokeObjectURL(adminFormPreview);
          setAdminFormPreview(null);
        }
        // Refresh registrations and stats
        fetchRegistrations();
      }
    } catch (err) {
      console.error("Admin registration error:", err);
      setAdminFormError(
        err.response?.data?.message || "Failed to submit registration. Please check fields."
      );
    } finally {
      setSubmittingAdminForm(false);
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
            Official participant entries, payment proof verification, token issuance (REFR / REFP series), and live participant roster
          </p>
        </div>
        <div className="header-actions-group">
          <button
            className="btn-add-registration"
            onClick={() => {
              setAdminFormData(initialAdminFormData);
              setAdminFormScreenshot(null);
              setAdminFormPreview(null);
              setAdminFormError("");
              setShowAdminRegisterModal(true);
            }}
            title="Register Participant Directly"
          >
            <FiUserPlus /> + New Registration
          </button>
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
            <span className="stat-sub">REFR (Reels) &bull; REFP (Photos)</span>
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
              {stats.reelCategoryCount} Reels &bull; {stats.photoCategoryCount} Photos
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
              <option value="Reel Category">Reel Category (REFR)</option>
              <option value="Photo Category">Photo Category (REFP)</option>
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
              &bull; Filtered by Date: <strong>{dateFilter}</strong>
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

                    {/* Token & Status (Clean: Token + Date, No Registration ID) */}
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
                        {item.gender} &bull; {item.age} yrs
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
                        brokenImages.has(item.id) ? (
                          <button
                            type="button"
                            className="btn-broken-screenshot-pill"
                            onClick={() => openEditModal(item)}
                            title="Image file expired on serverless storage. Click to re-upload proof."
                          >
                            <FiAlertTriangle size={13} />
                            <span>Re-upload</span>
                          </button>
                        ) : (
                          <div
                            className="screenshot-thumb-wrap"
                            onClick={() => {
                              setScreenshotError(false);
                              setScreenshotModal({
                                url: getFullImageUrl(item.payment_screenshot),
                                participant: item,
                              });
                            }}
                            title="Click to view payment proof"
                          >
                            <img
                              src={getFullImageUrl(item.payment_screenshot)}
                              alt="Payment Proof"
                              className="screenshot-thumb"
                              onError={() =>
                                setBrokenImages((prev) => new Set(prev).add(item.id))
                              }
                            />
                            <div className="thumb-overlay">
                              <FiEye /> View
                            </div>
                          </div>
                        )
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

                        {/* Edit Button (Live Data) */}
                        <button
                          className="btn-action-edit"
                          onClick={() => openEditModal(item)}
                          title="Edit Participant Details"
                        >
                          <FiEdit2 /> Edit
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

      {/* ========================================================
          ADMIN DIRECT REGISTRATION MODAL
          (Direct entry by admin: automatically VERIFIED, token generated,
          and email dispatched immediately without separate verification)
          ======================================================== */}
      {showAdminRegisterModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAdminRegisterModal(false)}>
          <div className="admin-modal-dialog admin-register-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <h4>+ New Contest Registration</h4>
                <p>
                  Direct admin entry &bull; Automatically marked <strong>VERIFIED</strong> &bull; Token (REFR01/REFP01) emailed immediately
                </p>
              </div>
              <button
                className="btn-modal-close"
                onClick={() => setShowAdminRegisterModal(false)}
                disabled={submittingAdminForm}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAdminRegisterSubmit} className="admin-register-form">
              <div className="admin-modal-body">
                {adminFormError && (
                  <div className="admin-form-alert error">
                    <FiAlertTriangle /> {adminFormError}
                  </div>
                )}

                <div className="admin-form-grid">
                  {/* Participant Name */}
                  <div className="form-field">
                    <label>
                      Participant Full Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={adminFormData.name}
                      onChange={handleAdminFormChange}
                      placeholder="e.g. Priyadharshini"
                      required
                    />
                  </div>

                  {/* Age */}
                  <div className="form-field">
                    <label>
                      Age (Years) <span className="req">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      min="4"
                      max="100"
                      value={adminFormData.age}
                      onChange={handleAdminFormChange}
                      placeholder="e.g. 24"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div className="form-field">
                    <label>Gender <span className="req">*</span></label>
                    <select
                      name="gender"
                      value={adminFormData.gender}
                      onChange={handleAdminFormChange}
                      required
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Contest Category */}
                  <div className="form-field">
                    <label>Contest Category <span className="req">*</span></label>
                    <select
                      name="category"
                      value={adminFormData.category}
                      onChange={handleAdminFormChange}
                      required
                    >
                      <option value="Reel Category">Reel Category (Tokens: REFR01, REFR02...)</option>
                      <option value="Photo Category">Photo Category (Tokens: REFP01, REFP02...)</option>
                    </select>
                  </div>

                  {/* WhatsApp Mobile */}
                  <div className="form-field">
                    <label>
                      WhatsApp Mobile Number <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={adminFormData.phone}
                      onChange={handleAdminFormChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="form-field">
                    <label>
                      Email Address <span className="req">*</span>
                      <small className="field-note">(Token sent here directly)</small>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={adminFormData.email}
                      onChange={handleAdminFormChange}
                      placeholder="e.g. participant@gmail.com"
                      required
                    />
                  </div>

                  {/* District */}
                  <div className="form-field">
                    <label>District (Tamil Nadu) <span className="req">*</span></label>
                    <select
                      name="district"
                      value={adminFormData.district}
                      onChange={handleAdminFormChange}
                      required
                    >
                      {TN_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Instagram Profile */}
                  <div className="form-field">
                    <label>
                      Instagram Profile <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="instagramProfile"
                      value={adminFormData.instagramProfile}
                      onChange={handleAdminFormChange}
                      placeholder="e.g. @chef_priya or profile link"
                      required
                    />
                  </div>

                  {/* Sweet / Palagaram Name */}
                  <div className="form-field full-width">
                    <label>
                      Diwali Sweet / Palagaram Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="sweetName"
                      value={adminFormData.sweetName}
                      onChange={handleAdminFormChange}
                      placeholder="e.g. Special Ghee Mysore Pak / Ribbon Pakoda"
                      required
                    />
                  </div>

                  {/* Ingredients & Brief Procedure */}
                  <div className="form-field full-width">
                    <label>Ingredients &amp; Brief Procedure</label>
                    <textarea
                      name="ingredients"
                      rows="3"
                      value={adminFormData.ingredients}
                      onChange={handleAdminFormChange}
                      placeholder="List key ingredients and brief cooking process..."
                    />
                  </div>

                  {/* Payment Screenshot (Optional for Admin Direct Entry) */}
                  <div className="form-field full-width">
                    <label>
                      Payment Screenshot Proof <span className="optional-tag">(Optional for Admin Entry)</span>
                    </label>
                    {!adminFormPreview ? (
                      <div className="file-drop-area">
                        <input
                          type="file"
                          id="adminPaymentProofInput"
                          accept="image/*"
                          onChange={handleAdminScreenshotChange}
                          className="file-hidden-input"
                        />
                        <label htmlFor="adminPaymentProofInput" className="file-drop-label">
                          <FiUploadCloud className="upload-icon" />
                          <span>Click to upload payment screenshot (JPG, PNG, WEBP)</span>
                          <small>Up to 10MB</small>
                        </label>
                      </div>
                    ) : (
                      <div className="file-preview-strip">
                        <img src={adminFormPreview} alt="Screenshot Preview" className="file-preview-thumb" />
                        <div className="file-preview-info">
                          <span>{adminFormScreenshot?.name || "Payment Screenshot"}</span>
                          <small>{(adminFormScreenshot?.size / 1024).toFixed(1)} KB</small>
                        </div>
                        <button
                          type="button"
                          className="btn-remove-preview"
                          onClick={handleRemoveAdminScreenshot}
                          title="Remove file"
                        >
                          <FiX />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-modal-secondary"
                  onClick={() => setShowAdminRegisterModal(false)}
                  disabled={submittingAdminForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-primary"
                  disabled={submittingAdminForm}
                >
                  {submittingAdminForm ? (
                    <>
                      <FiRefreshCw className="spin-icon" /> Registering &amp; Sending Token...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle /> Register &amp; Send Token Immediately
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  Participant: <strong>{screenshotModal.participant.name}</strong> &bull; Phone:{" "}
                  <strong>{screenshotModal.participant.phone}</strong>
                </p>
              </div>
              <button className="btn-modal-close" onClick={() => setScreenshotModal(null)}>
                <FiX />
              </button>
            </div>

            <div className="admin-modal-body text-center">
              <div className="modal-image-preview-box">
                {screenshotError ? (
                  <div className="screenshot-failed-fallback">
                    <FiAlertTriangle size={36} className="text-amber-500" />
                    <h5>Payment Proof File Unavailable</h5>
                    <p>
                      This image was stored on ephemeral serverless storage and was lost during a Vercel serverless reset.
                    </p>
                    <button
                      type="button"
                      className="btn-modal-reupload"
                      onClick={() => {
                        const target = screenshotModal.participant;
                        setScreenshotModal(null);
                        openEditModal(target);
                      }}
                    >
                      <FiUploadCloud /> Re-upload Payment Proof (Edit)
                    </button>
                  </div>
                ) : (
                  <img
                    src={screenshotModal.url}
                    alt="Payment Screenshot Full"
                    className="modal-screenshot-full"
                    onError={() => setScreenshotError(true)}
                  />
                )}
              </div>
              {!screenshotError && (
                <div className="modal-quick-meta mt-3">
                  <span>Entry Fee: <strong>₹249</strong></span>
                  <span>&bull;</span>
                  <span>UPI ID: <strong>7010240042@upi</strong></span>
                  <span>&bull;</span>
                  <a
                    href={screenshotModal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-img-link"
                  >
                    <FiExternalLink /> Open Original Image
                  </a>
                </div>
              )}
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
                  Token: <strong>{detailsModal.token || "Not Assigned"}</strong> &bull; Status:{" "}
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
                  <span className="detail-val">{detailsModal.age} years &bull; {detailsModal.gender}</span>
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
                className="btn-modal-edit"
                onClick={() => {
                  const target = detailsModal;
                  setDetailsModal(null);
                  openEditModal(target);
                }}
              >
                <FiEdit2 /> Edit Details
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

      {/* ========================================================
          EDIT PARTICIPANT REGISTRATION MODAL (LIVE DATA)
          ======================================================== */}
      {editModal && (
        <div className="admin-modal-backdrop" onClick={() => setEditModal(null)}>
          <div className="admin-modal-dialog admin-register-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="modal-title-wrap">
                <span className="modal-kicker">Live Data Editor</span>
                <h4>Edit Registration: {editModal.name}</h4>
                <p>
                  Token: <strong>{editForm.token || "Not Assigned"}</strong> &bull; Reg ID:{" "}
                  <code>{editModal.registration_id}</code>
                </p>
              </div>
              <button
                className="btn-modal-close"
                onClick={() => setEditModal(null)}
                aria-label="Close edit modal"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="admin-register-form">
              <div className="admin-modal-body">
                {editFormError && (
                  <div className="admin-form-alert error">
                    <FiAlertTriangle /> {editFormError}
                  </div>
                )}

                <div className="admin-form-grid">
                  {/* Full Name */}
                  <div className="form-field">
                    <label>
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="e.g. Anupama Balaji"
                      required
                    />
                  </div>

                  {/* Age & Gender */}
                  <div className="form-field-split">
                    <div className="form-field">
                      <label>
                        Age <span className="req">*</span>
                      </label>
                      <input
                        type="number"
                        min="4"
                        max="120"
                        value={editForm.age}
                        onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>
                        Gender <span className="req">*</span>
                      </label>
                      <select
                        value={editForm.gender}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                        required
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* WhatsApp Mobile */}
                  <div className="form-field">
                    <label>
                      WhatsApp Mobile <span className="req">*</span>
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>

                  {/* Email Address */}
                  <div className="form-field">
                    <label>
                      Email Address <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="participant@gmail.com"
                      required
                    />
                  </div>

                  {/* District */}
                  <div className="form-field">
                    <label>
                      District <span className="req">*</span>
                    </label>
                    <select
                      value={editForm.district}
                      onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                      required
                    >
                      {TN_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* State */}
                  <div className="form-field">
                    <label>State</label>
                    <input
                      type="text"
                      value={editForm.state}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      placeholder="Tamil Nadu"
                    />
                  </div>

                  {/* Instagram Profile */}
                  <div className="form-field">
                    <label>
                      Instagram Profile <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.instagramProfile}
                      onChange={(e) => setEditForm({ ...editForm, instagramProfile: e.target.value })}
                      placeholder="@username"
                      required
                    />
                  </div>

                  {/* Sweet / Palagaram Name */}
                  <div className="form-field">
                    <label>
                      Sweet / Palagaram Name <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.sweetName}
                      onChange={(e) => setEditForm({ ...editForm, sweetName: e.target.value })}
                      placeholder="e.g. Mysore Pak, Laddu, Halwa"
                      required
                    />
                  </div>

                  {/* Contest Category */}
                  <div className="form-field">
                    <label>
                      Contest Category <span className="req">*</span>
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      required
                    >
                      <option value="Photo Category">Photo Category (REFP01 format)</option>
                      <option value="Reel Category">Reels Category (REFR01 format)</option>
                    </select>
                  </div>

                  {/* Token Number */}
                  <div className="form-field">
                    <label>
                      Token Number <span className="field-note">(Assigned ID)</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.token}
                      onChange={(e) => setEditForm({ ...editForm, token: e.target.value })}
                      placeholder="e.g. REFP01 or REFR01"
                    />
                  </div>

                  {/* Status */}
                  <div className="form-field">
                    <label>Registration Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    >
                      <option value="VERIFIED">VERIFIED</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>

                  {/* Payment Screenshot (Optional update) */}
                  <div className="form-field">
                    <label>
                      Payment Proof Screenshot <span className="optional-tag">(Optional replace)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditScreenshotChange}
                      id="editPaymentScreenshot"
                      className="screenshot-file-input"
                    />
                    <label htmlFor="editPaymentScreenshot" className="screenshot-upload-box">
                      <FiUploadCloud />
                      <span>{editScreenshotFile ? editScreenshotFile.name : "Replace payment screenshot"}</span>
                    </label>
                    {editScreenshotPreview ? (
                      <div className="admin-screenshot-preview">
                        <img src={editScreenshotPreview} alt="New Preview" />
                      </div>
                    ) : editModal.payment_screenshot ? (
                      <div className="current-screenshot-note">
                        Current: <a href={`${BACKEND_URL}${editModal.payment_screenshot}`} target="_blank" rel="noopener noreferrer">View Screenshot</a>
                      </div>
                    ) : null}
                  </div>

                  {/* Ingredients */}
                  <div className="form-field full-width">
                    <label>
                      Ingredients &amp; Recipe Highlights <span className="optional-tag">(Optional)</span>
                    </label>
                    <textarea
                      rows="2"
                      value={editForm.ingredients}
                      onChange={(e) => setEditForm({ ...editForm, ingredients: e.target.value })}
                      placeholder="e.g. Ghee, Besan, Sugar, Cardamom"
                    />
                  </div>

                  {/* Checkbox: Resend updated confirmation email */}
                  <div className="form-field full-width">
                    <label className="checkbox-label-custom">
                      <input
                        type="checkbox"
                        checked={editForm.resendEmail}
                        onChange={(e) => setEditForm({ ...editForm, resendEmail: e.target.checked })}
                      />
                      <span>Send updated official confirmation email to participant with revised details</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-modal-secondary"
                  onClick={() => setEditModal(null)}
                  disabled={submittingEditForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-primary"
                  disabled={submittingEditForm}
                >
                  {submittingEditForm ? (
                    <>
                      <FiRefreshCw className="spin-icon" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle /> Save Live Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
