import Header from "./Header/Header";
import React, { useState, useEffect } from "react";
import { IoLocation } from "react-icons/io5";
import { Link } from "react-router-dom";

import "./Landing.css";

import InvestImage1 from "../assets/invest1.png";
import InvestImage2 from "../assets/invest2.png";
import InvestImage3 from "../assets/invest3.png";
import InvestImage4 from "../assets/invest4.png";
import InvestImage5 from "../assets/invest5.png";
import InvestImage6 from "../assets/invest6.png";
import InvestImage7 from "../assets/invest7.png";
import InvestImage8 from "../assets/invest8.png";
import InvestImage9 from "../assets/invest9.png";
import InvestImage10 from "../assets/invest10.png";
import card1 from "../assets/card1.png";
import mad from "../assets/mad.png";
import card2 from "../assets/card2.png";
import card3 from "../assets/card3.png";
import card4 from "../assets/card4.png";
import { IoIosArrowForward } from "react-icons/io";

import { FaArrowRightLong } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { IoTicket } from "react-icons/io5";

import { MdCelebration } from "react-icons/md";
import { MdEvent } from "react-icons/md";

import { FaGamepad } from "react-icons/fa";

import logoDark from "../assets/LogoDark.png";

import facebook from "../assets/social/facebook.png";
import insta from "../assets/social/insta.png";
import tg from "../assets/social/tg.png";
import x from "../assets/social/x.png";
import yt from "../assets/social/yt.png";

import title1 from "../assets/stock/title1.png";
import title2 from "../assets/stock/title2.png";
import co1 from "../assets/stock/co1.png";
import co2 from "../assets/stock/co2.png";
import co3 from "../assets/stock/co3.png";
import co4 from "../assets/stock/co4.png";
import food from "../assets/stock/food.png";
import travel from "../assets/stock/travel.png";
import venue from "../assets/stock/venue.png";
import title from "../assets/title.png";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import SponsorModal from "./SponsorModal";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Landing() {
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  useEffect(() => {
    AOS.init({
      duration: 2000, // animation duration
      once: false, // if true animation runs only once
    });
  }, []);
  return (
    <>
      <Header />

      <div className="hero-section">
        <div className="hero-content slide-up">
          {/* <h1 className="hero-title">Readya Mamey</h1> */}

          <p className="hero-tagline mt-5" data-aos="fade-down">
            A night of music <br /> moments and magics
          </p>

          <p className="hero-subtext" data-aos="fade-down">
            We're hosting a fantastic New year's <br /> Evening celebration on
            December 31st!
          </p>

          <img src={title} alt="logo" data-aos="flip-left" width="100%" />

          <button
            className="primary_btn my-5"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            data-aos="fade-down"
          >
            Book Your Ticket Now{" "}
          </button>
        </div>
      </div>

      {/* <section className="hero-section ">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Readya Mamey
                    </h1>
                    <p className="hero-description">
                        Presented By <span>
                            Chithirai Creation
                        </span>
                    </p>
                    <div className="hero-buttons">
                        <button className=""></button>
                    </div>
                </div>


            </section> */}

      <section className="section2 ">
        <div className="container">
          <div
            onClick={() => setShowSponsorModal(true)}
            className="top d-flex justify-content-center gap-3 align-items-center"
          >
            <h5 data-aos="fade-right">Our Sponsors</h5>
          </div>

          <h6 data-aos="fade-right" className="mt-5 mb-4">
            Title Sponsors
          </h6>

          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-4 col-6">
              <img src={title1} alt="logo" width="100%" />
            </div>
            <div className="col-lg-3 col-md-4 col-6">
              <img src={title2} alt="logo" width="100%" />
            </div>{" "}
          </div>
          <h6 data-aos="fade-right" className="mt-5">
            Travel Partner
          </h6>

          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-4 col-6">
              <img src={travel} alt="logo" width="100%" />
            </div>
          </div>
          <h6 data-aos="fade-right" className="mt-3">
            Co - Sponsors
          </h6>
          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-4 col-6">
              <img src={co1} alt="logo" width="100%" />
            </div>
            <div className="col-lg-3 col-md-4 col-6">
              <img src={co2} alt="logo" width="100%" />
            </div>{" "}
            <div className="col-lg-3 col-md-4 col-6">
              <img src={co3} alt="logo" width="100%" />
            </div>{" "}
            <div className="col-lg-3 col-md-4 col-6">
              <img src={co4} alt="logo" width="100%" />
            </div>
          </div>
          <h6 data-aos="fade-right" className="mt-5 mb-4">
            Food partner{" "}
          </h6>
          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-4 col-6">
              <img src={food} alt="logo" width="100%" />
            </div>
          </div>
          <h6 data-aos="fade-right" className="mt-5 mb-4">
            Venue partner{" "}
          </h6>
          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-4 col-6">
              <img src={venue} alt="logo" width="100%" />
            </div>
          </div>

          <button className="primary_btn1 mb-5 text-black d-block mx-auto mt-4">
            Join As Sponsor
          </button>
        </div>
      </section>

      <section className="section3 py-5 ">
        <div className="Main container">
          <div className="row">
            <div className="col-lg-7 d-flex flex-column justify-content-center">
              <h3 data-aos="fade-right">
                Readya Mamey –
                <span className="span"> 2026 New Year Celebration Event</span>
              </h3>
              <p data-aos="fade-right">
                Unleash the vibe. Own the night. Welcome the New Year in style!
              </p>

              <p data-aos="fade-right">
                2026 is almost here, and it's time to begin the celebration with
                maximum energy! Readya Mamey brings you the ultimate New Year
                bash — a platform for youngsters, creators, dancers, performers,
                and every fun-loving soul ready to shine.
              </p>

              <div className="dflex" data-aos="fade-right">
                <div className="stock-btn">exclusive prizes</div>
                <div className="stock-btn">Stage performances</div>
                <div className="stock-btn">talent showcases</div>
                <div className="stock-btn">Gifts & spotlight moment</div>
                <div className="stock-btn">2026 Welcome Fireworks Style</div>
              </div>

              <p data-aos="fade-right">
                Every laugh, every move, every cheer — this night belongs to
                you.
              </p>

              <p data-aos="fade-right">
                Join us and kickstart your New Year with pure high-energy
                celebration.
              </p>

              <div
                data-aos="fade-right"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                className=" starts d-flex gap-3 align-items-center"
              >
                <h5>
                  Let’s glow, let’s vibe, let’s party — Readya Mamey! 🎉💥
                </h5>
                <FaArrowRightLong />
              </div>
            </div>
            <div className="col-lg-5 hex-wrapper">
              {/* <img
                                src={InvestImage}
                                alt="logo"
                                width="80%"
                                className="d-block mx-auto"
                            /> */}

              <div class="hex h1" data-aos="fade-right">
                {" "}
                <img src={InvestImage1} class="hex-base" />
              </div>
              <div class="hex h2" data-aos="fade-right">
                <img src={InvestImage2} class="hex-base" />{" "}
              </div>
              <div class="hex h3" data-aos="fade-right">
                <img src={InvestImage3} class="hex-base" />{" "}
              </div>
              <div class="hex h4" data-aos="fade-right">
                {" "}
                <img src={InvestImage4} class="hex-base" />{" "}
              </div>
              <div class="hex h5" data-aos="fade-right">
                <img src={InvestImage5} class="hex-base" />{" "}
              </div>
              <div class="hex h6" data-aos="fade-right">
                <img src={InvestImage6} class="hex-base" />{" "}
              </div>
              <div class="hex h7" data-aos="fade-right">
                <img src={InvestImage6} class="hex-base" />{" "}
              </div>
              <div class="hex h8" data-aos="fade-right">
                {" "}
                <img src={InvestImage8} class="hex-base" />{" "}
              </div>
              <div class="hex h9" data-aos="fade-right">
                <img src={InvestImage9} class="hex-base" />{" "}
              </div>
              <div class="hex h10" data-aos="fade-right">
                {" "}
                <img src={InvestImage10} class="hex-base" />{" "}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section4 ">
        <div className="container ">
          <h3 className="span" data-aos="fade-right">
            Event Details
          </h3>
          <h3 data-aos="fade-right">
            Readya Mamey – 2026 New Year Celebration
          </h3>

          <div data-aos="fade-right" className="d-flex justify-content-center">
            <p data-aos="fade-right">
              Join us for a vibrant celebration filled with performances,
              lights, fun contests, and unforgettable memories.
            </p>
          </div>

          <div className="pos-rel">
            <div className="row">
              <div className="col-lg-4">
                <div className="start-card p-5" data-aos="fade-right">
                  <h5>Event Date</h5>
                  <h6>31 December 2025 </h6>
                  <h4>
                    Celebrate the arrival of 2026 with an Readya Mamey
                    Celebration night!
                  </h4>
                  <img src={mad} alt="card1" width="80px" className="temp" />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="start-card p-5" data-aos="fade-right">
                  <h5>Event Time</h5>
                  <h6>Starts at 7:00 PM – 1:00 AM</h6>
                  <h4>
                    Enjoy music, performances, games, and the grand New Year
                    countdown.
                  </h4>
                  <img src={mad} alt="card1" width="80px" className="temp" />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="start-card p-5" data-aos="fade-right">
                  <h5>Venue </h5>
                  <h6>
                    {" "}
                    The Party Park - Madurai{" "}
                    <a
                      href="https://maps.app.goo.gl/UNSAvMFiTMameH1s9"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      (Map <IoLocation />)
                    </a>
                  </h6>
                  <h4>
                    Cinematic neon setup, party lights, and a full festive
                    atmosphere.
                  </h4>
                  <img src={mad} alt="card1" width="80px" className="temp" />
                </div>
              </div>
            </div>
            <div className="innercard">
              <div className="abs-card">
                <div className="b-card-container" data-aos="fade-left">
                  <div className="b-card">
                    <IoTicket />
                    <h6>Booking</h6>
                  </div>

                  <span className="connector"></span>

                  <div className="b-card">
                    <FaPersonCircleCheck />
                    <h6>Pass</h6>
                  </div>

                  <span className="connector"></span>

                  <div className="b-card">
                    <FaGamepad />
                    <h6>Games</h6>
                  </div>

                  <span className="connector"></span>

                  <div className="b-card">
                    <MdEvent />
                    <h6>Vibez</h6>
                  </div>

                  <span className="connector"></span>

                  <div className="b-card">
                    <MdCelebration />
                    <h6>Celebration</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section5 ">
        <div className="pricing  p-5 container">
          <h3 data-aos="fade-right">
            Madurai’s <span className="span">Biggest</span> New Year Celebration
            is Here!
          </h3>
          <div className="d-flex justify-content-center">
            <p data-aos="fade-right">
              Celebrate the New Year in full energy with music, lights,
              unlimited food, neon effects, and a grand crackers show —
              everything included in a single all-access pass!
            </p>
          </div>

          <div className="row magic justify-content-center">
            <div className="col-lg-3 col-6 p-0 pos-rel" data-aos="fade-up">
              <img src={card1} alt="card1" className="card-img card1" />
            </div>
            <div className="col-lg-3 col-6 p-0 pos-rel" data-aos="fade-up">
              <img src={card2} alt="card2" className="card-img card2" />
            </div>
            <div className="col-lg-3 col-6 p-0 pos-rel" data-aos="fade-up">
              <img src={card3} alt="card3" className="card-img card3" />
            </div>
            <div className="col-lg-3 col-6 p-0 pos-rel" data-aos="fade-up">
              <img src={card4} alt="card4" className="card-img card4" />
            </div>
          </div>
        </div>
      </section>

      <section className="section7 ">
        <div className="bg">
          <div className="inside py-5 " data-aos="fade-down">
            <div>
              <h3>Readya Mamey 2026</h3>

              <p>Madurai’s Biggest New Year Celebration is Here!</p>

              <div
                className="btns"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Book Ticket
                <FaArrowRightLong />
              </div>
              {/* <img src={Cards} alt="logo" width="100%" /> */}
              <div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="footer  py-2">
        <div className="container-fluid">
          <div className="d-flex  par justify-content-between align-items-center">
            <div className="">
              <img src={logoDark} alt="logo" width="120px" />
            </div>
            <div className="">
              <h6>All Right Reserved © Copyright 2025</h6>
            </div>{" "}
            <div className="">
              <div className="d-flex gap-4">
                <Link to="">
                  <img src={facebook} alt="Assetly logo" width="24px" />
                </Link>
                <Link to="https://www.instagram.com/chithirai.creations/?hl=en" target="_blank">
                  <img src={insta} alt="Assetly logo" width="24px" />
                </Link>

                <Link to="">
                  <img src={x} alt="Assetly logo" width="24px" />
                </Link>

                <Link to="">
                  <img src={yt} alt="Assetly logo" width="24px" />
                </Link>

                <Link to="">
                  <img src={tg} alt="Assetly logo" width="24px" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SponsorModal
        isOpen={showSponsorModal}
        onClose={() => setShowSponsorModal(false)}
      />
    </>
  );
}
