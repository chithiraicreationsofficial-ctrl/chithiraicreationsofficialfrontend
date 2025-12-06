import React from "react";
import { IoClose } from "react-icons/io5";
import "./InfoModals.css";
import logo from "../../assets/logo_header.png";

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content about-modal">
          {/* Header */}
          <div className="modal-header">
            <div className="header-content">
             

<img
                    src={logo}
                    alt="Logo"
                    width="250px"
                    className="d-block mx-auto"
                  />
              
            </div>
            <button className="close-btn" onClick={onClose}>
              <IoClose size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="modal-body">
            <div className="about-section">
              <div className="section-header">
                <div className="icon-wrapper">
                  <span>🎨</span>
                </div>
                <h3>Our Story</h3>
              </div>
              <div className="section-content">
                <p>
                  Founded in 2020, Chithirai Creations emerged from a passion
                  for celebrating Madurai's rich cultural heritage through
                  unforgettable events and experiences. Named after the famous
                  Chithirai Festival, we embody the spirit of celebration and
                  community that defines our city.
                </p>
              </div>
            </div>

            <div className="about-section">
              <div className="section-header">
                <div className="icon-wrapper">
                  <span>🎯</span>
                </div>
                <h3>Our Mission</h3>
              </div>
              <div className="section-content">
                <p>
                  To create immersive cultural experiences that connect people,
                  celebrate traditions, and create lasting memories. We believe
                  every event should be a masterpiece that reflects the vibrancy
                  of Madurai's culture.
                </p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Events Organized</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">10k+</div>
                <div className="stat-label">Happy Attendees</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">5</div>
                <div className="stat-label">Years of Excellence</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">100%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>

            <div className="about-section">
              <div className="section-header">
                <div className="icon-wrapper">
                  <span>✨</span>
                </div>
                <h3>What Makes Us Special</h3>
              </div>
              <div className="features-grid">
                <div className="feature-item">
                  <span className="feature-icon">🎭</span>
                  <h4>Cultural Authenticity</h4>
                  <p>Deep-rooted in Madurai's traditions and customs</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌟</span>
                  <h4>Creative Excellence</h4>
                  <p>Innovative event concepts with attention to detail</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🤝</span>
                  <h4>Community Focus</h4>
                  <p>Events that bring people together and create bonds</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💫</span>
                  <h4>Memorable Experiences</h4>
                  <p>Creating moments that attendees cherish forever</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
           
            <p className="copyright">
              © 2025 Chithirai Creations. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutModal; // Add this line
