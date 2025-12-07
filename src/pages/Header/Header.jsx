
import React, { useEffect, useState } from "react";
import "./Header.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Link } from "react-router-dom";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import logo from "../../assets/logo_header.png";
import { FiMenu } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { IoCloseCircleOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import AboutModal from "./AboutModal";
import ContactModal from "./ContactModal";
import EventModal from "./EventModal";
import { toast } from "react-toastify";

import { authAPI, ticketAPI, paymentAPI } from "../../services/apiService";
import {
  loadRazorpay,
  initializeRazorpay,
} from "../../services/razorpayService";

const Header = () => {
  const [sideBar, setSideBar] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ticketCount: 1,
    otp: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [popup, setPopup] = useState("booking");
  const [focusedField, setFocusedField] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [availableTickets, setAvailableTickets] = useState(0);
  const [modalState, setModalState] = useState({
    about: false,
    contact: false,
    event: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const openModal = (modalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: false }));
  };

  // Check form validity whenever formData or errors change
  useEffect(() => {
    validateForm();
  }, [formData, formErrors, isEmailVerified, availableTickets]);

  useEffect(() => {
    checkTicketAvailability();
  }, []);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((timer) => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const checkTicketAvailability = async () => {
    try {
      const response = await ticketAPI.checkAvailability();
      if (response.data.success) {
        setTicketPrice(response.data.data.ticketPrice);
        setAvailableTickets(response.data.data.availableTickets);
      }
    } catch (error) {
      console.error("Failed to fetch ticket availability:", error);
    }
  };

  // Enhanced validation function
  const validateForm = () => {
    const isBookingValid = 
      formData.name.trim() &&
      formData.email &&
      formData.phone &&
      !formErrors.name &&
      !formErrors.email &&
      !formErrors.phone &&
      !formErrors.ticketCount;

    const isOTPValid = 
      formData.otp.length === 6 &&
      !formErrors.otp;

    if (popup === "booking") {
      if (!isEmailVerified) {
        // For booking popup before email verification
        const isValid = 
          formData.name.trim() &&
          formData.email &&
          formData.phone &&
          !formErrors.name &&
          !formErrors.email &&
          !formErrors.phone;
        setIsFormValid(isValid && availableTickets > 0);
      } else {
        // For booking popup after email verification
        const isValid = 
          formData.name.trim() &&
          formData.email &&
          formData.phone &&
          formData.ticketCount > 0 &&
          formData.ticketCount <= Math.min(10, availableTickets) &&
          !formErrors.name &&
          !formErrors.email &&
          !formErrors.phone &&
          !formErrors.ticketCount;
        setIsFormValid(isValid && availableTickets > 0);
      }
    } else if (popup === "otp-verify") {
      setIsFormValid(isOTPValid && otpTimer > 0);
    }
  };

  // Handle input change with improved validation
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let fieldValue = value;

    // Prevent leading spaces for text fields
    if (type !== "number" && value.startsWith(" ")) {
      return;
    }

    // Parse number fields
    if (type === "number") {
      const numValue = parseInt(value);
      if (isNaN(numValue)) fieldValue = "";
      else fieldValue = Math.max(1, Math.min(numValue, 10));
    }

    // For OTP field, only allow digits and limit to 6
    if (name === "otp") {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length > 6) return;
      fieldValue = digitsOnly;
    }

    // For name field, prevent special characters (allow only letters and spaces)
    if (name === "name") {
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      fieldValue = lettersOnly;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: fieldValue,
    }));

    // Immediate validation for touched fields
    if (touchedFields[name]) {
      validateField(name, fieldValue);
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      phone: value,
    }));

    if (touchedFields.phone) {
      validateField("phone", value);
    }
  };

  // Enhanced field validation
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address";
        } else if (value.length > 100) {
          error = "Email is too long";
        }
        break;
      
      case "phone":
        if (!value) {
          error = "Phone number is required";
        } else if (value.length < 10) {
          error = "Phone number must be at least 10 digits";
        } else if (value.length > 15) {
          error = "Phone number is too long";
        } else if (!/^[0-9+]+$/.test(value)) {
          error = "Phone number can only contain digits and +";
        }
        break;
      
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.length < 2) {
          error = "Name must be at least 2 characters";
        } else if (value.length > 50) {
          error = "Name is too long";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name can only contain letters and spaces";
        }
        break;
      
      case "ticketCount":
        if (!value || value < 1) {
          error = "At least 1 ticket is required";
        } else if (value > 10) {
          error = "Maximum 10 tickets per booking";
        } else if (value > availableTickets) {
          error = `Only ${availableTickets} tickets available`;
        }
        break;
      
      case "otp":
        if (!value) {
          error = "OTP is required";
        } else if (value.length !== 6) {
          error = "OTP must be exactly 6 digits";
        } else if (!/^\d+$/.test(value)) {
          error = "OTP can only contain digits";
        }
        break;
      
      default:
        break;
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return !error;
  };

  // Validate all fields at once
  const validateAllFields = () => {
    const fieldsToValidate = popup === "booking" 
      ? ["name", "email", "phone"]
      : ["otp"];
    
    let isValid = true;
    const newTouchedFields = { ...touchedFields };
    
    fieldsToValidate.forEach((field) => {
      newTouchedFields[field] = true;
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });
    
    setTouchedFields(newTouchedFields);
    return isValid;
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
    setFocusedField(null);
  };

  const handlePhoneBlur = () => {
    setTouchedFields((prev) => ({ ...prev, phone: true }));
    validateField("phone", formData.phone);
    setFocusedField(null);
  };

  // Reset form when modal closes
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      ticketCount: 1,
      otp: "",
    });
    setFormErrors({});
    setTouchedFields({});
    setIsEmailVerified(false);
    setPopup("booking");
    setFocusedField(null);
    setOtpTimer(0);
    setIsFormValid(false);
  };

  // Send OTP for email verification
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateAllFields()) {
      toast.error("Please fix the errors before proceeding", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.sendOTP(formData.email);
      if (response.data.success) {
        setOtpTimer(300); // 5 minutes in seconds
        setPopup("otp-verify");
        toast.success("OTP sent to your email successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      toast.error("Please enter a valid 6-digit OTP", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (otpTimer === 0) {
      toast.error("OTP has expired. Please request a new one.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.verifyOTP(
        formData.email,
        formData.otp,
        formData.name || "User"
      );
      if (response.data.success) {
        localStorage.setItem("authToken", response.data.data.token);
        localStorage.setItem("tokenExpiry", Date.now() + 3600000);
        setIsEmailVerified(true);
        setPopup("booking");
        setFormErrors({}); // Clear any OTP errors

        toast.success("Email verified successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (otpTimer > 0) {
      const minutes = Math.floor(otpTimer / 60);
      const seconds = otpTimer % 60;
      toast.info(`Please wait ${minutes}:${seconds.toString().padStart(2, '0')} before requesting a new OTP`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.resendOTP(formData.email);
      if (response.data.success) {
        setOtpTimer(300);
        toast.success("New OTP sent successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend OTP. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle ticket booking and payment
  const handleBookTickets = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      toast.error("Please fix the errors before booking", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!isEmailVerified) {
      toast.error("Please verify your email first", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (formData.ticketCount > availableTickets) {
      toast.error(`Only ${availableTickets} tickets available`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const orderResponse = await ticketAPI.createOrder(formData.ticketCount);

      if (!orderResponse.data.success) {
        throw new Error("Failed to create order");
      }

      const order = orderResponse.data.data;

      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) {
        throw new Error("Payment service is temporarily unavailable");
      }

      initializeRazorpay(
        order,
        formData,
        async (paymentResponse) => {
          try {
            const verifyResponse = await paymentAPI.verifyPayment(
              paymentResponse
            );

            if (verifyResponse.data.success) {
              toast.success(
                "Ticket booked successfully! Check your email for the QR code.",
                {
                  position: "top-right",
                  autoClose: 5000,
                }
              );
              
              // Close modal using Bootstrap
              const modal = document.getElementById('exampleModal');
              const modalInstance = bootstrap.Modal.getInstance(modal);
              if (modalInstance) {
                modalInstance.hide();
              }
              
              resetForm();
              checkTicketAvailability();
            }
          } catch (error) {
            toast.error(
              error.response?.data?.message || "Payment verification failed",
              {
                position: "top-right",
                autoClose: 3000,
              }
            );
          } finally {
            setIsLoading(false);
          }
        },
        (errorMessage) => {
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000,
          });
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.message || "Failed to process booking",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      setIsLoading(false);
    }
  };

  const hasError = (fieldName) => {
    return touchedFields[fieldName] && formErrors[fieldName];
  };

  const totalAmount = formData.ticketCount * ticketPrice;

  // Check if verify button should be enabled
  const canVerifyEmail = () => {
    return (
      formData.email &&
      !formErrors.email &&
      !isEmailVerified &&
      availableTickets > 0
    );
  };

  // Check if book/pay button should be enabled
  const canBookTickets = () => {
    return (
      isFormValid &&
      isEmailVerified &&
      !isLoading &&
      availableTickets > 0 &&
      formData.ticketCount <= availableTickets
    );
  };

  return (
    <div className="body">
      <div sx={{ display: "flex" }} className="header_wrp">
        <AppBar component="nav" className="header_nav">
          <Toolbar className="nav_toolbar">
            <div className="nav_main">
              <div className="nav_menus_wrp">
                <Link to={"/"} className="logo_img_div">
                  <img src={logo} alt="logo" />
                </Link>

                <ul className="navbar">
                  <li className="navbar_items">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="navbar_items">
                    <Link onClick={() => openModal("about")}>About</Link>
                  </li>
                  <li className="navbar_items">
                    <Link onClick={() => openModal("event")}>Events</Link>
                  </li>

                  <li className="navbar_items">
                    <Link onClick={() => openModal("contact")}>Contacts</Link>
                  </li>
                </ul>

                <div className="header_btn_main">
                  <button
                    className={`primary_btn ${availableTickets === 0 ? 'btn-disabled' : ''}`}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={resetForm}
                    disabled={availableTickets === 0}
                  >
                    {availableTickets === 0 ? 'Sold Out' : 'Book Ticket'}
                  </button>
                </div>
              </div>

              <div className="mobile_toggle">
                <button
                  className="mobile_toggle_btn"
                  onClick={() => setSideBar(true)}
                >
                  <FiMenu />
                </button>
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>

      {/* Sidebar Code remains same */}
      <AnimatePresence>
        {sideBar && (
          <>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="drawer_sidebar"
            >
                <div className="sidebar">
                <Link to={"/"} className="logo_img_div">
                  <img src={logo} alt="logo" />
                </Link>

                <ul className="">
                  <li className="navbar_items">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="navbar_items">
                    <Link onClick={() => openModal("about")}>About</Link>
                  </li>
                  <li className="navbar_items">
                    <Link onClick={() => openModal("event")}>Events</Link>
                  </li>

                  <li className="navbar_items">
                    <Link onClick={() => openModal("contact")}>Contacts</Link>
                  </li>
                </ul>

                <div className="header_btn_main">
                  <button
                    className={`primary_btn ${availableTickets === 0 ? 'btn-disabled' : ''}`}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={resetForm}
                    disabled={availableTickets === 0}
                  >
                    {availableTickets === 0 ? 'Sold Out' : 'Book Ticket'}
                  </button>
                </div>
              </div> 
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSideBar(false)}
              className="drawer_overlay"
            />
          </>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content wallet_modal_content d-flex flex-row p-0">
            {/* LEFT SIDE - Event Info */}
            <div className="wallet_left d-flex flex-column justify-content-between align-items-start text-white">
              <div className="pt-5 px-5 p-0">
                <h2>New Year Celebration 2025</h2>
                <p className="mt-3">
                  Join us for an unforgettable New Year's Eve party!
                </p>
                <div className="ticket-info mt-4">
                  {/* <p className={`${availableTickets === 0 ? 'text-danger' : ''}`}>
                    🎫 Available Tickets: {availableTickets}
                  </p> */}
                  <p>💰 Price per Ticket: ₹{ticketPrice}</p>
                  {formData.ticketCount > 0 && (
                    <p>💵 Total Amount: ₹{totalAmount}</p>
                  )}
                </div>
                {availableTickets === 0 && (
                  <div className="alert alert-danger mt-3">
                    <strong>Sold Out!</strong> All tickets have been booked.
                  </div>
                )}
              </div>
              <img
                src={new URL("../../assets/login.png", import.meta.url)}
                width="100%"
                alt="mockup"
                className="wallet_mockup"
              />
            </div>

            <div className="wallet_right p-5">
              <div className="wallet_modal_head">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5>
                    {popup === "booking" 
                      ? (isEmailVerified ? "Complete Your Booking" : "Book Your Tickets") 
                      : "Verify Your Email"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    onClick={resetForm}
                    disabled={isLoading}
                    aria-label="Close"
                  />
                </div>
              </div>

              <div className="wallet_modal_body">
                {popup === "booking" && (
                  <form
                    onSubmit={
                      isEmailVerified ? handleBookTickets : handleSendOTP
                    }
                  >
                    <div className="floating-label-group mb-4">
                      <input
                        type="text"
                        className={`floating-input ${
                          hasError("name") ? "error" : ""
                        } ${isLoading ? "input-disabled" : ""}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => handleFocus("name")}
                        onBlur={handleBlur}
                        disabled={isLoading || isEmailVerified}
                        maxLength="50"
                      />
                      <label
                        className={`floating-label ${
                          formData.name || focusedField === "name"
                            ? "label-active"
                            : ""
                        }`}
                        htmlFor="name"
                      >
                        Full Name *
                      </label>
                      {hasError("name") && (
                        <div className="error-message">{formErrors.name}</div>
                      )}
                    </div>

                    <div className="floating-label-group mb-4 phone-input-container">
                      <PhoneInput
                        country={"in"}
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onFocus={() => handleFocus("phone")}
                        onBlur={handlePhoneBlur}
                        inputClass={`phone-input-custom ${
                          hasError("phone") ? "error" : ""
                        } ${isLoading ? "input-disabled" : ""}`}
                        buttonClass="phone-button-custom"
                        containerClass="phone-container-custom"
                        disabled={isLoading || isEmailVerified}
                      />
                      <label
                        className={`floating-label phone-floating-label ${
                          formData.phone || focusedField === "phone"
                            ? "label-active"
                            : ""
                        }`}
                      >
                        Phone number *
                      </label>
                      {hasError("phone") && (
                        <div className="error-message">{formErrors.phone}</div>
                      )}
                    </div>

                    <div className="floating-label-group mb-4 password-input-container">
                      <input
                        type="email"
                        className={`floating-input ${
                          hasError("email") ? "error" : ""
                        } ${isEmailVerified ? "verified" : ""} ${
                          isLoading ? "input-disabled" : ""
                        }`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus("email")}
                        onBlur={handleBlur}
                        disabled={isEmailVerified || isLoading}
                        maxLength="100"
                      />
                      <label
                        className={`floating-label ${
                          formData.email || focusedField === "email"
                            ? "label-active"
                            : ""
                        }`}
                        htmlFor="email"
                      >
                        Email address *
                      </label>
                      <button
                        type="button"
                        className={`password-toggle-btn verify ${
                          isEmailVerified ? "verified" : ""
                        } ${!canVerifyEmail() ? "btn-disabled" : ""}`}
                        onClick={handleSendOTP}
                        disabled={!canVerifyEmail() || isLoading}
                        title={!canVerifyEmail() ? "Please enter a valid email" : ""}
                      >
                       
                      </button>
                      {hasError("email") && (
                        <div className="error-message">{formErrors.email}</div>
                      )}
                    
                    </div>

                    {isEmailVerified && (
                      <>
                        <div className="floating-label-group mb-4">
                          <input
                            type="number"
                            className={`floating-input ${
                              hasError("ticketCount") ? "error" : ""
                            } ${isLoading ? "input-disabled" : ""}`}
                            id="ticketCount"
                            name="ticketCount"
                            min="1"
                            max={Math.min(10, availableTickets)}
                            value={formData.ticketCount}
                            onChange={handleChange}
                            onFocus={() => handleFocus("ticketCount")}
                            onBlur={handleBlur}
                            disabled={isLoading || availableTickets === 0}
                          />
                          <label
                            className={`floating-label ${
                              formData.ticketCount ||
                              focusedField === "ticketCount"
                                ? "label-active"
                                : ""
                            }`}
                            htmlFor="ticketCount"
                          >
                            Number of Tickets (Max 10) *
                          </label>
                          {hasError("ticketCount") && (
                            <div className="error-message">
                              {formErrors.ticketCount}
                            </div>
                          )}
                          <div className="ticket-hint">
                            Maximum 10 tickets per booking
                          </div>
                        </div>

                        {formData.ticketCount > 0 && (
                          <div className="amount-summary mb-4 p-3 bg-light rounded">
                            <div className="d-flex justify-content-between mb-2">
                              <span>
                                Tickets ({formData.ticketCount} × ₹{ticketPrice})
                              </span>
                              <span>₹{totalAmount}</span>
                            </div>
                           
                            <hr className="my-2" />
                            <div className="d-flex justify-content-between fw-bold">
                              <span>Total Amount</span>
                              <span className="text-primary">₹{totalAmount}</span>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {availableTickets === 0 ? (
                      <div className="d-grid mb-3">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          disabled
                        >
                          Sold Out
                        </button>
                      </div>
                    ) : !isEmailVerified ? (
                      <div className="d-grid mb-3">
                        <button
                          type="submit"
                          className={`btn-primary ${!canVerifyEmail() ? 'btn-disabled' : ''}`}
                          disabled={!canVerifyEmail() || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Sending OTP...
                            </>
                          ) : (
                            "Verify Email to Continue"
                          )}
                        </button>
                        <div className="text-center mt-2 text-muted small">
                          You'll receive an OTP to verify your email
                        </div>
                      </div>
                    ) : (
                      <div className="d-grid mb-3">
                        <button
                          type="submit"
                          className={`btn-primary ${!canBookTickets() ? 'btn-disabled' : ''}`}
                          disabled={!canBookTickets()}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Processing...
                            </>
                          ) : (
                            `Pay ₹${totalAmount}`
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                )}

                {/* OTP Verification Popup */}
                {popup === "otp-verify" && (
                  <form onSubmit={handleVerifyOTP}>
                    <div className="text-center mb-4">
                      <h5>Verify Your Email</h5>
                      <p className="mb-1">
                        Enter the 6-digit OTP sent to
                      </p>
                      <p className="fw-bold text-primary">{formData.email}</p>
                      <p className="text-muted small">
                        OTP is valid for 5 minutes
                      </p>
                    </div>

                    <div className="floating-label-group mb-4">
                      <input
                        type="text"
                        className={`floating-input text-center ${
                          hasError("otp") ? "error" : ""
                        } ${isLoading ? "input-disabled" : ""}`}
                        id="otp"
                        name="otp"
                        maxLength="6"
                        value={formData.otp}
                        onChange={handleChange}
                        onFocus={() => handleFocus("otp")}
                        onBlur={handleBlur}
                        disabled={isLoading}
                        placeholder="000000"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                      />
                      <label
                        className="floating-label label-active"
                        htmlFor="otp"
                      >
                        6-digit OTP *
                      </label>
                      {hasError("otp") && (
                        <div className="error-message">{formErrors.otp}</div>
                      )}
                    </div>

                    <div className="text-center mb-4">
                      {otpTimer > 0 ? (
                        <div className="otp-timer">
                          <span className="badge bg-warning text-dark">
                            OTP expires in: {Math.floor(otpTimer / 60)}:
                            {(otpTimer % 60).toString().padStart(2, "0")}
                          </span>
                        </div>
                      ) : (
                        <div className="otp-expired">
                          <span className="badge bg-danger">
                            OTP expired
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="d-grid mb-3">
                      <button
                        type="submit"
                        className={`btn-primary ${!isFormValid ? 'btn-disabled' : ''}`}
                        disabled={!isFormValid || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Verifying...
                          </>
                        ) : (
                          "Verify OTP"
                        )}
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none me-3"
                        onClick={handleResendOTP}
                        disabled={isLoading || otpTimer > 0}
                      >
                        {otpTimer > 0 ? `Resend in ${Math.floor(otpTimer / 60)}:${(otpTimer % 60).toString().padStart(2, "0")}` : "Resend OTP"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={() => setPopup("booking")}
                        disabled={isLoading}
                      >
                        Back
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Modals */}
      <AboutModal
        isOpen={modalState.about}
        onClose={() => closeModal("about")}
      />

      <ContactModal
        isOpen={modalState.contact}
        onClose={() => closeModal("contact")}
      />

      <EventModal
        isOpen={modalState.event}
        onClose={() => closeModal("event")}
      />
    </div>
  );
};

export default Header;