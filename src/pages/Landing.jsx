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
import InvestImage7 from "../assets/open.png";
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
import ai from "../assets/stock/ai.png";
import photo from "../assets/stock/photo.png";
import power from "../assets/stock/power.png";
import co2 from "../assets/stock/co2.png";
import co3 from "../assets/stock/co3.png";
import co4 from "../assets/stock/co4.png";
import cric from "../assets/cric.png";
import outline from "../assets/outline.png";
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
      duration: 800, // animation duration
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
           MADURAI'S BIGGEST TURF CRICKET TOURNAMENT
          </p>

          {/* <p className="hero-subtext" data-aos="fade-down">
            We're hosting a fantastic New year's <br /> Evening celebration on
            December 31st!
          </p> */}

          <img src={title} alt="logo" data-aos="flip-left" width="60%" className="mb-5 pb-5" />

          {/* <button
            className="primary_btn my-5"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            disabled
            // data-aos="fade-down"
          >
            Booking Closed
          </button> */}
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
            // onClick={() => setShowSponsorModal(true)}
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
            Powered By
          </h6>

          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-4 col-6">
              <img src={power} alt="logo" width="100%" />
            </div>
          </div>
          {/* <h6 data-aos="fade-right" className="mt-5">
            Travel Partner
          </h6>

          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-4 col-6">
              <img src={travel} alt="logo" width="100%" />
            </div>
          </div> */}
          {/* <h6 data-aos="fade-right" className="mt-3">
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
          </div> */}
          {/* <h6 data-aos="fade-right" className="mt-5 mb-4">
            Food partner{" "}
          </h6>
          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-4 col-6">
              <img src={food} alt="logo" width="100%" />
            </div>
          </div> */}
          {/* <h6 data-aos="fade-right" className="mt-5 mb-4">
            Venue partner{" "}
          </h6>
          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-4 col-6">
              <img src={venue} alt="logo" width="100%" />
            </div>
          </div> */}


            <h6 data-aos="fade-right" className="mt-5 mb-4">
            AI partner{" "}
          </h6>
          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-4 col-6">
              <img src={ai} alt="logo" width="100%" />
            </div>
          </div>

          
            <h6 data-aos="fade-right" className="mt-5 mb-4">
            Photography partner{" "}
          </h6>
          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-4 col-6">
              <img src={photo} alt="logo" width="100%" />
            </div>
          </div>

          {/* <button className=" text-white primary_btn1 mb-5 text-black d-block mx-auto mt-4">
            <Link className="text-white"  to="mailto:chithiraicreations@gmail.com">
            Join As Sponsor

            </Link>
          </button> */}

          <img src={cric} alt="logo" width="40%" className="d-block m-auto" />

        </div>
      </section>

      <section className="section3 py-5 ">
        <div className="Main container">
          <div className="row">
            <div className="col-lg-12 d-flex flex-column justify-content-center">
              <h3 data-aos="fade-right">
              Blackcaps Turf Cricket – Tournament Season 2
              </h3>


              <h5>
              Madurai’s Biggest Turf Cricket Showdown
              </h5>

              <div class="hero-content" data-aos="fade-right">
  <p class="tagline" data-aos="fade-right">Unleash your game. Own the turf. Dominate the season.</p>

  <p class="highlight" data-aos="fade-right">Season 2 is here — and the battle just got bigger.</p>

  <p class="description" data-aos="fade-right">
    The ultimate competitive platform for passionate cricketers,
    rising teams, power hitters, sharp bowlers, and fearless captains.
  </p>

  <p class="bold-line" data-aos="fade-right">
    This isn’t just a tournament.
  </p>

  <p class="bold-line strong" data-aos="fade-right">
    This is where reputations are built.
  </p>
</div>

           
              <div className="dflex justify-content-center" data-aos="fade-right">
                <div className="stock-btn">Massive Cash Prizes</div>
                <div className="stock-btn">Championship Trophy & Medals</div>
                <div className="stock-btn">High-Intensity Turf Matches</div>
                <div className="stock-btn">Floodlight Night Battles</div>
                <div className="stock-btn">Live Scoring & Match Updates
                </div>

                <div className="stock-btn">Individual Awards & Recognition</div>
              </div>

              <p data-aos="fade-right">
              Every run, every wicket, every boundary —
              this turf belongs to the fearless.
              </p>

              <h5>
              Step onto the field - Lead your squad - Write your victory story.
              </h5>

            

              <div
                data-aos="fade-right"
                disabled
                className=" starts d-flex gap-3 align-items-center justify-content-center"
              >
                <h5>
                Let’s play hard. Let’s compete strong. Let’s lift the trophy —
                Blackcaps Turf Cricket – Season 2! 🏏🔥
                </h5>
                <FaArrowRightLong />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section4 ">
        <div className="container ">

        <img src={outline} alt="logo" width="70%" className="d-block m-auto mb-5" />

          <h3 className="span mt-5" data-aos="fade-right">
          🏏 Tournament Details
          </h3>
          <h3 data-aos="fade-right">
          Blackcaps Turf Cricket – Tournament Season 2
          </h3>

          <div data-aos="fade-right" className="d-flex justify-content-center">
            <p data-aos="fade-right">
            Step into Madurai’s biggest turf cricket battleground filled with power hitting, sharp bowling spells, thrilling finishes, and glory that lasts beyond the final over.
            </p>
          </div>

          <div className="pos-rel">
            <div className="row">
              <div className="col-lg-4">
                <div className="start-card p-5" data-aos="fade-right">
                  <h5>Tournament Date</h5>
                  <h6>March 15 – March 20, 2026 </h6>
                  <h4>
                  League + Knockout Format
                  </h4>
                  <img src={mad} alt="card1" width="80px" className="temp" />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="start-card p-5" data-aos="fade-right">
                  <h5>Match Timings</h5>
                  <h6>Starts at 5:00 PM – 11:00 PM
                  </h6>
                  <h4>
                  Under Floodlights
                  </h4>
                  <img src={mad} alt="card1" width="80px" className="temp" />
                </div>
              </div>

              <div className="col-lg-4">
                <div className="start-card p-5" data-aos="fade-right">
                  <h5>Venue </h5>
                  <h6>
                    {" "}
                    Premium Turf Arena – Madurai{" "}
                    <a
                      href="https://maps.app.goo.gl/UNSAvMFiTMameH1s9"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      (Map <IoLocation />)
                    </a>
                  </h6>
                  <h4>
                  Professional Playing Surface
                  </h4>
                  <img src={mad} alt="card1" width="80px" className="temp" />
                </div>
              </div>
            </div>
            {/* <div className="innercard">
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
            </div> */}
          </div>
        </div>
      </section>

      <section className="section5 ">
        <div className="pricing  p-5 container">
          <h3 data-aos="fade-right">
          Madurai’s  <span className="span">Biggest</span> Turf Cricket Tournament is Here!
           
          </h3>
          <div className="d-flex justify-content-center">
            <p data-aos="fade-right">
            Experience high-intensity turf battles, electrifying night matches, professional officiating, and championship-level competition — all packed into one thrilling tournament.
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
              <h3>Blackcaps Turf Cricket – Season 2</h3>

              <p>Madurai’s Biggest Turf Cricket Tournament is Here!</p>

             
              <div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="footer  py-2">
        <div className="container-fluid">
          <div className="d-flex  par justify-content-center align-items-center">
            {/* <div className="">
              <img src={logoDark} alt="logo" width="120px" />
            </div> */}
            <div className="">
              <h6>All Right Reserved © Copyright 2025</h6>

              <div class="sticky-icon">
                <a
                  href="https://www.instagram.com/chithirai.creations?igsh=ZG15MnZzbXU1bWZu"
                  class="Instagram"
                >
                  <i class="fab fa-instagram"></i> Instagram
                </a>

                {/* <a href="https://www.facebook.com/" class="Facebook">
      <i class="fab fa-facebook-f"></i> Facebook
   </a> */}

                <a href="https://wa.me/917010240042" class="Twitter">
                  <i class="fab fa-whatsapp"></i> Whatsapp
                </a>

                <a
                  href="https://youtube.com/@chithiraicreations?si=RyqEiTLtjW-MKKa4"
                  class="Youtube"
                >
                  <i class="fab fa-youtube"></i> Youtube
                </a>

                <a href="mailto:chithiraicreations@gmail.com" class="Google">
                  <i class="fab fa-google-plus-g"></i> Gmail
                </a>
              </div>
            </div>{" "}
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

