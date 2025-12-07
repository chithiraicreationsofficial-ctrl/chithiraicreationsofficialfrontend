import React from "react";
import {
  IoClose,
  IoCalendar,
  IoTime,
  IoLocation,
  IoPerson,
  IoStar,
} from "react-icons/io5";
import "./InfoModals.css";
import img101 from "../../assets/101.JPG";
import img102 from "../../assets/102.JPG";
import img103 from "../../assets/103.JPG";
import img104 from "../../assets/104.JPG";

const images = [img101, img102, img103, img104];

const EventModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const eventHighlights = [
    {
      id: 1,
      title: "Expert Judges",
      description: "Renowned chefs and food critics from across Tamil Nadu",
      icon: "👨‍🍳",
    },
    {
      id: 2,
      title: "Cash Prizes",
      description: "Winning amounts up to ₹50,000 for top contestants",
      icon: "💰",
    },
    {
      id: 3,
      title: "Media Coverage",
      description: "Featured in leading newspapers and food channels",
      icon: "📰",
    },
    {
      id: 4,
      title: "Recipe Book",
      description: "Selected recipes published in exclusive cookbook",
      icon: "📖",
    },
    {
      id: 5,
      title: "Kitchen Equipment",
      description: "Modern kitchen appliances for winners",
      icon: "🍳",
    },
    {
      id: 6,
      title: "Brand Sponsorships",
      description: "Opportunity to become brand ambassadors",
      icon: "🏆",
    },
  ];

  const eventDetails = [
    {
      icon: <IoCalendar />,
      title: "Date",
      details: ["24th May 2025"],
    },
    {
      icon: <IoTime />,
      title: "Time",
      details: [" 9:00 AM - 4:00 PM"],
    },
    {
      icon: <IoLocation />,
      title: "Venue",
      details: ["V.S Chellam Century Hall", "Kamarajar Salai, Madurai"],
    },
    {
      icon: <IoPerson />,
      title: "Participants",
      details: ["Women chefs of all ages", "Individual & team entriess"],
    },
  ];

  const categories = [
    "Traditional Dishes",
    "Innovative Fusion",
    "Vegetarian Special",
    "Non-Vegetarian Delight",
    "Desserts & Sweets",
    "Street Food",
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container event-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content event-modal">
          {/* Hero Section */}
          <div className="event-hero">
            <div className="hero-content">
              <div className="hero-badge">🎉 Exclusive Event</div>
              <h1>Maduraiyin Samayal Rani</h1>
              <p className="hero-subtitle">
                Celebrate the spirit of every cooking queen in Madurai
              </p>
              {/* <div className="hero-cta">
                <button className="cta-primary">Register Now</button>
                <button className="cta-secondary" onClick={onClose}>
                  Learn More
                </button>
              </div> */}
            </div>
            <div className="hero-overlay"></div>
          </div>

          <div className="modal-body event-body">
            {/* Event Description */}
            <div className="event-description">
              <div className="description-content mt-3">
                <h2>
                 
                  <span className="highlight">Madurai Samayal Rani</span>
                </h2>
                <p>
                Celebrate the spirit of every cooking queen with the Madurai Samayal Rani Competition! A stage to cheer up women whose culinary talents often go unseen. Showcase your special dishes and let your hidden efforts shine bright. Win exciting gifts, cash prizes, and the recognition you truly deserve. From spicy biryanis to sweet delights — every recipe tells your story. Join us and turn your passion into pride and applause!
                </p>
                <p className="quote">
                  "From spicy biryanis to sweet delights — every recipe tells
                  your story. Join us and turn your passion into pride and
                  applause!"
                </p>
              </div>
            </div>

            {/* Event Details Grid */}
            <div className="event-details-grid mb-5">
              {eventDetails.map((detail, index) => (
                <div key={index} className="detail-card">
                  <div className="detail-icon">{detail.icon}</div>
                  <h4>{detail.title}</h4>
                  {detail.details.map((item, i) => (
                    <p key={i} className="detail-item">
                      {item}
                    </p>
                  ))}
                </div>
              ))}
            </div>

          

          

            {/* Image Gallery */}
            <div className="gallery-section">
              <div className="section-header">
                <h3>Glimpses from Previous Events</h3>
              </div>
              {/* <div className="gallery-grid">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="gallery-item">
                    <div className="image-placeholder">
                      <span>📸</span>
                      <p>Event Image {item}</p>
                    </div>
                  </div>
                ))}
              </div> */}


<div className="gallery-grid">
  {images.map((src, index) => (
    <div key={index} className="gallery-item">
      <img src={src} alt={`Event ${index + 1}`} className="image-placeholder"  width="100%" />
    </div>
  ))}
</div>

            </div>

         

            {/* Organized By */}
            <div className="organizer-section">
              <div className="organizer-card">
                
                <div>
                  <h4>Organized by Chithirai Creations</h4>
                  <p>In association with Madurai Culinary Association</p>
                </div>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </div>
  );
};
export default EventModal; // Add this line
