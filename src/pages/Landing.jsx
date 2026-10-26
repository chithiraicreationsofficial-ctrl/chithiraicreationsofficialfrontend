import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import DiwaliThreeCanvas from "../components/DiwaliThreeCanvas";
import DiyaIcon from "../components/DiyaIcon";
import EventRegistrationForm from "../components/EventRegistrationForm";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Landing.css";

// Assets
import svsLogo from "../assets/diwali/svs_title_sponsor_cropped.png";
import footBanner from "../assets/foot_web.png";
import footImg from "../assets/foot.png";

// Icons
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoSparkles,
  IoCheckmarkCircle,
  IoClose,
} from "react-icons/io5";
import {
  FaTrophy,
  FaAward,
  FaCamera,
  FaVideo,
  FaGift,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
  FaArrowRight,
  FaUtensils,
  FaStar,
  FaFire,
  FaPenToSquare,
} from "react-icons/fa6";
import { MdCelebration, MdOutlineLightbulb, MdShield } from "react-icons/md";

export default function Landing() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);

  return (
    <div className="landing-page-root" id="top">
      <Header />

      {/* 3D Diwali Three.js Interactive Canvas with Animated Firecrackers */}
      <div className="landing-three-canvas-wrap">
        <DiwaliThreeCanvas />
      </div>

      {/* ========================================================
          HERO SECTION: DIGITAL DIWALI PALAGARAM VILLA
          Featuring /src/assets/foot.png as the Grand Hero Banner
         ======================================================== */}
      <section className="diwali-hero-section">
        {/* Foot.png Banner Backdrop with Festive Vignette */}
        <div
          className="hero-foot-banner-backdrop"
          style={{ backgroundImage: `url(${footBanner})` }}
        ></div>
        <div className="hero-banner-overlay-gradient"></div>

        <div className="container diwali-hero-inner text-center position-relative">
          {/* Top festive marquee garland */}
          <div className="festive-garland-bar" data-aos="fade-down">
            <span className="garland-bell">🔔</span>
            <DiyaIcon size={24} />
            <span className="garland-text">
              ✨ HAPPY DIWALI 2026 • CELEBRATING TRADITION &amp; SWEET MEMORIES ✨
            </span>
            <DiyaIcon size={24} />
            <span className="garland-bell">🔔</span>
          </div>

          {/* Organizer / Presents badge */}
          <div className="organizer-badge-wrap" data-aos="zoom-in" data-aos-delay="100">
            <span className="presents-subline">CHITHIRAI CREATIONS PRESENTS</span>
          </div>

          {/* ==============================================
              TITLE SPONSOR SVS: PERFECT SIZE & SPOTLIGHT
             ============================================== */}
          <div className="title-sponsor-hero-banner" data-aos="zoom-in" data-aos-delay="150">
            <div className="title-sponsor-card">
              <div className="sponsor-crown-label">
                <FaStar className="star-icon" />
                <span>TITLE SPONSOR</span>
                <FaStar className="star-icon" />
              </div>
              <div className="sponsor-logo-box">
                <img
                  src={svsLogo}
                  alt="SVS Title Sponsor"
                  className="svs-title-sponsor-img"
                />
              </div>
            </div>
          </div>

          {/* Main Contest Heading (Clean Poppins Font) */}
          <div className="diwali-titles-block" data-aos="fade-up" data-aos-delay="200">
            <h1 className="diwali-main-heading">
              DIGITAL <span className="diwali-highlight-script">DIWALI</span>
            </h1>
            <h2 className="palagaram-subheading">PALAGARAM VILLA</h2>
          </div>

          <p className="hero-sweet-tagline" data-aos="fade-up" data-aos-delay="250">
            SHOWCASE YOUR DIWALI SWEETS, CELEBRATE TRADITION &amp; WIN BIG!
          </p>

          {/* Grand Prize Worth Banner */}
          <div className="prize-worth-hero-pill" data-aos="zoom-in" data-aos-delay="300">
            <div className="prize-pill-glow"></div>
            <FaTrophy className="prize-trophy-icon" />
            <div className="prize-text-group">
              <span className="prize-label">TOTAL PRIZES WORTH</span>
              <span className="prize-amount">₹60,000!</span>
            </div>
            <MdCelebration className="prize-popper-icon" />
          </div>

          {/* Key Dates & Format Quick Bar (No mention of venue/result day) */}
          <div className="hero-quick-meta-grid" data-aos="fade-up" data-aos-delay="350">
            <div className="meta-pill">
              <IoCalendarOutline className="meta-icon" />
              <div className="meta-content">
                <span className="meta-lbl">START DATE</span>
                <span className="meta-val">28 OCT 2026</span>
              </div>
            </div>

            <div className="meta-pill highlight-deadline">
              <IoTimeOutline className="meta-icon" />
              <div className="meta-content">
                <span className="meta-lbl">LAST DATE</span>
                <span className="meta-val">09 NOV 2026</span>
              </div>
            </div>

            <div className="meta-pill">
              <IoSparkles className="meta-icon text-warning" />
              <div className="meta-content">
                <span className="meta-lbl">CONTEST FORMAT</span>
                <span className="meta-val">ONLINE (REELS &amp; PHOTOS)</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="hero-action-buttons" data-aos="fade-up" data-aos-delay="400">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="btn-diwali-primary"
            >
              <FaPenToSquare /> Register for Contest
            </button>

            <a href="#how-to-participate" className="btn-diwali-secondary">
              <FaUtensils /> How to Participate
            </a>

            <a
              href="https://www.instagram.com/chithirai.creations"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-diwali-instagram"
            >
              <FaInstagram /> Collab on Instagram
            </a>
          </div>

          {/* Slogan pill */}
          <div className="festive-motto-pill" data-aos="fade-up" data-aos-delay="450">
            <span>✨ Make it. Record it. Share it. Win it! ✨</span>
          </div>

          {/* Interactive Crackers Hint */}
          <div className="tap-crackers-hint" data-aos="fade-up" data-aos-delay="500">
            <FaFire className="fire-icon-hint" /> Tap anywhere on screen to burst Diwali crackers!
          </div>
        </div>
      </section>

      {/* ========================================================
          GRAND CELEBRATION SHOWCASE: /src/assets/foot.png
         ======================================================== */}
      <section className="celebration-showcase-section py-5" id="celebrations">
        <div className="container">
          <div className="text-center mb-4" data-aos="fade-up">
            <div className="section-mini-pill">
              <IoSparkles /> Grand Moments
            </div>
            <h2 className="section-main-heading">
              Celebrate With <span className="gold-shimmer-text">Chithirai Creations</span>
            </h2>
            <p className="section-lead-text">
              Spreading festive smiles, delicious traditions, and unforgettable memories across Tamil Nadu!
            </p>
          </div>

          <div className="celebration-photo-card" data-aos="zoom-in">
            <div className="photo-inner-frame">
              <img
                src={footImg}
                alt="Chithirai Creations Celebration Stage"
                className="celebration-main-photo"
              />
              <div className="photo-bottom-glow-bar">
                <div className="photo-title-wrap">
                  <span className="photo-festive-tag">🎉 DIWALI CELEBRATION MOMENTS</span>
                  <h3 className="photo-banner-heading">Digital Diwali Palagaram Villa 2026</h3>
                  <p className="photo-banner-sub">
                    Showcase your traditional sweets, upload your reels &amp; photos, and win prizes worth ₹60,000!
                  </p>
                </div>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="btn-photo-register"
                >
                  <FaPenToSquare /> Register for Contest
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          HOW TO PARTICIPATE (5 STEPS)
         ======================================================== */}
      <section className="how-to-participate-section py-5" id="how-to-participate">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <div className="section-mini-pill">
              <FaUtensils /> Easy 5-Step Process
            </div>
            <h2 className="section-main-heading">
              How To <span className="gold-shimmer-text">Participate?</span>
            </h2>
            <p className="section-lead-text">
              Follow these simple steps from the comfort of your kitchen to participate and win!
            </p>
          </div>

          <div className="steps-process-row">
            {/* Step 1 */}
            <div className="step-process-card" data-aos="fade-up" data-aos-delay="100">
              <div className="step-num-bubble">01</div>
              <div className="step-icon-wrap">👨‍🍳</div>
              <h3>Make Your Sweet</h3>
              <p>Prepare your signature Diwali Sweet or Palagaram with passion and authentic taste.</p>
            </div>

            <div className="step-connector-arrow">➔</div>

            {/* Step 2 */}
            <div className="step-process-card" data-aos="fade-up" data-aos-delay="200">
              <div className="step-num-bubble">02</div>
              <div className="step-icon-wrap">📱</div>
              <h3>Record / Click</h3>
              <p>Record a video or click photos of your dish. <em>(Mobile phone only)</em></p>
            </div>

            <div className="step-connector-arrow">➔</div>

            {/* Step 3 */}
            <div className="step-process-card" data-aos="fade-up" data-aos-delay="300">
              <div className="step-num-bubble">03</div>
              <div className="step-icon-wrap">🎬</div>
              <h3>Upload Content</h3>
              <p>Upload your video as an Instagram Reel or upload as a Photo post.</p>
            </div>

            <div className="step-connector-arrow">➔</div>

            {/* Step 4 */}
            <div className="step-process-card highlight-step" data-aos="fade-up" data-aos-delay="400">
              <div className="step-num-bubble">04</div>
              <div className="step-icon-wrap">🤝</div>
              <h3>Collab With Us</h3>
              <p>Collab with <strong>@chithirai.creations</strong> Instagram account on your post.</p>
            </div>

            <div className="step-connector-arrow">➔</div>

            {/* Step 5 */}
            <div className="step-process-card" data-aos="fade-up" data-aos-delay="500">
              <div className="step-num-bubble">05</div>
              <div className="step-icon-wrap">🍯</div>
              <h3>List Ingredients</h3>
              <p>Mention all ingredients used in your caption and celebrate tradition!</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PRIZES & CATEGORIES SECTION
         ======================================================== */}
      <section className="diwali-prizes-section py-5" id="prizes">
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <div className="section-mini-pill">
              <FaAward /> Rewards &amp; Recognition
            </div>
            <h2 className="section-main-heading">
              Contest Categories &amp; <span className="gold-shimmer-text">Prizes</span>
            </h2>
            <p className="section-lead-text">
              Total Prizes Worth ₹60,000 + Exciting Gifts from SVS Title Sponsor!
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Reel Category */}
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
              <div className="prize-podium-card reel-category-card">
                <div className="category-header">
                  <FaVideo className="cat-type-icon" />
                  <h3>REEL CATEGORY</h3>
                </div>

                <div className="winners-list">
                  <div className="winner-rank-item rank-gold">
                    <div className="rank-badge">🥇 1st</div>
                    <div className="rank-details">
                      <h4>WINNER</h4>
                      <p>Grand Cash Prize + Trophy &amp; Brand Hamper</p>
                    </div>
                  </div>

                  <div className="winner-rank-item rank-silver">
                    <div className="rank-badge">🥈 2nd</div>
                    <div className="rank-details">
                      <h4>RUNNER-UP</h4>
                      <p>Cash Prize + Runner-Up Trophy &amp; Gifts</p>
                    </div>
                  </div>
                </div>

                <div className="category-footer-tag">Judged on Video &amp; Preparation</div>
              </div>
            </div>

            {/* Photo Category */}
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
              <div className="prize-podium-card photo-category-card">
                <div className="category-header">
                  <FaCamera className="cat-type-icon" />
                  <h3>PHOTO CATEGORY</h3>
                </div>

                <div className="winners-list">
                  <div className="winner-rank-item rank-gold">
                    <div className="rank-badge">🥇 1st</div>
                    <div className="rank-details">
                      <h4>WINNER</h4>
                      <p>Grand Cash Prize + Trophy &amp; Brand Hamper</p>
                    </div>
                  </div>

                  <div className="winner-rank-item rank-silver">
                    <div className="rank-badge">🥈 2nd</div>
                    <div className="rank-details">
                      <h4>RUNNER-UP</h4>
                      <p>Cash Prize + Runner-Up Trophy &amp; Gifts</p>
                    </div>
                  </div>
                </div>

                <div className="category-footer-tag">Judged on Presentation &amp; Styling</div>
              </div>
            </div>

            {/* Special Prize */}
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
              <div className="prize-podium-card special-category-card">
                <div className="category-header">
                  <FaGift className="cat-type-icon text-warning" />
                  <h3>SPECIAL PRIZE</h3>
                </div>

                <div className="special-prize-body text-center py-4">
                  <div className="special-gift-icon">🎁</div>
                  <h4>Outstanding Entry Award</h4>
                  <p>
                    A special curated prize will also be awarded for a uniquely outstanding recipe,
                    cultural storytelling, or innovative flavor!
                  </p>
                </div>

                <div className="category-footer-tag special-tag">Curated Jury Recognition</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          ELIGIBILITY & CONDITIONS + JUDGING CRITERIA
         ======================================================== */}
      <section className="rules-judging-section py-5" id="rules">
        <div className="container">
          <div className="row g-4">
            {/* Eligibility & Conditions */}
            <div className="col-lg-6" data-aos="fade-right">
              <div className="rules-card">
                <div className="rules-card-header">
                  <MdShield className="rules-header-icon" />
                  <h3>ELIGIBILITY &amp; CONDITIONS</h3>
                </div>

                <ul className="conditions-list">
                  <li>
                    <IoCheckmarkCircle className="check-icon" />
                    <span><strong>No gender restriction:</strong> Everyone can participate</span>
                  </li>
                  <li>
                    <IoCheckmarkCircle className="check-icon" />
                    <span><strong>No upper age limit:</strong> Minimum age requirement is 4 years+</span>
                  </li>
                  <li className="rule-alert-item">
                    <span className="alert-bullet">⚠️</span>
                    <span><strong>Fair Play Rule:</strong> Participants with more than <strong>2,000 followers are NOT eligible</strong></span>
                  </li>
                  <li>
                    <IoCheckmarkCircle className="check-icon" />
                    <span>Content must be your own original preparation</span>
                  </li>
                  <li>
                    <IoCheckmarkCircle className="check-icon" />
                    <span>Entry must be uploaded within the contest period (28 Oct – 09 Nov 2026)</span>
                  </li>
                  <li>
                    <IoCheckmarkCircle className="check-icon" />
                    <span>Collab with Chithirai Creations (@chithirai.creations) is mandatory</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Judging Criteria */}
            <div className="col-lg-6" data-aos="fade-left">
              <div className="judging-card">
                <div className="rules-card-header">
                  <MdOutlineLightbulb className="rules-header-icon text-warning" />
                  <h3>JUDGING CRITERIA</h3>
                </div>

                <div className="criteria-list">
                  <div className="criteria-item">
                    <div className="criteria-icon">⭐</div>
                    <div className="criteria-text">
                      <h4>UNIQUENESS</h4>
                      <p>Distinct taste, recipe origin, or authentic heritage method</p>
                    </div>
                  </div>

                  <div className="criteria-item">
                    <div className="criteria-icon">💡</div>
                    <div className="criteria-text">
                      <h4>CREATIVITY</h4>
                      <p>Original touches, creative plating, and engaging presentation</p>
                    </div>
                  </div>

                  <div className="criteria-item">
                    <div className="criteria-icon">🍽️</div>
                    <div className="criteria-text">
                      <h4>PRESENTATION</h4>
                      <p>Visual appeal of the festive sweet / palagaram</p>
                    </div>
                  </div>

                  <div className="criteria-item">
                    <div className="criteria-icon">⚙️</div>
                    <div className="criteria-text">
                      <h4>CONCEPT &amp; INNOVATION</h4>
                      <p>Flavor balance and clever modern or traditional execution</p>
                    </div>
                  </div>

                  <div className="criteria-item">
                    <div className="criteria-icon">👁️</div>
                    <div className="criteria-text">
                      <h4>OVERALL VISUAL APPEAL</h4>
                      <p>Clarity, neatness, and aesthetic allure of the photo or reel</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SPONSOR SECTION (ONLY SVS TITLE SPONSOR)
         ======================================================== */}
      <section className="sponsors-showcase-section py-5">
        <div className="container text-center">
          <div className="section-mini-pill" data-aos="fade-down">
            ⭐ Official Title Partner
          </div>
          <h2 className="section-main-heading mb-4" data-aos="fade-up">
            Powered By Our <span className="gold-shimmer-text">Title Sponsor</span>
          </h2>

          {/* SVS Title Sponsor Spotlight */}
          <div className="title-sponsor-spotlight-card" data-aos="zoom-in">
            <div className="spotlight-crown">
              ⭐ TITLE SPONSOR ⭐
            </div>
            <div className="spotlight-logo-wrap">
              <img
                src={svsLogo}
                alt="SVS Title Sponsor"
                className="spotlight-svs-img"
              />
            </div>
            <p className="spotlight-caption">Proudly powering Digital Diwali Palagaram Villa 2026</p>
          </div>
        </div>
      </section>

      {/* ========================================================
          DISCOVER CHITHIRAI CREATIONS (ABOUT & EVENTS NAV CARDS)
         ======================================================== */}
      <section className="discover-more-section py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="discover-card about-discover-card">
                <div className="discover-content">
                  <span className="discover-mini-tag">OUR STORY &amp; VISION</span>
                  <h3>About Chithirai Creations</h3>
                  <p>
                    A registered events company founded by dynamic influencers bringing joy, celebrating
                    Madurai's heritage, and empowering emerging brands and community talent.
                  </p>
                  <Link to="/about" className="btn-discover-link">
                    Explore About Us <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-left">
              <div className="discover-card events-discover-card">
                <div className="discover-content">
                  <span className="discover-mini-tag">PAST HIGHLIGHTS</span>
                  <h3>Maduraiyin Samayal Rani</h3>
                  <p>
                    Celebrate the spirit of every cooking queen in Madurai. Discover event highlights,
                    esteemed judges, photos, and exclusive memories.
                  </p>
                  <Link to="/events" className="btn-discover-link">
                    View Event Showcase <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FOOTER SECTION
         ======================================================== */}
      <footer className="diwali-landing-footer py-4">
        <div className="container text-center">
          <div className="footer-diya-center mb-3">
            <DiyaIcon size={32} />
          </div>
          <p className="footer-copyright mb-3">
            All Rights Reserved © Copyright 2026 • Chithirai Creations
          </p>

          <div className="footer-social-row">
            <a
              href="https://www.instagram.com/chithirai.creations?igsh=ZG15MnZzbXU1bWZu"
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill instagram"
            >
              <FaInstagram /> Instagram
            </a>

            <a
              href="https://wa.me/917010240042"
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill whatsapp"
            >
              <FaWhatsapp /> WhatsApp
            </a>

            <a
              href="https://youtube.com/@chithiraicreations?si=RyqEiTLtjW-MKKa4"
              target="_blank"
              rel="noopener noreferrer"
              className="social-pill youtube"
            >
              <FaYoutube /> YouTube
            </a>

            <a
              href="mailto:chithiraicreations@gmail.com"
              className="social-pill email"
            >
              ✉️ Email
            </a>
          </div>
        </div>
      </footer>

      {/* ========================================================
          REGISTRATION MODAL DIALOG (SHOWS ONLY ON BUTTON CLICK)
         ======================================================== */}
      {showRegisterModal && (
        <div
          className="registration-modal-overlay"
          onClick={() => setShowRegisterModal(false)}
        >
          <div
            className="registration-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="registration-modal-close-top"
              onClick={() => setShowRegisterModal(false)}
              aria-label="Close Registration Dialog"
            >
              <IoClose />
            </button>
            <EventRegistrationForm onClose={() => setShowRegisterModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
