import React, { useState, useEffect } from "react";
import { adminAPI, paymentAPI } from "../../services/apiService";
import "./Payments.css";
import { toast } from "react-toastify";


const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [summary, setSummary] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const itemsPerPage = 15;

  useEffect(() => {
    fetchPayments();
    fetchPaymentSummary();
  }, [currentPage, statusFilter]);

  const fetchPayments = async () => {
    try {
      const response = await paymentAPI.getAllPayments(
        currentPage,
        itemsPerPage,
        statusFilter
      );
      if (response.data.success) {
        setPayments(response.data.data.payments);
        setTotalPages(response.data.data.pagination.pages);
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentSummary = async () => {
    try {
      const response = await paymentAPI.getAllPayments(1, 1, "all");
      if (response.data.success) {
        setSummary(response.data.data.summary);
      }
    } catch (error) {
      console.error("Failed to fetch payment summary:", error);
    }
  };

  const handleRefund = async (ticketId) => {
    if (!window.confirm("Are you sure you want to refund this payment?")) {
      return;
    }

    try {
      const reason = prompt("Please enter refund reason:");
      if (!reason) return;

      const response = await paymentAPI.refundPayment(ticketId, reason);
      if (response.data.success) {
        toast.success("Refund processed successfully");
        fetchPayments();
        fetchPaymentSummary();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Refund failed");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      booked: { class: "status-success", label: "Completed", icon: "✅" },
      attended: { class: "status-success", label: "Completed", icon: "✅" },
      not_attended: { class: "status-warning", label: "Completed", icon: "✅" },
      cancelled: { class: "status-cancelled", label: "Refunded", icon: "🔄" },
    };

    const config = statusConfig[status] || {
      class: "status-default",
      label: status,
      icon: "❓",
    };
    return (
      <span className={`payment-status ${config.class}`}>
        {config.icon} {config.label}
      </span>
    );
  };

  const exportPaymentsToCSV = () => {
    const heade = [
      "Ticket ID",
      "Name",
      "Email",
      "Amount",
      "Payment ID",
      "Status",
      "Booked At",
    ];
    const csvData = payments.map((payment) => [
      payment.ticketId,
      payment.name,
      payment.email,
      payment.totalAmount,
      payment.paymentId,
      payment.status,
      new Date(payment.createdAt).toLocaleString(),
    ]);

    const csvContent = [heade, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payments-export-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="loading">Loading payments...</div>;
  }

  return (
    <div className="payments">
      <div className="payments-header">
        <h2>Payment Management</h2>
        <div className="header-actions">
          <button className="export-btn" onClick={exportPaymentsToCSV}>
            📊 Export Payments CSV
          </button>
        </div>
      </div>

      {/* Payment Summary */}
      {summary && (
        <div className="payment-summary-cards">
          <div className="summary-card total-revenue">
            <div className="summary-icon">💰</div>
            <div className="summary-info">
              <h3>₹{summary.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>

          <div className="summary-card successful-payments">
            <div className="summary-icon">✅</div>
            <div className="summary-info">
              <h3>{summary.successfulPayments}</h3>
              <p>Successful Payments</p>
            </div>
          </div>

          <div className="summary-card total-bookings">
            <div className="summary-icon">🎫</div>
            <div className="summary-info">
              <h3>{summary.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>

          <div className="summary-card refunded">
            <div className="summary-icon">🔄</div>
            <div className="summary-info">
              <h3>{summary.cancelledPayments}</h3>
              <p>Refunded Payments</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="status-filters">
          <button
            className={`filter-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All Payments
          </button>
          <button
            className={`filter-btn ${
              statusFilter === "booked" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("booked")}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${
              statusFilter === "cancelled" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("cancelled")}
          >
            Refunded
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Payment ID</th>
              <th>Status</th>
              <th>Booked At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="ticket-id">{payment.ticketId}</td>
                <td>
                  <div className="customer-info">
                    <strong>{payment.name}</strong>
                    <span className="phone">{payment.phone}</span>
                  </div>
                </td>
                <td>{payment.email}</td>
                <td className="amount">₹{payment.totalAmount}</td>
                <td className="payment-id">{payment.paymentId}</td>
                <td>{getStatusBadge(payment.status)}</td>
                <td>{new Date(payment.createdAt).toLocaleString()}</td>
                <td className="actions">
                  {payment.status !== "cancelled" && (
                    <button
                      className="btn-refund"
                      onClick={() => handleRefund(payment.ticketId)}
                      title="Refund Payment"
                    >
                      🔄 Refund
                    </button>
                  )}
                  {payment.status === "cancelled" && (
                    <span className="refunded-badge">Refunded</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <div className="no-data">No payments found</div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="modal-overlay">
          <div className="payment-details-modal">
            <div className="modal-header">
              <h3>Payment Details</h3>
              <button onClick={() => setSelectedPayment(null)}>✕</button>
            </div>
            <div className="modal-content">
              <div className="detail-row">
                <strong>Ticket ID:</strong> {selectedPayment.ticketId}
              </div>
              <div className="detail-row">
                <strong>Customer:</strong> {selectedPayment.name}
              </div>
              <div className="detail-row">
                <strong>Email:</strong> {selectedPayment.email}
              </div>
              <div className="detail-row">
                <strong>Phone:</strong> {selectedPayment.phone}
              </div>
              <div className="detail-row">
                <strong>Amount:</strong> ₹{selectedPayment.totalAmount}
              </div>
              <div className="detail-row">
                <strong>Payment ID:</strong> {selectedPayment.paymentId}
              </div>
              <div className="detail-row">
                <strong>Status:</strong>{" "}
                {getStatusBadge(selectedPayment.status)}
              </div>
              <div className="detail-row">
                <strong>Booked At:</strong>{" "}
                {new Date(selectedPayment.createdAt).toLocaleString()}
              </div>
              {selectedPayment.verifiedAt && (
                <div className="detail-row">
                  <strong>Verified At:</strong>{" "}
                  {new Date(selectedPayment.verifiedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
