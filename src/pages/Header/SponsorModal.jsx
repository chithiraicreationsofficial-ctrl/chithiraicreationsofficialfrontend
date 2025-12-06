import React, { useState } from 'react';
import { IoClose, IoCheckmark, IoBusiness, IoPeople, IoMegaphone, IoGift, IoStar } from 'react-icons/io5';
import './SponsorModal.css';
import { toast } from "react-toastify";

const SponsorModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    interest: '',
    partnershipType: '',
    budgetRange: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');

  if (!isOpen) return null;

  const partnershipTypes = [
    { id: 'hospitality', label: 'Hospitality Partner', icon: '🏨' },
    { id: 'medical', label: 'Medical Partner', icon: '🏥' },
    { id: 'fitness', label: 'Fitness Partner', icon: '💪' },
    { id: 'food', label: 'Food Partner', icon: '🍽️' },
    { id: 'tv', label: 'TV Partner', icon: '📺' },
    { id: 'event', label: 'Event Partner', icon: '🎉' },
    { id: 'radio', label: 'Radio Partner', icon: '📻' },
    { id: 'venue', label: 'Venue Partner', icon: '📍' },
    { id: 'branding', label: 'Branding Partner', icon: '🎨' },
    { id: 'merchandise', label: 'Merchandise Partner', icon: '👕' },
    { id: 'beverage', label: 'Beverage Partner', icon: '🥤' },
    { id: 'technology', label: 'Technology Partner', icon: '💻' }
  ];

  const budgetRanges = [
    { label: '₹50,000 - ₹1,00,000', value: '50k-100k' },
    { label: '₹1,00,000 - ₹2,50,000', value: '100k-250k' },
    { label: '₹2,50,000 - ₹5,00,000', value: '250k-500k' },
    { label: '₹5,00,000 - ₹10,00,000', value: '500k-1M' },
    { label: '₹10,00,000+', value: '1M+' },
    { label: 'Custom Package', value: 'custom' }
  ];

  const sponsorshipBenefits = [
    { icon: '🎯', title: 'Logo Placement', description: 'Prominent logo display across all event materials' },
    { icon: '📢', title: 'Brand Visibility', description: 'Social media mentions and event announcements' },
    { icon: '👥', title: 'Networking', description: 'Access to exclusive networking opportunities' },
    { icon: '🎫', title: 'Complimentary Tickets', description: 'VIP passes for your team and clients' },
    { icon: '🎤', title: 'Stage Presence', description: 'Opportunity to address the audience' },
    { icon: '📸', title: 'Photo Opportunities', description: 'Brand visibility in event photography' },
    { icon: '🏆', title: 'Award Presentation', description: 'Present awards during ceremony' },
    { icon: '📱', title: 'Digital Promotion', description: 'Featured on event website and app' }
  ];

  const packageTiers = [
    {
      name: 'Title Sponsor',
      color: '#ff6b6b',
      amount: '₹10,00,000+',
      features: [
        'Exclusive naming rights',
        'Prime logo placement',
        'Keynote speaking slot',
        'Full-page ad in event brochure',
        '50 VIP passes',
        'Dedicated branding zone'
      ]
    },
    {
      name: 'Platinum Sponsor',
      color: '#667eea',
      amount: '₹5,00,000 - ₹10,00,000',
      features: [
        'Major logo placement',
        'Social media takeover',
        '20 VIP passes',
        'Product display area',
        'Branded merchandise inclusion'
      ]
    },
    {
      name: 'Gold Sponsor',
      color: '#ffc107',
      amount: '₹2,50,000 - ₹5,00,000',
      features: [
        'Prominent logo display',
        'Social media features',
        '10 VIP passes',
        'Exhibition booth',
        'Recognition in press releases'
      ]
    },
    {
      name: 'Silver Sponsor',
      color: '#6c757d',
      amount: '₹1,00,000 - ₹2,50,000',
      features: [
        'Logo on event materials',
        'Social media mentions',
        '5 VIP passes',
        'Brand recognition'
      ]
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Thank you for your interest! Our team will contact you within 24 hours.');
      onClose();
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay sponsor-overlay" onClick={onClose}>
      <div className="modal-container sponsor-modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-content sponsor-modal">
          {/* Header */}
          <div className="modal-header sponsor-header">
            <div className="header-content">
              <div className="header-icon">
                <IoBusiness size={28} />
              </div>
              <div>
                <h2>Become a Partner / Sponsor</h2>
                <p className="tagline">Join us in creating unforgettable experiences</p>
              </div>
            </div>
            <button className="close-btn" onClick={onClose}>
              <IoClose size={24} />
            </button>
          </div>

          <div className="modal-body sponsor-body">
            <div className="sponsor-container">
              {/* Left Side - Benefits & Info */}
              <div className="sponsor-info-sidebar">
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

                {/* Benefits Section */}
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

                {/* Logo Presence Section */}
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
              </div>

              {/* Right Side - Form & Packages */}
              <div className="sponsor-form-section">
                {/* Package Tiers */}
                <div className="packages-section">
                  <h3>Sponsorship Packages</h3>
                  <div className="packages-grid">
                    {packageTiers.map((pkg, index) => (
                      <div 
                        key={index} 
                        className={`package-card ${selectedPackage === pkg.name ? 'selected' : ''}`}
                        onClick={() => setSelectedPackage(pkg.name)}
                        style={{ borderColor: pkg.color }}
                      >
                        <div className="package-header" style={{ background: pkg.color }}>
                          <h4>{pkg.name}</h4>
                          <div className="package-amount">{pkg.amount}</div>
                        </div>
                        <div className="package-features">
                          {pkg.features.map((feature, i) => (
                            <div key={i} className="feature-item">
                              <IoCheckmark className="feature-icon" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                        <div className="package-selector">
                          <button 
                            className="select-btn"
                            style={{ background: pkg.color }}
                          >
                            Select Package
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Partnership Types */}
                <div className="partnership-types">
                  <h4>Partnership Opportunities</h4>
                  <div className="types-grid">
                    {partnershipTypes.map(type => (
                      <label key={type.id} className="type-option">
                        <input
                          type="radio"
                          name="partnershipType"
                          value={type.id}
                          checked={formData.partnershipType === type.id}
                          onChange={handleInputChange}
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
                  <p className="form-subtitle">Our team will contact you with customized proposals</p>
                  
                  <form onSubmit={handleSubmit} className="sponsor-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Contact Person *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Full name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="company">Company / Organization *</label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Company name"
                          required
                        />
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
                          required
                        />
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
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="interest">Area of Interest *</label>
                      <select
                        id="interest"
                        name="interest"
                        value={formData.interest}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select interest area</option>
                        <option value="branding">Brand Visibility</option>
                        <option value="networking">Networking Opportunities</option>
                        <option value="csr">CSR Initiative</option>
                        <option value="sales">Product Promotion</option>
                        <option value="recruitment">Talent Recruitment</option>
                        <option value="all">Multiple Benefits</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Estimated Budget Range *</label>
                      <div className="budget-options">
                        {budgetRanges.map(range => (
                          <label key={range.value} className="budget-option">
                            <input
                              type="radio"
                              name="budgetRange"
                              value={range.value}
                              checked={formData.budgetRange === range.value}
                              onChange={handleInputChange}
                              required
                            />
                            <span className="budget-label">{range.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Additional Requirements</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your specific requirements, target audience, or any special requests..."
                        rows="4"
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
                            Processing...
                          </>
                        ) : 'Submit Interest Form'}
                      </button>
                      <button 
                        type="button" 
                        className="download-btn"
                        onClick={() => window.open('/sponsorship-proposal.pdf', '_blank')}
                      >
                        📥 Download Full Proposal
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer sponsor-footer">
            <div className="footer-content">
              <div className="footer-info">
                <IoPeople className="footer-icon" />
                <div>
                  <h5>Partnership Team</h5>
                  <p>Contact: +91 98765 43210 • Email: partnerships@chithiraicreations.com</p>
                </div>
              </div>
              <div className="footer-cta">
                <button className="schedule-btn">
                  📅 Schedule a Meeting
                </button>
                <button className="brochure-btn">
                  📋 Request Custom Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorModal;