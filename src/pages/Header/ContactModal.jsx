import React, { useState } from "react";
import { IoClose, IoLocation, IoMail, IoCall, IoTime } from "react-icons/io5";
import "./InfoModals.css";
import logo from "../../assets/logo_header.png";
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
      details: ["123 Temple Street Madurai - 625001", "Tamil Nadu"],
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
            <div className="sidebar-header m-0">
                  <img
                    src={logo}
                    alt="Logo"
                    width="250px"
                    className="d-block mx-auto"
                  />
                </div>
            </div>
            <button className="close-btn" onClick={onClose}>
              <IoClose size={24} />
            </button>
          </div>

          <div className="modal-body contact-body">
            <div className="contact">
              {/* Contact Info Sidebar */}
              <div className="contact-sidebar">
               

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactModal;
