import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/apiService";
import "./TicketVerification.css";

const TicketVerification = () => {
  const [ticketData, setTicketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes countdown
  const [isAdmin, setIsAdmin] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [newYearCountdown, setNewYearCountdown] = useState("");

  // Get ticket ID from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketIdFromUrl = urlParams.get("ticketId");
    setTicketId(ticketIdFromUrl);

    // Check if user is admin (in real app, this would be from auth context)
    const checkAdminStatus = () => {
      // Simulate admin check - replace with actual auth logic
      const userRole = localStorage.getItem("adminToken");

      console.log("userRole", userRole);
      if (userRole == null) {
        console.log("userRole", userRole);
        setIsAdmin(false);
      } else {
        console.log("userRole2", userRole);
        setIsAdmin(true);
      }
    };

    checkAdminStatus();
  }, []);

  // Fetch ticket data when ticketId is available
  useEffect(() => {
    if (ticketId) {
      fetchTicketData(ticketId);
    }
  }, [ticketId]);

  // Countdown timer effect for ticket validity
  useEffect(() => {
    if (timeLeft > 0 && ticketData?.status === "booked" && !isAdmin) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, ticketData, isAdmin]);

  useEffect(() => {
    const calculateNewYearCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const nextYear = currentYear + 1;
      const newYear = new Date(`January 1, ${nextYear} 00:00:00`);

      const difference = newYear - now;

      if (difference <= 0) {
        return {
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          display: "00:00:00:00",
        };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
        display: `${days.toString().padStart(2, "0")}:${hours
          .toString()
          .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`,
      };
    };

    // Update immediately
    setNewYearCountdown(calculateNewYearCountdown());

    // Update every second
    const interval = setInterval(() => {
      setNewYearCountdown(calculateNewYearCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchTicketData = async (ticketId) => {
    setIsLoading(true);
    try {
      const response = await adminAPI.getTicketDetails(ticketId);
      if (response.data.success) {
        setTicketData(response.data.data.ticket);
        setVerificationStatus(response.data.data.ticket.status);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to fetch ticket details"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTicket = async (status) => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await adminAPI.verifyTicket(ticketId, status, "qr_scan");

      if (response.data.success) {
        setMessage(`Ticket marked as ${status}`);
        setTicketData(response.data.data.ticket);
        setVerificationStatus(status);

        // Show success confetti
        createConfetti();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const createConfetti = () => {
    const colors = [
      "#ff6b6b",
      "#ee5a24",
      "#667eea",
      "#764ba2",
      "#f093fb",
      "#f5576c",
    ];
    const container = document.body;

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(confetti);

      const animation = confetti.animate(
        [
          { transform: "translateY(0) rotate(0deg)", opacity: 1 },
          {
            transform: `translateY(${window.innerHeight}px) rotate(${
              Math.random() * 360
            }deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 1000 + Math.random() * 2000,
          easing: "cubic-bezier(0.1, 0.8, 0.3, 1)",
        }
      );

      animation.onfinish = () => confetti.remove();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="ticket-verification loading">
        <div className="loading-spinner"></div>
        <p>Loading ticket information...</p>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="ticket-verification error">
        <div className="error-icon">❌</div>
        <h3>Ticket Not Found</h3>
        <p>{message || "The ticket ID could not be found in our system."}</p>
        <button
          onClick={() => (window.location.href = "/")}
          className="btn-primary"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="ticket-verification">
      {/* Header Section */}
      <div className="verification-header">
        <img
          src="https://res.cloudinary.com/dlcgqwmin/image/upload/v1763730196/logo_header_yaeedm.png"
          alt="Chithirai Creations Logo"
          className="logo"
        />
        <h1>Readya Mamey</h1>
        <p>Madurai New Year Celebration 2025</p>

    
      </div>

      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-icon">🎉</div>
        <div className="welcome-text">Welcome to the Celebration!</div>
        <div className="user-name">{ticketData.name}</div>
      </div>

      {/* Ticket Card */}
      <div className="ticket-card">
        <div className={`status-badge status-${verificationStatus}`}>
          {verificationStatus === "attended"
            ? "Verified ✅"
            : verificationStatus === "not_attended"
            ? "Not Attended ❌"
            : "Booked 📋"}
        </div>

        <div className="ticket-id">{ticketData.ticketId}</div>

        <div className="ticket-details-grid">
          <div className="detail-item">
            <div className="detail-label">Email</div>
            <div className="detail-value">{ticketData.email}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Phone</div>
            <div className="detail-value">{ticketData.phone}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Tickets</div>
            <div className="detail-value">{ticketData.adultTicketCount + ticketData.childrenTicketCount}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Adult Tickets</div>
            <div className="detail-value">{ticketData.adultTicketCount }</div>
          </div>  <div className="detail-item">
            <div className="detail-label">Childrens Tickets</div>
            <div className="detail-value">{ticketData.childrenTicketCount}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Booked On</div>
            <div className="detail-value">
              {new Date(ticketData.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Event Time Information */}
        <div className="event-time-info">
          <div className="event-date">📅 December 31, 2024</div>
          <div className="event-time">⏰ 8:00 PM Onwards</div>
          <div className="event-venue">📍 Madurai, Tamil Nadu</div>
        </div>

        {/* Verification Time for attended tickets */}
        {ticketData.verifiedAt && (
          <div className="verification-time">
            <strong>Verified at:</strong>{" "}
            {new Date(ticketData.verifiedAt).toLocaleString()}
          </div>
        )}
      </div>

      {/* Countdown Timer for non-admin users with booked tickets */}
      {!isAdmin && verificationStatus === "booked" && (
        <div className="countdown-section">
          <div className="countdown-title">
            🎉 Countdown to New Year 2025 🎉
          </div>
          <div className="countdown-timer">
            <div className="countdown-display">{newYearCountdown.display}</div>
            <div className="countdown-label">
              Days : Hours : Minutes : Seconds
            </div>
          </div>
          {/* <p className="countdown-note">
                        Please show this screen to event staff for entry
                    </p> */}
        </div>
      )}

      {/* Admin Actions */}
      {isAdmin && verificationStatus === "booked" && (
        <div className="admin-actions">
          <h3>Admin Verification</h3>
          <div className="action-buttons">
            <button
              className="btn-success"
              onClick={() => handleVerifyTicket("attended")}
              disabled={isLoading}
            >
              ✅ Confirm Entry
            </button>
            <button
              className="btn-warning"
              onClick={() => handleVerifyTicket("not_attended")}
              disabled={isLoading}
            >
              ❌ Mark as No Show
            </button>
          </div>
        </div>
      )}

      {/* Already Verified Message */}
      {(verificationStatus === "attended" ||
        verificationStatus === "not_attended") && (
        <div className={`verified-message status-${verificationStatus}`}>
          <div className="message-icon">
            {verificationStatus === "attended" ? "🎉" : "⚠️"}
          </div>
          <h3>
            {verificationStatus === "attended"
              ? "Entry Already Confirmed"
              : "Marked as Not Attended"}
          </h3>
          <p>
            {verificationStatus === "attended"
              ? "This ticket has already been used for entry."
              : "This ticket has been marked as not attended."}
          </p>
          {ticketData.verifiedAt && (
            <p className="verification-time">
              Verified on: {new Date(ticketData.verifiedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Status Message */}
      {message && (
        <div
          className={`message ${
            message.includes("failed") ? "error" : "success"
          }`}
        >
          {message}
        </div>
      )}

      {/* Footer */}
      <div className="verification-footer">
        <p>© 2025 Chithirai Creations. All rights reserved.</p>
        <p>Have a wonderful celebration! 🎆</p>
      </div>
    </div>
  );
};

export default TicketVerification;
