import React, { useEffect } from "react";
import Header from "./Header/Header";
import DiwaliThreeCanvas from "../components/DiwaliThreeCanvas";
import logo from "../assets/logo_header.png";
import AOS from "aos";
import "aos/dist/aos.css";
import "./AboutPage.css";
import { Link } from "react-router-dom";
import { FaAward, FaHeart } from "react-icons/fa6";
import { IoSparkles } from "react-icons/io5";
import DiyaIcon from "../components/DiyaIcon";

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: false });
  }, []);

  return (
    <div className="about-page-wrapper">
      <Header />

      {/* 3D Festive Background */}
      <div className="about-canvas-bg">
        <DiwaliThreeCanvas />
      </div>

      <main className="about-main-container">
        {/* Hero Section */}
        <section className="about-hero-section">
          <div className="container text-center">
            <div className="festive-badge" data-aos="zoom-in">
              <DiyaIcon size={24} className="diya-glow-icon" />
              <span>Rooted in Madurai • Celebrating Together</span>
              <DiyaIcon size={24} className="diya-glow-icon" />
            </div>

            <h1 className="about-hero-title" data-aos="fade-up" data-aos-delay="100">
              About <span className="gold-shimmer-text">Chithirai Creations</span>
            </h1>

            <p className="about-hero-tagline" data-aos="fade-up" data-aos-delay="200">
              Transforming events into unforgettable cultural memories & empowering our local community.
            </p>

            <div className="about-brand-logo-card" data-aos="zoom-in" data-aos-delay="300">
              <img src={logo} alt="Chithirai Creations" className="about-main-logo" />
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="about-story-section">
          <div className="container">
            <div className="story-card" data-aos="fade-up">
              <div className="story-content">
                <div className="section-pill">
                  <IoSparkles /> Our Journey & Vision
                </div>
                <h2 className="story-heading">
                  More Than Just Events — We Create <span className="highlight-text">Joy & Heritage</span>
                </h2>
                <p className="story-text">
                  A group of dynamic influencers came together to create Chithirai Creations, a registered
                  events company. Their dream was to do more than just organize events; they aimed to bring
                  joy to people's lives while raising awareness about important issues.
                </p>
                <p className="story-text">
                  Through spirited sports competitions and engaging activities, they created a unique
                  atmosphere that tied participants back to the roots of Madurai's culture and heritage.
                  Moreover, Chithirai Creations provided an exceptional platform for emerging brands in
                  Madurai, offering them high visibility and a chance to connect with the local community.
                </p>
                <p className="story-text highlighted-quote">
                  "Their vision continues to inspire, fostering a positive environment where people can
                  celebrate and grow together, all while promoting a healthier society."
                </p>
              </div>

              <div className="story-festive-visual-box">
                <div className="visual-glow-circle">
                  <span className="festive-big-emoji">🪔</span>
                </div>
                <h3>Celebrating Culture & Community</h3>
                <p>Madurai • Traditions • Joy • Entertainment</p>
                <div className="festive-tags-row">
                  <span className="f-tag">✨ Heritage</span>
                  <span className="f-tag">🎉 Joy</span>
                  <span className="f-tag">🤝 Unity</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="about-stats-section">
          <div className="container">
            <div className="stats-grid">
              <div className="stat-card" data-aos="fade-up" data-aos-delay="100">
                <div className="stat-icon-wrap">🏆</div>
                <div className="stat-number">5+</div>
                <div className="stat-label">Events Organized</div>
              </div>

              <div className="stat-card" data-aos="fade-up" data-aos-delay="200">
                <div className="stat-icon-wrap">🌟</div>
                <div className="stat-number">5000+</div>
                <div className="stat-label">Happy Attendees</div>
              </div>

              <div className="stat-card" data-aos="fade-up" data-aos-delay="300">
                <div className="stat-icon-wrap">⏳</div>
                <div className="stat-number">1+</div>
                <div className="stat-label">Years of Excellence</div>
              </div>

              <div className="stat-card" data-aos="fade-up" data-aos-delay="400">
                <div className="stat-icon-wrap">❤️</div>
                <div className="stat-number">100%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / What Makes Us Special */}
        <section className="about-features-section">
          <div className="container">
            <div className="text-center mb-5">
              <div className="section-pill" data-aos="fade-down">
                <FaAward /> What Sets Us Apart
              </div>
              <h2 className="section-title" data-aos="fade-up">
                What Makes Us <span className="gold-shimmer-text">Special</span>
              </h2>
              <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
                Committed to delivering rich experiences that honor tradition and empower community talent.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-item" data-aos="fade-up" data-aos-delay="100">
                <div className="feature-icon-box">🎭</div>
                <h3>Cultural Authenticity</h3>
                <p>Deep-rooted in Madurai's traditions and customs</p>
              </div>

              <div className="feature-item" data-aos="fade-up" data-aos-delay="200">
                <div className="feature-icon-box">🌟</div>
                <h3>Creative Excellence</h3>
                <p>Innovative event concepts with attention to detail</p>
              </div>

              <div className="feature-item" data-aos="fade-up" data-aos-delay="300">
                <div className="feature-icon-box">🤝</div>
                <h3>Community Focus</h3>
                <p>Events that bring people together and create bonds</p>
              </div>

              <div className="feature-item" data-aos="fade-up" data-aos-delay="400">
                <div className="feature-icon-box">💫</div>
                <h3>Memorable Experiences</h3>
                <p>Creating moments that attendees cherish forever</p>
              </div>
            </div>

            <div className="cta-action-box text-center mt-5" data-aos="zoom-in">
              <h3>Experience Our Current Festivities</h3>
              <p>Explore the ongoing "Digital Diwali Palagaram Villa" and join the celebration!</p>
              <Link to="/" className="diwali-cta-btn">
                <DiyaIcon size={20} /> Explore Diwali Event
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="about-footer py-4 text-center">
        <p className="m-0">© 2025 Chithirai Creations. All rights reserved.</p>
      </footer>
    </div>
  );
}
