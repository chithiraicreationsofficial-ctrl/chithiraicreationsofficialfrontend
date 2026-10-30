import React, { useState, useEffect, useCallback, useMemo } from "react";
import { inquiryAPI, getAdminInfo } from "../../services/apiService";
import { toast } from "react-toastify";
import "./InquiryList.css";
import {
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiPhone,
  FiPhoneCall,
  FiPhoneIncoming,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiX,
  FiDownload,
  FiCopy,
  FiMessageSquare,
  FiUserCheck,
  FiArrowUpRight,
  FiAlertCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

const InquiryList = () => {
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({
    totalInquiries: 0,
    totalCallsCame: 0,
    totalInquiry: 0,
    totalProcess: 0,
    totalRegistered: 0,
    totalCompleted: 0,
    todayInquiries: 0,
  });
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [datePreset, setDatePreset] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    status: "INQUIRY",
    source: "Direct Call",
    notes: "",
  });

  const [editFormData, setEditFormData] = useState({
    id: null,
    phone: "",
    name: "",
    status: "INQUIRY",
    source: "Direct Call",
    call_count: 1,
    notes: "",
  });

  const admin = getAdminInfo();

  // Helper to calculate date presets
  const applyDatePreset = (preset) => {
    setDatePreset(preset);
    const today = new Date();
    const formatDate = (d) => d.toISOString().split("T")[0];

    if (preset === "all") {
      setStartDate("");
      setEndDate("");
    } else if (preset === "today") {
      const todayStr = formatDate(today);
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = formatDate(yesterday);
      setStartDate(yStr);
      setEndDate(yStr);
    } else if (preset === "this_week") {
      const firstDay = new Date(today);
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday
      firstDay.setDate(diff);
      setStartDate(formatDate(firstDay));
      setEndDate(formatDate(today));
    } else if (preset === "this_month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(formatDate(firstDay));
      setEndDate(formatDate(today));
    }
  };

  // Fetch inquiries from API
  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== "ALL") params.status = statusFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await inquiryAPI.getAll(params);
      if (res.data && res.data.success) {
        setInquiries(res.data.data || []);
      } else {
        toast.error(res.data?.message || "Failed to load inquiries");
      }
    } catch (err) {
      console.error("Error fetching inquiries:", err);
      toast.error("Network error fetching inquiries");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, startDate, endDate]);

  // Fetch statistics summary
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await inquiryAPI.getStats(params);
      if (res.data && res.data.success) {
        setStats(res.data.stats || {});
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInquiries();
      fetchStats();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchInquiries, fetchStats]);

  // Manual status change handler
  const handleStatusChange = async (id, newStatus) => {
    // Optimistic UI update
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    try {
      const res = await inquiryAPI.updateStatus(id, newStatus);
      if (res.data && res.data.success) {
        toast.success(`Status changed to ${formatStatusLabel(newStatus)}`);
        fetchStats();
      } else {
        toast.error(res.data?.message || "Failed to update status");
        fetchInquiries();
      }
    } catch (err) {
      toast.error("Error updating status");
      fetchInquiries();
    }
  };

  // Log an additional call (+1 Call Count)
  const handleLogCall = async (inquiry) => {
    try {
      const res = await inquiryAPI.logCall(inquiry.id);
      if (res.data && res.data.success) {
        toast.success(res.data.message || "Call count updated!");
        fetchInquiries();
        fetchStats();
      } else {
        toast.error(res.data?.message || "Failed to log call");
      }
    } catch (err) {
      toast.error("Failed to log call");
    }
  };

  // Add Inquiry Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      toast.warn("Please enter a phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await inquiryAPI.create(formData);
      if (res.data && res.data.success) {
        toast.success(res.data.message || "Inquiry added successfully!");
        setShowAddModal(false);
        setFormData({
          phone: "",
          name: "",
          status: "INQUIRY",
          source: "Direct Call",
          notes: "",
        });
        fetchInquiries();
        fetchStats();
      } else {
        toast.error(res.data?.message || "Could not add inquiry");
      }
    } catch (err) {
      toast.error("Server error creating inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Inquiry Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.phone.trim()) {
      toast.warn("Phone number is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await inquiryAPI.update(editFormData.id, editFormData);
      if (res.data && res.data.success) {
        toast.success("Inquiry updated successfully!");
        setShowEditModal(false);
        fetchInquiries();
        fetchStats();
      } else {
        toast.error(res.data?.message || "Failed to update inquiry");
      }
    } catch (err) {
      toast.error("Server error updating inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (inq) => {
    setEditFormData({
      id: inq.id,
      phone: inq.phone || "",
      name: inq.name || "",
      status: inq.status || "INQUIRY",
      source: inq.source || "Direct Call",
      call_count: inq.call_count || 1,
      notes: inq.notes || "",
    });
    setShowEditModal(true);
  };

  // Delete Inquiry
  const handleDeleteConfirm = async () => {
    if (!selectedInquiry) return;
    setIsSubmitting(true);
    try {
      const res = await inquiryAPI.delete(selectedInquiry.id);
      if (res.data && res.data.success) {
        toast.success("Inquiry deleted successfully");
        setShowDeleteModal(false);
        setSelectedInquiry(null);
        fetchInquiries();
        fetchStats();
      } else {
        toast.error(res.data?.message || "Failed to delete inquiry");
      }
    } catch (err) {
      toast.error("Server error deleting inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy Phone Number
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.info(`Copied: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Clear all filters
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDatePreset("all");
    setStartDate("");
    setEndDate("");
  };

  // Helper labels
  const formatStatusLabel = (st) => {
    switch (st) {
      case "INQUIRY":
        return "Inquiry";
      case "PROCESS":
        return "In Process";
      case "REGISTERED":
        return "Registered User";
      case "COMPLETED":
        return "Completed";
      default:
        return st;
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!inquiries.length) {
      toast.warn("No inquiry data to export");
      return;
    }

    const headers = [
      "#",
      "Phone Number",
      "Caller Name",
      "Status",
      "Call Count",
      "Source",
      "Notes",
      "Contest Registration",
      "Created Date",
      "Last Call Date",
    ];

    const rows = inquiries.map((item, idx) => [
      idx + 1,
      item.phone,
      `"${(item.name || "").replace(/"/g, '""')}"`,
      item.status,
      item.call_count || 1,
      item.source || "Direct Call",
      `"${(item.notes || "").replace(/"/g, '""')}"`,
      item.diwaliRegistration ? `Token: ${item.diwaliRegistration.token}` : "Not Registered",
      new Date(item.created_at).toLocaleString(),
      new Date(item.last_called_at || item.created_at).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `inquiries_report_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded successfully");
  };

  return (
    <div className="inquiry-page-container">
      {/* Page Header */}
      <div className="inquiry-header-row">
        <div className="inquiry-title-wrap">
          <h2>
            <span className="title-icon">📞</span> Inquiry & Call Management
          </h2>
          <p className="inquiry-subtitle">
            Log incoming calls, track caller status from inquiry to registered participant, and manage follow-ups.
          </p>
        </div>

        <div className="header-action-buttons">
          <button
            className="action-btn-refresh"
            onClick={() => {
              fetchInquiries();
              fetchStats();
              toast.info("Refreshed list");
            }}
            disabled={loading}
            title="Refresh Data"
          >
            <FiRefreshCw className={loading ? "spin-icon" : ""} />
            <span>Refresh</span>
          </button>

          <button
            className="action-btn-export"
            onClick={handleExportCSV}
            title="Export filtered inquiries to CSV"
          >
            <FiDownload />
            <span>Export CSV</span>
          </button>

          <button
            className="action-btn-add-primary"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus size={18} />
            <span>Add Number / Inquiry</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="inquiry-stats-grid">
        {/* Card 1: Total Calls Came */}
        <div
          className={`stat-card stat-total ${statusFilter === "ALL" ? "card-active" : ""}`}
          onClick={() => setStatusFilter("ALL")}
        >
          <div className="stat-card-header">
            <span className="stat-icon-wrap icon-blue">
              <FiPhoneIncoming size={22} />
            </span>
            <span className="stat-badge-sub">
              {stats.totalCallsCame} Total Calls
            </span>
          </div>
          <div className="stat-card-body">
            <h3>{stats.totalInquiries || 0}</h3>
            <p>Total Inquiries (Calls Came)</p>
          </div>
          <div className="stat-card-footer">
            <span>⚡ Today: {stats.todayInquiries || 0} new calls</span>
          </div>
        </div>

        {/* Card 2: Status Inquiry */}
        <div
          className={`stat-card stat-inquiry ${statusFilter === "INQUIRY" ? "card-active" : ""}`}
          onClick={() => setStatusFilter("INQUIRY")}
        >
          <div className="stat-card-header">
            <span className="stat-icon-wrap icon-amber">
              <FiPhoneCall size={22} />
            </span>
            <span className="stat-status-pill pill-inquiry">New Leads</span>
          </div>
          <div className="stat-card-body">
            <h3>{stats.totalInquiry || 0}</h3>
            <p>New Inquiries</p>
          </div>
          <div className="stat-card-footer">
            <span>Pending follow-up / Callback</span>
          </div>
        </div>

        {/* Card 3: In Process */}
        <div
          className={`stat-card stat-process ${statusFilter === "PROCESS" ? "card-active" : ""}`}
          onClick={() => setStatusFilter("PROCESS")}
        >
          <div className="stat-card-header">
            <span className="stat-icon-wrap icon-purple">
              <FiClock size={22} />
            </span>
            <span className="stat-status-pill pill-process">Ongoing</span>
          </div>
          <div className="stat-card-body">
            <h3>{stats.totalProcess || 0}</h3>
            <p>In Process</p>
          </div>
          <div className="stat-card-footer">
            <span>Conversations in progress</span>
          </div>
        </div>

        {/* Card 4: Registered User */}
        <div
          className={`stat-card stat-registered ${statusFilter === "REGISTERED" ? "card-active" : ""}`}
          onClick={() => setStatusFilter("REGISTERED")}
        >
          <div className="stat-card-header">
            <span className="stat-icon-wrap icon-teal">
              <FiUserCheck size={22} />
            </span>
            <span className="stat-status-pill pill-registered">Converted</span>
          </div>
          <div className="stat-card-body">
            <h3>{stats.totalRegistered || 0}</h3>
            <p>Registered User</p>
          </div>
          <div className="stat-card-footer">
            <span>Successfully registered in contest</span>
          </div>
        </div>

        {/* Card 5: Completed */}
        <div
          className={`stat-card stat-completed ${statusFilter === "COMPLETED" ? "card-active" : ""}`}
          onClick={() => setStatusFilter("COMPLETED")}
        >
          <div className="stat-card-header">
            <span className="stat-icon-wrap icon-green">
              <FiCheckCircle size={22} />
            </span>
            <span className="stat-status-pill pill-completed">Done</span>
          </div>
          <div className="stat-card-body">
            <h3>{stats.totalCompleted || 0}</h3>
            <p>Completed Process</p>
          </div>
          <div className="stat-card-footer">
            <span>Fully closed & verified</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Section */}
      <div className="inquiry-filter-card">
        {/* Row 1: Search & Status Filters */}
        <div className="filter-primary-row">
          <div className="search-box-wrap">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by phone number, caller name, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="inquiry-search-input"
            />
            {search && (
              <button
                className="clear-search-btn"
                onClick={() => setSearch("")}
                title="Clear search"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          <div className="status-pills-selector">
            {[
              { key: "ALL", label: "All Status" },
              { key: "INQUIRY", label: "Inquiry" },
              { key: "PROCESS", label: "In Process" },
              { key: "REGISTERED", label: "Registered User" },
              { key: "COMPLETED", label: "Completed" },
            ].map((pill) => (
              <button
                key={pill.key}
                className={`status-filter-pill ${statusFilter === pill.key ? "active" : ""}`}
                onClick={() => setStatusFilter(pill.key)}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Date Filters & Preset Buttons */}
        <div className="filter-secondary-row">
          <div className="date-presets-wrap">
            <span className="date-label">
              <FiCalendar /> Filter Date:
            </span>
            <div className="date-btn-group">
              {[
                { key: "all", label: "All Time" },
                { key: "today", label: "Today" },
                { key: "yesterday", label: "Yesterday" },
                { key: "this_week", label: "This Week" },
                { key: "this_month", label: "This Month" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  className={`date-preset-btn ${datePreset === btn.key ? "active" : ""}`}
                  onClick={() => applyDatePreset(btn.key)}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="custom-date-inputs">
            <div className="date-input-group">
              <label>From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setDatePreset("custom");
                  setStartDate(e.target.value);
                }}
              />
            </div>

            <div className="date-input-group">
              <label>To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setDatePreset("custom");
                  setEndDate(e.target.value);
                }}
              />
            </div>

            {(search || statusFilter !== "ALL" || startDate || endDate) && (
              <button className="reset-filter-btn" onClick={resetFilters}>
                <FiX /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="inquiry-table-card">
        <div className="table-header-meta">
          <span className="meta-results-count">
            Showing <strong>{inquiries.length}</strong> record
            {inquiries.length === 1 ? "" : "s"}
          </span>
          {loading && <span className="loading-tag">Updating...</span>}
        </div>

        <div className="table-responsive-wrapper">
          <table className="inquiry-data-table">
            <thead>
              <tr>
                <th style={{ width: "50px" }}>#</th>
                <th style={{ minWidth: "170px" }}>Phone Number</th>
                <th style={{ minWidth: "150px" }}>Caller Name</th>
                <th style={{ minWidth: "180px" }}>Status (Manual Change)</th>
                <th style={{ minWidth: "130px" }}>Calls Received</th>
                <th style={{ minWidth: "220px" }}>Contest & Notes</th>
                <th style={{ minWidth: "150px" }}>Date & Time</th>
                <th style={{ minWidth: "120px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && inquiries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-table-cell">
                    <div className="table-loader">
                      <FiRefreshCw className="spin-icon" size={26} />
                      <p>Loading inquiries...</p>
                    </div>
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-table-cell">
                    <div className="empty-state-wrap">
                      <FiAlertCircle size={40} className="empty-icon" />
                      <h4>No inquiries found</h4>
                      <p>
                        No calls or phone inquiries match the current search or date filters.
                      </p>
                      <button
                        className="btn-create-first"
                        onClick={() => setShowAddModal(true)}
                      >
                        + Add First Number
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                inquiries.map((inq, index) => {
                  const isRegistered =
                    inq.isRegisteredUser || !!inq.diwaliRegistration;

                  return (
                    <tr key={inq.id} className="inquiry-table-row">
                      {/* Index */}
                      <td className="col-index">{index + 1}</td>

                      {/* Phone Number with Action Links */}
                      <td className="col-phone">
                        <div className="phone-number-block">
                          <span className="phone-text">{inq.phone}</span>
                          <div className="phone-action-shortcuts">
                            {/* Copy button */}
                            <button
                              className="shortcut-icon-btn copy-btn"
                              onClick={() => copyToClipboard(inq.phone, inq.id)}
                              title="Copy number"
                            >
                              <FiCopy size={13} />
                              {copiedId === inq.id && (
                                <span className="copied-tooltip">Copied!</span>
                              )}
                            </button>

                            {/* Direct Call Link */}
                            <a
                              href={`tel:${inq.phone}`}
                              className="shortcut-icon-btn call-btn"
                              title="Call this number"
                            >
                              <FiPhone size={13} />
                            </a>

                            {/* WhatsApp Link */}
                            <a
                              href={`https://wa.me/91${inq.phone.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shortcut-icon-btn whatsapp-btn"
                              title="Chat on WhatsApp"
                            >
                              <FaWhatsapp size={14} />
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Caller Name */}
                      <td className="col-name">
                        <div className="caller-name-wrap">
                          <strong className="caller-name">
                            {inq.name ? inq.name : <span className="unknown-text">Unknown Caller</span>}
                          </strong>
                          <span className="source-tag">{inq.source || "Direct Call"}</span>
                        </div>
                      </td>

                      {/* Manual Status Change Selector */}
                      <td className="col-status">
                        <div className="status-selector-wrap">
                          <select
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                            className={`status-dropdown-select status-${inq.status.toLowerCase()}`}
                          >
                            <option value="INQUIRY">📞 Inquiry</option>
                            <option value="PROCESS">⏳ In Process</option>
                            <option value="REGISTERED">🎟️ Registered User</option>
                            <option value="COMPLETED">✅ Completed</option>
                          </select>
                        </div>
                      </td>

                      {/* Calls Received Count & +1 Log Call */}
                      <td className="col-calls">
                        <div className="calls-count-box">
                          <span className="call-count-pill" title="Total calls from this number">
                            <FiPhoneIncoming size={12} />
                            <strong>{inq.call_count || 1}</strong>{" "}
                            {(inq.call_count || 1) === 1 ? "call" : "calls"}
                          </span>
                          <button
                            className="btn-log-call-quick"
                            onClick={() => handleLogCall(inq)}
                            title="Click to record that another call came from this number"
                          >
                            +1 Call
                          </button>
                        </div>
                      </td>

                      {/* Contest Link & Notes */}
                      <td className="col-notes">
                        <div className="notes-container">
                          {isRegistered && (
                            <div className="contest-linked-badge">
                              <span className="star-icon">✨</span>
                              <span>
                                {inq.diwaliRegistration ? (
                                  <>
                                    <strong>{inq.diwaliRegistration.token}</strong> (
                                    {inq.diwaliRegistration.category}) -{" "}
                                    {inq.diwaliRegistration.sweet_name}
                                  </>
                                ) : (
                                  "Registered Participant"
                                )}
                              </span>
                            </div>
                          )}

                          {inq.notes ? (
                            <div className="notes-text" title={inq.notes}>
                              <FiMessageSquare size={12} className="note-icon" />
                              <span>{inq.notes}</span>
                            </div>
                          ) : (
                            <span className="no-notes-text">No notes added</span>
                          )}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="col-date">
                        <div className="date-time-block">
                          <span className="date-main">
                            {new Date(inq.created_at).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="time-sub">
                            {new Date(inq.created_at).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="col-actions">
                        <div className="action-buttons-wrap">
                          <button
                            className="btn-action-edit"
                            onClick={() => openEditModal(inq)}
                            title="Edit Inquiry Details"
                          >
                            <FiEdit2 size={15} />
                          </button>

                          <button
                            className="btn-action-delete"
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setShowDeleteModal(true);
                            }}
                            title="Delete Record"
                          >
                            <FiTrash2 size={15} />
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
      </div>

      {/* ================= MODAL: ADD NUMBER / INQUIRY ================= */}
      {showAddModal && (
        <div className="modal-backdrop-overlay">
          <div className="inquiry-modal-card">
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <span className="modal-icon-badge">
                  <FiPhoneCall size={20} />
                </span>
                <div>
                  <h3>Add Phone Number / Inquiry</h3>
                  <p>Log a new caller or incoming inquiry</p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="inquiry-modal-form">
              <div className="form-row-group">
                <div className="form-field-item required">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    autoFocus
                  />
                  <small className="field-hint">
                    Enter mobile number (if existing, call count increments)
                  </small>
                </div>

                <div className="form-field-item">
                  <label>Caller Name</label>
                  <input
                    type="text"
                    placeholder="Enter caller's name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-row-group">
                <div className="form-field-item">
                  <label>Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="INQUIRY">📞 Inquiry (Default)</option>
                    <option value="PROCESS">⏳ In Process</option>
                    <option value="REGISTERED">🎟️ Registered User</option>
                    <option value="COMPLETED">✅ Completed</option>
                  </select>
                </div>

                <div className="form-field-item">
                  <label>Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                  >
                    <option value="Direct Call">Direct Phone Call</option>
                    <option value="WhatsApp">WhatsApp Message</option>
                    <option value="Instagram">Instagram DM / Reel</option>
                    <option value="Website">Website Form</option>
                    <option value="Referral">Friend / Referral</option>
                  </select>
                </div>
              </div>

              <div className="form-field-item">
                <label>Call Notes / Remarks</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Asked about photo submission criteria, interested in Diwali sweet contest..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding Number..." : "Save Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT INQUIRY ================= */}
      {showEditModal && (
        <div className="modal-backdrop-overlay">
          <div className="inquiry-modal-card">
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <span className="modal-icon-badge">
                  <FiEdit2 size={20} />
                </span>
                <div>
                  <h3>Edit Inquiry Details</h3>
                  <p>Update caller status, remarks, or number</p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="inquiry-modal-form">
              <div className="form-row-group">
                <div className="form-field-item required">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-field-item">
                  <label>Caller Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-row-group">
                <div className="form-field-item">
                  <label>Status (Manual Change)</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, status: e.target.value })
                    }
                  >
                    <option value="INQUIRY">📞 Inquiry</option>
                    <option value="PROCESS">⏳ In Process</option>
                    <option value="REGISTERED">🎟️ Registered User</option>
                    <option value="COMPLETED">✅ Completed</option>
                  </select>
                </div>

                <div className="form-field-item">
                  <label>Calls Count</label>
                  <input
                    type="number"
                    min="1"
                    value={editFormData.call_count}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        call_count: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-field-item">
                <label>Source</label>
                <select
                  value={editFormData.source}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, source: e.target.value })
                  }
                >
                  <option value="Direct Call">Direct Phone Call</option>
                  <option value="WhatsApp">WhatsApp Message</option>
                  <option value="Instagram">Instagram DM / Reel</option>
                  <option value="Website">Website Form</option>
                  <option value="Referral">Friend / Referral</option>
                </select>
              </div>

              <div className="form-field-item">
                <label>Notes & Follow-up History</label>
                <textarea
                  rows="4"
                  value={editFormData.notes}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, notes: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-modal-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {showDeleteModal && selectedInquiry && (
        <div className="modal-backdrop-overlay">
          <div className="inquiry-modal-card modal-delete-card">
            <div className="delete-modal-content">
              <div className="delete-icon-wrap">
                <FiTrash2 size={32} />
              </div>
              <h3>Delete Inquiry Record?</h3>
              <p>
                Are you sure you want to delete inquiry for{" "}
                <strong>{selectedInquiry.phone}</strong> (
                {selectedInquiry.name || "Unknown Caller"})? This action cannot be undone.
              </p>

              <div className="delete-modal-actions">
                <button
                  className="btn-modal-cancel"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedInquiry(null);
                  }}
                  disabled={isSubmitting}
                >
                  Keep Record
                </button>
                <button
                  className="btn-delete-confirm"
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Deleting..." : "Yes, Delete Record"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryList;
