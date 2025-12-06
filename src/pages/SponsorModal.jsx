import React, { useState } from "react";
import {
  IoClose,
  IoCheckmark,
  IoBusiness,
  IoPeople,
  IoMegaphone,
  IoGift,
  IoStar,
} from "react-icons/io5";
import { submitSponsorship } from "../services/apiService"; // Import the API function
import "./SponsorModal.css";

const SponsorModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    contactPerson: "", // Changed from 'name' to 'contactPerson'
    companyName: "", // Changed from 'company' to 'companyName'
    email: "",
    phone: "",
    website: "",
    interestArea: "",
    partnershipType: [],
    budgetRange: "",
    customBudget: "",
    packageInterest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const partnershipTypes = [
    { id: "hospitality", label: "Hospitality Partner", icon: "🏨" },
    { id: "medical", label: "Medical Partner", icon: "🏥" },
    { id: "fitness", label: "Fitness Partner", icon: "💪" },
    { id: "food", label: "Food Partner", icon: "🍽️" },
    { id: "tv", label: "TV Partner", icon: "📺" },
    { id: "event", label: "Event Partner", icon: "🎉" },
    { id: "radio", label: "Radio Partner", icon: "📻" },
    { id: "venue", label: "Venue Partner", icon: "📍" },
    { id: "branding", label: "Branding Partner", icon: "🎨" },
    { id: "merchandise", label: "Merchandise Partner", icon: "👕" },
    { id: "beverage", label: "Beverage Partner", icon: "🥤" },
    { id: "technology", label: "Technology Partner", icon: "💻" },
  ];

  const budgetRanges = [
    { label: "₹50,000 - ₹1,00,000", value: "50k-100k" },
    { label: "₹1,00,000 - ₹2,50,000", value: "100k-250k" },
    { label: "₹2,50,000 - ₹5,00,000", value: "250k-500k" },
    { label: "₹5,00,000 - ₹10,00,000", value: "500k-1M" },
    { label: "₹10,00,000+", value: "1M+" },
    { label: "Custom Package", value: "custom" },
  ];

  const interestAreas = [
    { value: "brand_visibility", label: "Brand Visibility" },
    { value: "networking", label: "Networking Opportunities" },
    { value: "csr", label: "CSR Initiative" },
    { value: "product_promotion", label: "Product Promotion" },
    { value: "talent_recruitment", label: "Talent Recruitment" },
    { value: "multiple", label: "Multiple Benefits" },
  ];

  const packageInterests = [
    { value: "title", label: "Title Sponsor" },
    { value: "platinum", label: "Platinum Sponsor" },
    { value: "gold", label: "Gold Sponsor" },
    { value: "silver", label: "Silver Sponsor" },
    { value: "custom", label: "Custom Package" },
  ];

  const sponsorshipBenefits = [
    {
      icon: "🎯",
      title: "Logo Placement",
      description: "Prominent logo display across all event materials",
    },
    {
      icon: "📢",
      title: "Brand Visibility",
      description: "Social media mentions and event announcements",
    },
    {
      icon: "👥",
      title: "Networking",
      description: "Access to exclusive networking opportunities",
    },
    {
      icon: "🎫",
      title: "Complimentary Tickets",
      description: "VIP passes for your team and clients",
    },
    {
      icon: "🎤",
      title: "Stage Presence",
      description: "Opportunity to address the audience",
    },
    {
      icon: "📸",
      title: "Photo Opportunities",
      description: "Brand visibility in event photography",
    },
    {
      icon: "🏆",
      title: "Award Presentation",
      description: "Present awards during ceremony",
    },
    {
      icon: "📱",
      title: "Digital Promotion",
      description: "Featured on event website and app",
    },
  ];



  const validateForm = () => {
    const newErrors = {};

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person is required";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid Indian phone number";
    }

    if (!formData.interestArea) {
      newErrors.interestArea = "Please select an interest area";
    }

    if (formData.partnershipType.length === 0) {
      newErrors.partnershipType = "Please select at least one partnership type";
    }

    if (!formData.budgetRange) {
      newErrors.budgetRange = "Please select a budget range";
    } else if (formData.budgetRange === "custom" && !formData.customBudget) {
      newErrors.customBudget = "Please specify custom budget amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");

    try {
      // Prepare submission data
      const submissionData = {
        contactPerson: formData.contactPerson,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || undefined,
        interestArea: formData.interestArea,
        partnershipType: formData.partnershipType,
        budgetRange: formData.budgetRange,
        customBudget: formData.customBudget
          ? parseFloat(formData.customBudget)
          : undefined,
        packageInterest: selectedPackage || "custom",
        message: formData.message || "",
      };

      // Submit to backend
      const response = await submitSponsorship(submissionData);

      if (response.data.success) {
        setSuccessMessage(
          "Thank you for your interest! Our partnership team will contact you within 24 hours."
        );

        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            contactPerson: "",
            companyName: "",
            email: "",
            phone: "",
            website: "",
            interestArea: "",
            partnershipType: [],
            budgetRange: "",
            customBudget: "",
            packageInterest: "",
            message: "",
          });
          setSelectedPackage("");
          setIsSubmitting(false);

          // Close modal after 3 seconds
          setTimeout(() => {
            onClose();
          }, 3000);
        }, 2000);
      } else {
        setErrors({
          submit:
            response.data.message || "Submission failed. Please try again.",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Sponsorship submission error:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to submit sponsorship inquiry. Please try again later.",
      });
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePartnershipTypeChange = (typeId) => {
    setErrors((prev) => ({ ...prev, partnershipType: "" }));

    setFormData((prev) => {
      const isSelected = prev.partnershipType.includes(typeId);
      if (isSelected) {
        // Remove if already selected
        return {
          ...prev,
          partnershipType: prev.partnershipType.filter((id) => id !== typeId),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          partnershipType: [...prev.partnershipType, typeId],
        };
      }
    });
  };

  const handlePackageSelect = (pkgValue) => {
    setSelectedPackage(pkgValue);
    setFormData((prev) => ({
      ...prev,
      packageInterest: pkgValue,
    }));
  };

  const handleBudgetRangeChange = (value) => {
    setErrors((prev) => ({
      ...prev,
      budgetRange: "",
      customBudget: value !== "custom" ? "" : prev.customBudget,
    }));

    setFormData((prev) => ({
      ...prev,
      budgetRange: value,
      customBudget: value !== "custom" ? "" : prev.customBudget,
    }));
  };

  return (
    <div className="modal-overlay sponsor-overlay" onClick={onClose}>
      <div
        className="modal-container sponsor-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content sponsor-modal">
          {/* Header */}
          <div className="modal-header sponsor-header">
            <div className="header-content">
              <div className="header-icon">
                <IoBusiness size={28} />
              </div>
              <div>
                <h2>Become a Partner / Sponsor</h2>
                <p className="tagline">
                  Join us in creating unforgettable experiences
                </p>
              </div>
            </div>
            <button
              className="close-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="modal-body sponsor-body">
            {successMessage ? (
              <div className="success-message">
                <div className="success-icon">✅</div>
                <h3>Submission Successful!</h3>
                <p>{successMessage}</p>
                <p className="success-note">
                  Reference ID: SPON-{Date.now().toString().slice(-6)}
                </p>
                <button className="continue-btn" onClick={onClose}>
                  Continue Browsing
                </button>
              </div>
            ) : (
              <div className="sponsor-container">
                {/* Left Side - Benefits & Info */}
                {/* <div className="sponsor-info-sidebar">
                  <div className="sidebar-header">
                    <img
                      src="https://res.cloudinary.com/dlcgqwmin/image/upload/v1763730196/logo_header_yaeedm.png"
                      alt="Logo"
                      className="sidebar-logo"
                    />
                    <h3>Why Partner With Us?</h3>
                    <p className="stats-text">
                      <span className="stat">10,000+</span> Event Attendees •
                      <span className="stat"> 50+</span> Events •
                      <span className="stat"> 100%</span> Success Rate
                    </p>
                  </div>

                  <div className="benefits-section">
                    <h4>
                      <IoCheckmark className="benefit-icon" />
                      Sponsorship Benefits
                    </h4>
                    <div className="benefits-grid">
                      {sponsorshipBenefits.map((benefit, index) => (
                        <div key={index} className="benefit-card">
                          <div className="benefit-icon-wrapper">
                            <span>{benefit.icon}</span>
                          </div>
                          <div>
                            <h5>{benefit.title}</h5>
                            <p>{benefit.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="logo-section">
                    <h4>
                      <IoStar className="logo-icon" />
                      Logo Presence & Recognition
                    </h4>
                    <div className="logo-presence">
                      <div className="presence-item">
                        <span className="presence-icon">🎫</span>
                        <span>All Event Tickets</span>
                      </div>
                      <div className="presence-item">
                        <span className="presence-icon">📱</span>
                        <span>Event Website & App</span>
                      </div>
                      <div className="presence-item">
                        <span className="presence-icon">📺</span>
                        <span>Promotional Videos</span>
                      </div>
                      <div className="presence-item">
                        <span className="presence-icon">📰</span>
                        <span>Press Releases</span>
                      </div>
                      <div className="presence-item">
                        <span className="presence-icon">🏟️</span>
                        <span>Venue Branding</span>
                      </div>
                      <div className="presence-item">
                        <span className="presence-icon">👕</span>
                        <span>Merchandise</span>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="sponsor-form-section">
                  {errors.submit && (
                    <div className="form-error-message">⚠️ {errors.submit}</div>
                  )}


                  {/* Partnership Types */}
                  <div className="partnership-types">
                    <h4>Partnership Opportunities *</h4>
                    {errors.partnershipType && (
                      <div className="field-error">
                        {errors.partnershipType}
                      </div>
                    )}
                    <div className="types-grid">
                      {partnershipTypes.map((type) => (
                        <label key={type.id} className="type-option">
                          <input
                            type="checkbox"
                            name="partnershipType"
                            value={type.id}
                            checked={formData.partnershipType.includes(type.id)}
                            onChange={() =>
                              handlePartnershipTypeChange(type.id)
                            }
                          />
                          <div className="type-content">
                            <span className="type-icon">{type.icon}</span>
                            <span className="type-label">{type.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="contact-form-section">
                    <h3>Express Your Interest</h3>
                    <p className="form-subtitle">
                      Our team will contact you with customized proposals
                    </p>

                    <form onSubmit={handleSubmit} className="sponsor-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="contactPerson">
                            Contact Person *
                          </label>
                          <input
                            type="text"
                            id="contactPerson"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            placeholder="Full name"
                            disabled={isSubmitting}
                            className={errors.contactPerson ? "error" : ""}
                          />
                          {errors.contactPerson && (
                            <div className="field-error">
                              {errors.contactPerson}
                            </div>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="companyName">
                            Company / Organization *
                          </label>
                          <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Company name"
                            disabled={isSubmitting}
                            className={errors.companyName ? "error" : ""}
                          />
                          {errors.companyName && (
                            <div className="field-error">
                              {errors.companyName}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="email">Email Address *</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="contact@company.com"
                            disabled={isSubmitting}
                            className={errors.email ? "error" : ""}
                          />
                          {errors.email && (
                            <div className="field-error">{errors.email}</div>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">Phone Number *</label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 98765 43210"
                            disabled={isSubmitting}
                            className={errors.phone ? "error" : ""}
                          />
                          {errors.phone && (
                            <div className="field-error">{errors.phone}</div>
                          )}
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="website">Website (Optional)</label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://yourcompany.com"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="interestArea">
                            Area of Interest *
                          </label>
                          <select
                            id="interestArea"
                            name="interestArea"
                            value={formData.interestArea}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={errors.interestArea ? "error" : ""}
                          >
                            <option value="">Select interest area</option>
                            {interestAreas.map((area) => (
                              <option key={area.value} value={area.value}>
                                {area.label}
                              </option>
                            ))}
                          </select>
                          {errors.interestArea && (
                            <div className="field-error">
                              {errors.interestArea}
                            </div>
                          )}
                        </div>

                        <div className="form-group">
                          <label>Package Interest</label>
                          <select
                            name="packageInterest"
                            value={formData.packageInterest}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                          >
                            {packageInterests.map((pkg) => (
                              <option key={pkg.value} value={pkg.value}>
                                {pkg.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Estimated Budget Range *</label>
                        {errors.budgetRange && (
                          <div className="field-error">
                            {errors.budgetRange}
                          </div>
                        )}
                        <div className="budget-options">
                          {budgetRanges.map((range) => (
                            <label key={range.value} className="budget-option">
                              <input
                                type="radio"
                                name="budgetRange"
                                value={range.value}
                                checked={formData.budgetRange === range.value}
                                onChange={() =>
                                  handleBudgetRangeChange(range.value)
                                }
                                disabled={isSubmitting}
                              />
                              <span className="budget-label">
                                {range.label}
                              </span>
                            </label>
                          ))}
                        </div>

                        {formData.budgetRange === "custom" && (
                          <div className="custom-budget-input">
                            <input
                              type="number"
                              name="customBudget"
                              value={formData.customBudget}
                              onChange={handleInputChange}
                              placeholder="Enter custom budget amount (₹)"
                              disabled={isSubmitting}
                              className={errors.customBudget ? "error" : ""}
                            />
                            {errors.customBudget && (
                              <div className="field-error">
                                {errors.customBudget}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="message">
                          Additional Requirements (Optional)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your specific requirements, target audience, or any special requests..."
                          rows="4"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="form-actions">
                        <button
                          type="submit"
                          className="submit-btn"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="spinner"></span>
                              Submitting...
                            </>
                          ) : (
                            "Submit Interest Form"
                          )}
                        </button>
                        <button
                          type="button"
                          className="download-btn"
                          onClick={() =>
                            window.open("/sponsorship-proposal.pdf", "_blank")
                          }
                          disabled={isSubmitting}
                        >
                          📥 Download Full Proposal
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}

          <div className="modal-footer">
           
           <p className="copyright">
             © 2025 Chithirai Creations. All rights reserved.
           </p>
         </div>
          {/* <div className="modal-footer sponsor-footer text-black">
            <div className="footer-content">
              <div className="footer-info">
                <div>
                  <h5>Partnership Team</h5>
                  <p className="text-black">
                    Contact: +91 98765 43210 • Email:
                    partnerships@chithiraicreations.com
                  </p>
                </div>
              </div>
              <div className="footer-cta">
                <button
                  className="schedule-btn"
                  onClick={() =>
                    window.open(
                      "mailto:partnerships@chithiraicreations.com?subject=Schedule%20Meeting%20-%20Sponsorship"
                    )
                  }
                  disabled={isSubmitting}
                >
                  📅 Schedule a Meeting
                </button>
               
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SponsorModal;
