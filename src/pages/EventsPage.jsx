import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import DiwaliThreeCanvas from "../components/DiwaliThreeCanvas";
import AOS from "aos";
import "aos/dist/aos.css";
import "./EventsPage.css";
import { Link } from "react-router-dom";
import {
  IoCalendar,
  IoTime,
  IoLocation,
  IoPerson,
  IoStar,
} from "react-icons/io5";
import { FaFire, FaUtensils, FaGift, FaCamera } from "react-icons/fa6";
import { IoSparkles } from "react-icons/io5";
import DiyaIcon from "../components/DiyaIcon";

import img101 from "../assets/101.JPG";
import img102 from "../assets/102.JPG";
import img103 from "../assets/103.JPG";
import img104 from "../assets/104.JPG";
import svsLogo from "../assets/diwali/svs_title_sponsor_cropped.png";

const galleryImages = [img101, img102, img103, img104];

export default function EventsPage() {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: false });
  }, []);

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
      icon: <IoCalendar className="detail-svg-icon" />,
      title: "Date",
      details: ["24th May 2025"],
    },
    {
      icon: <IoTime className="detail-svg-icon" />,
      title: "Time",
      details: ["9:00 AM - 4:00 PM"],
    },
    {
      icon: <IoLocation className="detail-svg-icon" />,
      title: "Venue",
      details: ["V.S Chellam Century Hall", "Kamarajar Salai, Madurai"],
    },
    {
      icon: <IoPerson className="detail-svg-icon" />,
      title: "Participants",
      details: ["Women chefs of all ages", "Individual & team entries"],
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
    <div className="events-page-wrapper">
      <Header />

      {/* 3D Festive Background */}
      <div className="events-canvas-bg">
        <DiwaliThreeCanvas />
      </div>

      <main className="events-main-container">
        {/* NEW EVENT BANNER: Digital Diwali Palagaram Villa */}
        <section className="live-event-banner-section">
          <div className="container">
            <div className="diwali-live-card" data-aos="zoom-in">
              <div className="live-badge-glow">
                <span className="live-dot"></span> LIVE FESTIVAL CONTEST • DIWALI 2026
              </div>

              <div className="diwali-live-grid">
                <div className="diwali-live-info">
                  <div className="presented-sub">
                    <span>Presented by Chithirai Creations</span>
                    <span className="dot-sep">•</span>
                    <span className="sponsor-tag">
                      Title Sponsor: <img src={svsLogo} alt="SVS" className="banner-svs-mini" />
                    </span>
                  </div>

                  <h2 className="diwali-live-title">
                    Digital Diwali <span className="gold-shimmer-text">Palagaram Villa</span>
                  </h2>

                  <p className="diwali-live-desc">
                    Showcase your Diwali sweets, celebrate rich culinary tradition &amp; win exciting prizes
                    worth <strong>₹1,00,000 (1 Lakh!)</strong> Upload your photo or reel and collab with BOTH accounts: <strong>@chithirai.creations</strong> &amp; <strong>@svsfoods</strong>!
                  </p>

                  <div className="live-dates-pill">
                    <span>📅 Start: <strong>31 Oct 2026</strong></span>
                    <span>⏰ Last Date: <strong>09 Nov 2026</strong></span>
                    <span>🏆 Prizes: <strong>₹1,00,000</strong></span>
                  </div>

                  <div className="live-card-actions">
                    <Link to="/" className="btn-explore-diwali">
                      <DiyaIcon size={20} /> Explore Diwali Contest & Rules
                    </Link>
                  </div>
                </div>

                <div className="diwali-live-badge-card">
                  <div className="live-trophy-badge">🏆</div>
                  <div className="live-prize-big">₹1,00,000</div>
                  <div className="live-prize-sub">Total Prizes Worth</div>
                  <div className="live-sweets-icons-row">
                    <span>🥮</span>
                    <span>🍯</span>
                    <span>🟡</span>
                    <span>💎</span>
                  </div>
                  <p className="live-contest-motto">Make it. Record it. Share it. Win it!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section for Madurai Samayal Rani */}
        <section className="event-hero-section">
          <div className="container text-center">
            <div className="exclusive-badge" data-aos="zoom-in">
              🎉 Exclusive Event Showcase
            </div>

            <h1 className="event-main-title" data-aos="fade-up">
              Maduraiyin <span className="gold-shimmer-text">Samayal Rani</span>
            </h1>

            <p className="event-hero-subtitle" data-aos="fade-up" data-aos-delay="100">
              Celebrate the spirit of every cooking queen in Madurai
            </p>
          </div>
        </section>

        {/* Event Description */}
        <section className="event-story-section">
          <div className="container">
            <div className="event-description-card" data-aos="fade-up">
              <div className="desc-header">
                <h2>
                  The Journey of <span className="highlight">Madurai Samayal Rani</span>
                </h2>
                <p className="lead-text">
                  Celebrate the spirit of every cooking queen with the Madurai Samayal Rani Competition!
                  A stage to cheer up women whose culinary talents often go unseen. Showcase your special dishes
                  and let your hidden efforts shine bright. Win exciting gifts, cash prizes, and the recognition
                  you truly deserve. From spicy biryanis to sweet delights — every recipe tells your story.
                  Join us and turn your passion into pride and applause!
                </p>
                <div className="quote-box">
                  <IoSparkles className="quote-icon" />
                  <p className="quote">
                    "From spicy biryanis to sweet delights — every recipe tells your story. Join us and turn
                    your passion into pride and applause!"
                  </p>
                </div>
              </div>

              {/* Event Details Grid */}
              <div className="event-details-grid">
                {eventDetails.map((detail, index) => (
                  <div key={index} className="detail-card" data-aos="fade-up" data-aos-delay={index * 100}>
                    <div className="detail-icon-wrap">{detail.icon}</div>
                    <h4>{detail.title}</h4>
                    {detail.details.map((item, i) => (
                      <p key={i} className="detail-item">
                        {item}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="event-highlights-section">
          <div className="container">
            <div className="text-center mb-5">
              <div className="exclusive-badge" data-aos="fade-down">
                🌟 Exciting Advantages
              </div>
              <h2 className="section-title" data-aos="fade-up">
                Event <span className="gold-shimmer-text">Highlights</span>
              </h2>
            </div>

            <div className="highlights-grid">
              {eventHighlights.map((highlight, index) => (
                <div
                  key={highlight.id}
                  className="highlight-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                >
                  <div className="highlight-icon">{highlight.icon}</div>
                  <h4>{highlight.title}</h4>
                  <p>{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Competition Categories */}
        <section className="event-categories-section">
          <div className="container">
            <div className="text-center mb-5">
              <div className="exclusive-badge" data-aos="fade-down">
                🍳 Culinary Arenas
              </div>
              <h2 className="section-title" data-aos="fade-up">
                Competition <span className="gold-shimmer-text">Categories</span>
              </h2>
            </div>

            <div className="categories-grid">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="category-badge-card"
                  data-aos="zoom-in"
                  data-aos-delay={index * 60}
                >
                  <FaUtensils className="cat-icon" />
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="event-gallery-section">
          <div className="container">
            <div className="text-center mb-5">
              <div className="exclusive-badge" data-aos="fade-down">
                📸 Memorable Moments
              </div>
              <h2 className="section-title" data-aos="fade-up">
                Event <span className="gold-shimmer-text">Gallery</span>
              </h2>
            </div>

            <div className="gallery-grid">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="gallery-item-wrap"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={`Gallery Event ${index + 1}`} className="gallery-photo" />
                  <div className="gallery-hover-overlay">
                    <FaCamera /> View Photo
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Signature Past Events Collection */}
        <section className="past-events-collection-section py-5">
          <div className="container">
            <div className="text-center mb-5">
              <div className="exclusive-badge" data-aos="fade-down">
                🏆 Event Milestones
              </div>
              <h2 className="section-title" data-aos="fade-up">
                More Past <span className="gold-shimmer-text">Signature Events</span>
              </h2>
              <p className="lead-text text-center text-white-50" data-aos="fade-up" data-aos-delay="100">
                A legacy of bringing Madurai's vibrant culture, sports championships, and celebrations to life.
              </p>
            </div>

            <div className="row g-4 justify-content-center">
              {/* Event 1: Chithirai Thiruvizha Contest */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="past-event-feature-card">
                  <div className="past-event-badge">CULTURAL CELEBRATION</div>
                  <div className="past-event-icon">🪔</div>
                  <h3>Chithirai Thiruvizha Contest</h3>
                  <p>
                    A grand cultural extravaganza celebrating Madurai's iconic Chithirai festival with traditional attire, heritage contests, and community games.
                  </p>
                  <div className="past-event-tags">
                    <span>Madurai Heritage</span>
                    <span>Cultural Fest</span>
                  </div>
                </div>
              </div>

              {/* Event 2: Ready Ah Mamay New Year Party */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div className="past-event-feature-card">
                  <div className="past-event-badge">ENTERTAINMENT &amp; DJ</div>
                  <div className="past-event-icon">🎉</div>
                  <h3>Ready Ah Mamay New Party</h3>
                  <p>
                    Madurai's most talked-about celebration night! Featuring live DJ performances, high-energy dance floors, mocktails, and family entertainment.
                  </p>
                  <div className="past-event-tags">
                    <span>Live DJ Night</span>
                    <span>Family Gala</span>
                  </div>
                </div>
              </div>

              {/* Event 3: Blackcaps Cricket Tournament Season 2 */}
              <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                <div className="past-event-feature-card">
                  <div className="past-event-badge">SPORTS CHAMPIONSHIP</div>
                  <div className="past-event-icon">🏏</div>
                  <h3>Blackcaps Cricket Tournament Season 2</h3>
                  <p>
                    An adrenaline-pumping turf &amp; field cricket championship bringing together the best amateur teams across South Tamil Nadu with massive trophies and cash rewards.
                  </p>
                  <div className="past-event-tags">
                    <span>Season 2 Trophy</span>
                    <span>Turf Cricket</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox for Gallery Photo */}
      {selectedImage && (
        <div className="gallery-lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-lightbox-btn" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
            <img src={selectedImage} alt="Enlarged view" className="lightbox-img" />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="events-footer py-4 text-center">
        <p className="m-0">© 2025 Chithirai Creations. All rights reserved.</p>
      </footer>
    </div>
  );
}
