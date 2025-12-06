import React, { useState } from "react";
import { IoClose, IoLocation, IoMail, IoCall, IoTime } from "react-icons/io5";
import "./InfoModals.css";
import { toast } from "react-toastify";

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle form submission here
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you for your message! We'll get back to you soon.");
      onClose();
    }, 1500);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: <IoLocation />,
      title: "Visit Us",
      details: ["123 Temple Street", "Madurai - 625001", "Tamil Nadu"],
    },
    {
      icon: <IoCall />,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 87654 32109"],
      action: "tel:+919876543210",
    },
    {
      icon: <IoMail />,
      title: "Email Us",
      details: [
        "info@chithiraicreations.com",
        "support@chithiraicreations.com",
      ],
      action: "mailto:info@chithiraicreations.com",
    },
    {
      icon: <IoTime />,
      title: "Working Hours",
      details: ["Mon - Sat: 10:00 AM - 7:00 PM", "Sunday: 11:00 AM - 5:00 PM"],
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container contact-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content contact-modal">
          {/* Header */}
          <div className="modal-header contact-header">
            <div className="header-content">
              <h2>Get in Touch</h2>
              <p className="tagline">We'd love to hear from you</p>
            </div>
            <button className="close-btn" onClick={onClose}>
              <IoClose size={24} />
            </button>
          </div>

          <div className="modal-body contact-body">
            <div className="contact-container">
              {/* Contact Info Sidebar */}
              <div className="contact-sidebar">
                <div className="sidebar-header">
                  <img
                    src="https://res.cloudinary.com/dlcgqwmin/image/upload/v1763730196/logo_header_yaeedm.png"
                    alt="Logo"
                    className="sidebar-logo"
                  />
                  <h3>Chithirai Creations</h3>
                  <p className="sidebar-tagline">
                    Creating Unforgettable Experiences
                  </p>
                </div>

                <div className="contact-info-list">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="contact-info-item">
                      <div className="contact-icon">{item.icon}</div>
                      <div className="contact-details">
                        <h4>{item.title}</h4>
                        {item.details.map((detail, i) => (
                          <p key={i}>{detail}</p>
                        ))}
                      </div>
                      {item.action && (
                        <a href={item.action} className="contact-action">
                          Connect →
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                <div className="map-preview">
                  <div className="map-placeholder">
                    <span>📍</span>
                    <p>Madurai Location</p>
                    <a href="#" className="view-map">
                      View on Map →
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form-section">
                <div className="form-header">
                  <h3>Send us a Message</h3>
                  <p>
                    Fill out the form below and we'll get back to you within 24
                    hours
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject *</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="event">Event Inquiry</option>
                        <option value="ticket">Ticket Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us what you're looking for..."
                      rows="5"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>

                <div className="emergency-contact">
                  <div className="emergency-icon">🚨</div>
                  <div>
                    <h4>Event Day Emergency</h4>
                    <p>
                      For urgent assistance on event day, call:{" "}
                      <strong>+91 99999 88888</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactModal;
