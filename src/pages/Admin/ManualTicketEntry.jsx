import React, { useState } from "react";
import { adminAPI } from "../../services/apiService";
import "./ManualTicketEntry.css";


const ManualTicketEntry = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ticketCount: 1,
    totalAmount: "",
    paymentMethod: "cash",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [createdTicket, setCreatedTicket] = useState(null);

  const ticketPrice = 500; // Example price

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "ticketCount") {
      const count = parseInt(value) || 1;
      setFormData({
        ...formData,
        [name]: count,
        totalAmount: count * ticketPrice,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      setMessage("Please fill in all required fields");
      setMessageType("error");
      return;
    }

    if (!formData.email.includes("@")) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await adminAPI.createManualTicket(formData);

      if (response.data.success) {
        setMessage("Ticket created successfully!");
        setMessageType("success");
        setCreatedTicket(response.data.data.ticket);

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          ticketCount: 1,
          totalAmount: ticketPrice,
          paymentMethod: "cash",
          notes: "",
        });

        // Auto-clear success message
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create ticket");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="manual-ticket-entry">
      <div className="entry-header">
        <h2>Manual Ticket Entry</h2>
        <p>Create tickets for cash/UPI payments</p>
      </div>

      <div className="entry-container">
        {/* Form Section */}
        <div className="form-section">
          <form onSubmit={handleSubmit} className="ticket-form">
            {message && (
              <div className={`message ${messageType}`}>{message}</div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  Customer Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="customer@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ticketCount">Number of Tickets</label>
                <select
                  id="ticketCount"
                  name="ticketCount"
                  value={formData.ticketCount}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} ticket{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="totalAmount">Total Amount (₹)</label>
                <input
                  type="text"
                  id="totalAmount"
                  name="totalAmount"
                  value={`₹${formData.totalAmount}`}
                  readOnly
                  className="readonly"
                />
                <div className="amount-hint">
                  ₹{ticketPrice} per ticket × {formData.ticketCount} = ₹
                  {formData.totalAmount}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <div className="payment-methods">
                  {["cash", "upi"].map((method) => (
                    <label key={method} className="payment-method">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <span className="payment-label mx-2">
                        {method === "cash" ? "💵 Cash" : "📱 UPI"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes..."
                rows="3"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="create-ticket-btn"
              disabled={isLoading}
            >
              {isLoading ? "Creating Ticket..." : "Create Ticket"}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="preview-section">
          <div className="preview-card mt-5">
            <h3>Ticket Preview</h3>
            <div className="preview-content">
              <div className="preview-field">
                <span className="field-label">Name:</span>
                <span className="field-value">
                  {formData.name || "Not specified"}
                </span>
              </div>
              <div className="preview-field">
                <span className="field-label">Email:</span>
                <span className="field-value">
                  {formData.email || "Not specified"}
                </span>
              </div>
              <div className="preview-field">
                <span className="field-label">Phone:</span>
                <span className="field-value">
                  {formData.phone || "Not specified"}
                </span>
              </div>
              <div className="preview-field">
                <span className="field-label">Tickets:</span>
                <span className="field-value">{formData.ticketCount}</span>
              </div>
              <div className="preview-field">
                <span className="field-label">Amount:</span>
                <span className="field-value">₹{formData.totalAmount}</span>
              </div>
              <div className="preview-field">
                <span className="field-label">Payment:</span>
                <span
                  className={`field-value payment-${formData.paymentMethod}`}
                >
                  {formData.paymentMethod === "cash" ? "💵 Cash" : "📱 UPI"}
                </span>
              </div>
            </div>

            {createdTicket && (
              <div className="created-ticket">
                <h4>Last Created Ticket</h4>
                <div className="ticket-info">
                  <p>
                    <strong>Ticket ID:</strong> {createdTicket.ticketId}
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(createdTicket.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="quick-actions">
            <h4>Quick Actions</h4>
            <div className="action-buttons">
              <button
                className="action-btn print-btn"
                onClick={() => window.print()}
              >
                🖨️ Print Receipt
              </button>
              <button
                className="action-btn email-btn"
                onClick={() =>
                  (window.location.href = `mailto:${formData.email}`)
                }
                disabled={!formData.email}
              >
                📧 Send Email
              </button>
              <button
                className="action-btn clear-btn"
                onClick={() =>
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    ticketCount: 1,
                    totalAmount: ticketPrice,
                    paymentMethod: "cash",
                    notes: "",
                  })
                }
              >
                🗑️ Clear Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualTicketEntry;
