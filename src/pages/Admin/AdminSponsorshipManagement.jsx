// components/AdminSponsorshipManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  IoSearch,
  IoFilter,
  IoDownload,
  IoAdd,
  IoMail,
  IoCall,
  IoCalendar,
  IoPerson,
  IoBusiness,
  IoCash,
  IoCheckmark,
  IoClose,
  IoTime,
} from "react-icons/io5";
import { adminAPI } from "../../services/apiService";
import "./AdminSponsorshipManagement.css";

const AdminSponsorshipManagement = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSponsorship, setSelectedSponsorship] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    assignedTo: "all",
    page: 1,
    limit: 20,
  });
  const [stats, setStats] = useState({
    total: 0,
    status: {},
  });
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(""); // 'view', 'update', 'assign'
  const [admins, setAdmins] = useState([]);

  const statusOptions = [
    { value: "all", label: "All Status", color: "#6c757d" },
    { value: "pending", label: "Pending", color: "#ffc107" },
    { value: "contacted", label: "Contacted", color: "#17a2b8" },
    { value: "negotiating", label: "Negotiating", color: "#007bff" },
    { value: "approved", label: "Approved", color: "#28a745" },
    { value: "signed", label: "Signed", color: "#20c997" },
    { value: "paid", label: "Paid", color: "#6f42c1" },
    { value: "rejected", label: "Rejected", color: "#dc3545" },
  ];

  const budgetRanges = {
    "50k-100k": "₹50,000 - ₹1,00,000",
    "100k-250k": "₹1,00,000 - ₹2,50,000",
    "250k-500k": "₹2,50,000 - ₹5,00,000",
    "500k-1M": "₹5,00,000 - ₹10,00,000",
    "1M+": "₹10,00,000+",
    custom: "Custom",
  };

  // Fetch sponsorships
  const fetchSponsorships = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value);
        }
      });

      // This endpoint needs to be added to your API
      const response = await adminAPI.getSponsorships(params.toString());
      if (response.data.success) {
        setSponsorships(response.data.data.sponsorships);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch sponsorships");
      console.error("Fetch sponsorships error:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch admins for assignment
  const fetchAdmins = async () => {
    try {
      const response = await adminAPI.getAllAdmins();
      if (response.data.success) {
        setAdmins(response.data.data.admins);
      }
    } catch (error) {
      console.error("Fetch admins error:", error);
    }
  };

  useEffect(() => {
    fetchSponsorships();
    fetchAdmins();
  }, [fetchSponsorships]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? value : 1,
    }));
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await adminAPI.updateSponsorshipStatus(id, {
        status: newStatus,
      });
      if (response.data.success) {
        await fetchSponsorships();
        if (selectedSponsorship?._id === id) {
          setSelectedSponsorship((prev) => ({
            ...prev,
            status: newStatus,
          }));
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleAssign = async (id, adminId) => {
    try {
      const response = await adminAPI.assignSponsorship(id, { adminId });
      if (response.data.success) {
        await fetchSponsorships();
        setModalAction("");
        setShowModal(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to assign sponsorship");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return (
      <span
        className="status-badge"
        style={{ backgroundColor: option?.color || "#6c757d" }}
      >
        {option?.label || status}
      </span>
    );
  };

  const handleExport = async () => {
    try {
      const response = await adminAPI.exportSponsorships(filters);
      if (response.data.success) {
        // Convert to CSV and download
        const csvData = response.data.data.sponsorships;
        const csvContent = [
          Object.keys(csvData[0] || {}).join(","),
          ...csvData.map((row) => Object.values(row).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sponsorships_${
          new Date().toISOString().split("T")[0]
        }.csv`;
        a.click();
      }
    } catch (error) {
      setError("Failed to export data");
    }
  };

  if (loading && sponsorships.length === 0) {
    return (
      <div className="sponsorship-management loading">
        <div className="spinner"></div>
        <p>Loading sponsorships...</p>
      </div>
    );
  }

  return (
    <div className="sponsorship-management">
      {/* Header */}
      <div className="management-header">
        <div className="header-left">
          <h2>Sponsorship Management</h2>
          <p>Manage all sponsorship inquiries and partnerships</p>
        </div>
        <div className="header-actions">
          <button className="export-btn" onClick={handleExport}>
            <IoDownload /> Export CSV
          </button>
          <button className="refresh-btn" onClick={fetchSponsorships}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stats-grid">
          <div className="stat-card total">
            <h3>{stats.total || 0}</h3>
            <p>Total Inquiries</p>
          </div>
          <div className="stat-card pending">
            <h3>{stats.status?.pending || 0}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card contacted">
            <h3>{stats.status?.contacted || 0}</h3>
            <p>Contacted</p>
          </div>
          <div className="stat-card negotiating">
            <h3>{stats.status?.negotiating || 0}</h3>
            <p>Negotiating</p>
          </div>
          <div className="stat-card signed">
            <h3>{stats.status?.signed || 0}</h3>
            <p>Signed</p>
          </div>
          <div className="stat-card paid">
            <h3>{stats.status?.paid || 0}</h3>
            <p>Paid</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <IoSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by company, contact person, or email..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <div className="filter-controls">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="status-filter"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={filters.assignedTo}
            onChange={(e) => handleFilterChange("assignedTo", e.target.value)}
            className="assignee-filter"
          >
            <option value="all">All Assignees</option>
            {admins.map((admin) => (
              <option key={admin._id} value={admin._id}>
                {admin.name}
              </option>
            ))}
          </select>

          <select
            value={filters.limit}
            onChange={(e) => handleFilterChange("limit", e.target.value)}
            className="limit-filter"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Sponsorships Table */}
      <div className="sponsorships-table-container">
        <table className="sponsorships-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Budget</th>
              <th>Partnership Type</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sponsorships.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No sponsorships found
                </td>
              </tr>
            ) : (
              sponsorships.map((sponsorship) => (
                <tr key={sponsorship._id}>
                  <td>
                    <div className="company-cell">
                      <IoBusiness className="company-icon" />
                      <div>
                        <strong>{sponsorship.companyName}</strong>
                        <div className="email">{sponsorship.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <IoPerson className="contact-icon" />
                      <div>
                        <div>{sponsorship.contactPerson}</div>
                        <div className="phone">{sponsorship.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="budget-cell">
                      <IoCash className="budget-icon" />
                      <span>
                        {budgetRanges[sponsorship.budgetRange] ||
                          sponsorship.budgetRange}
                      </span>
                      {sponsorship.customBudget && (
                        <div className="custom-budget">
                          Custom: ₹
                          {sponsorship.customBudget.toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="partnership-types">
                      {sponsorship.formattedPartnershipTypes
                        ?.slice(0, 2)
                        .map((type, i) => (
                          <span key={i} className="partnership-tag">
                            {type}
                          </span>
                        ))}
                      {sponsorship.formattedPartnershipTypes?.length > 2 && (
                        <span className="more-tag">
                          +{sponsorship.formattedPartnershipTypes.length - 2}{" "}
                          more
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{getStatusBadge(sponsorship.status)}</td>
                  <td>
                    {sponsorship.assignedTo ? (
                      <div className="assigned-cell">
                        <IoPerson />
                        <span>{sponsorship.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="unassigned">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <div className="date-cell">
                      <IoCalendar />
                      <span>{formatDate(sponsorship.createdAt)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => {
                          setSelectedSponsorship(sponsorship);
                          setModalAction("view");
                          setShowModal(true);
                        }}
                      >
                        👁️ View
                      </button>

                      <button
                        className="assign-btn"
                        onClick={() => {
                          setSelectedSponsorship(sponsorship);
                          setModalAction("assign");
                          setShowModal(true);
                        }}
                      >
                        👤 Assign
                      </button>

                      <div className="status-actions">
                        <select
                          value={sponsorship.status}
                          onChange={(e) =>
                            handleStatusUpdate(sponsorship._id, e.target.value)
                          }
                          className="status-select"
                        >
                          {statusOptions
                            .filter((opt) => opt.value !== "all")
                            .map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {stats.total > 0 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={filters.page === 1}
            onClick={() => handleFilterChange("page", filters.page - 1)}
          >
            ← Previous
          </button>

          <div className="page-info">
            Page {filters.page} of {Math.ceil(stats.total / filters.limit)}
          </div>

          <button
            className="page-btn"
            disabled={filters.page >= Math.ceil(stats.total / filters.limit)}
            onClick={() => handleFilterChange("page", filters.page + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {/* Modal for View/Update/Assign */}
      {showModal && selectedSponsorship && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content sponsorship-modal">
              <div className="modal-header">
                <h3>
                  {modalAction === "view"
                    ? "Sponsorship Details"
                    : modalAction === "assign"
                    ? "Assign to Admin"
                    : "Update Sponsorship"}
                </h3>
                <button
                  className="close-modal"
                  onClick={() => setShowModal(false)}
                >
                  <IoClose />
                </button>
              </div>

              <div className="modal-body">
                {modalAction === "view" && (
                  <div className="sponsorship-details">
                    <div className="detail-section">
                      <h4>Company Information</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Company:</label>
                          <span>{selectedSponsorship.companyName}</span>
                        </div>
                        <div className="info-item">
                          <label>Contact Person:</label>
                          <span>{selectedSponsorship.contactPerson}</span>
                        </div>
                        <div className="info-item">
                          <label>Email:</label>
                          <span>
                            <a href={`mailto:${selectedSponsorship.email}`}>
                              {selectedSponsorship.email}
                            </a>
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Phone:</label>
                          <span>
                            <a href={`tel:${selectedSponsorship.phone}`}>
                              {selectedSponsorship.phone}
                            </a>
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Website:</label>
                          <span>
                            {selectedSponsorship.website ? (
                              <a
                                href={selectedSponsorship.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {selectedSponsorship.website}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Sponsorship Details</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <label>Interest Area:</label>
                          <span>{selectedSponsorship.interestArea}</span>
                        </div>
                        <div className="info-item">
                          <label>Budget Range:</label>
                          <span>
                            {budgetRanges[selectedSponsorship.budgetRange] ||
                              selectedSponsorship.budgetRange}
                            {selectedSponsorship.customBudget &&
                              ` (₹${selectedSponsorship.customBudget.toLocaleString(
                                "en-IN"
                              )})`}
                          </span>
                        </div>
                        <div className="info-item">
                          <label>Package Interest:</label>
                          <span>{selectedSponsorship.packageInterest}</span>
                        </div>
                        <div className="info-item">
                          <label>Status:</label>
                          <span>
                            {getStatusBadge(selectedSponsorship.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Partnership Types</h4>
                      <div className="partnership-tags">
                        {selectedSponsorship.formattedPartnershipTypes?.map(
                          (type, i) => (
                            <span key={i} className="partnership-tag large">
                              {type}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="detail-section">
                      <h4>Contract Details</h4>
                      {selectedSponsorship.contractAmount ? (
                        <div className="contract-info">
                          <div className="contract-item">
                            <label>Contract Amount:</label>
                            <span>
                              ₹
                              {selectedSponsorship.contractAmount.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>
                          <div className="contract-item">
                            <label>Payment Received:</label>
                            <span>
                              ₹
                              {selectedSponsorship.paymentAmount?.toLocaleString(
                                "en-IN"
                              ) || 0}
                            </span>
                          </div>
                          <div className="contract-item">
                            <label>Payment Status:</label>
                            <span
                              className={`payment-status ${selectedSponsorship.paymentStatus}`}
                            >
                              {selectedSponsorship.paymentStatus}
                            </span>
                          </div>
                          {selectedSponsorship.contractSignedAt && (
                            <div className="contract-item">
                              <label>Signed On:</label>
                              <span>
                                {formatDate(
                                  selectedSponsorship.contractSignedAt
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p>No contract details available</p>
                      )}
                    </div>

                    {selectedSponsorship.adminNotes && (
                      <div className="detail-section">
                        <h4>Admin Notes</h4>
                        <div className="notes-box">
                          {selectedSponsorship.adminNotes}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {modalAction === "assign" && (
                  <div className="assign-form">
                    <div className="form-group">
                      <label>Select Admin to Assign</label>
                      <select
                        className="admin-select"
                        onChange={(e) => {
                          const adminId = e.target.value;
                          if (adminId) {
                            handleAssign(selectedSponsorship._id, adminId);
                          }
                        }}
                      >
                        <option value="">Select an admin...</option>
                        {admins.map((admin) => (
                          <option key={admin._id} value={admin._id}>
                            {admin.name} ({admin.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="current-assignment">
                      {selectedSponsorship.assignedTo ? (
                        <p>
                          Currently assigned to:{" "}
                          <strong>{selectedSponsorship.assignedTo.name}</strong>
                        </p>
                      ) : (
                        <p>Currently unassigned</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                {modalAction === "view" && (
                  <>
                    <button
                      className="contact-btn"
                      onClick={() =>
                        window.open(
                          `mailto:${selectedSponsorship.email}`,
                          "_blank"
                        )
                      }
                    >
                      <IoMail /> Email
                    </button>
                    <button
                      className="call-btn"
                      onClick={() =>
                        window.open(
                          `tel:${selectedSponsorship.phone}`,
                          "_blank"
                        )
                      }
                    >
                      <IoCall /> Call
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSponsorshipManagement;
