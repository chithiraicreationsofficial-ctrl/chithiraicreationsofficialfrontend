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
            
              <div className="section-content">
                <p>
                A group of dynamic influencers came together to create Chithirai Creations, a registered events company. Their dream was to do more than just organize events; they aimed to bring joy to people's lives while raising awareness about important issues. Through spirited sports competitions and engaging activities, they created a unique atmosphere that tied participants back to the roots of Madurai's culture and heritage. Moreover, Chithirai Creations provided an exceptional platform for emerging brands in Madurai, offering them high visibility and a chance to connect with the local community. Their vision continues to inspire, fostering a positive environment where people can celebrate and grow together, all while promoting a healthier society.
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
              <div className="section-header d-flex justify-content-center">
               
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
