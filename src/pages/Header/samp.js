// import useState from "react-usestateref";
import React, { useEffect, useState } from "react";
import "./Header.css";
import AppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { Link } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import logo from "../../assets/logo_header.png";
import { RxCrossCircled } from "react-icons/rx";
import { FiMenu } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { IoCloseCircleOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

//
// const drawerWidth = 240;

const Header = () => {
    const [sideBar, setSideBar] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        password: "",
    });

    const [popup, Setpopup] = useState("signin");

    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePhoneChange = (value, country) => {
        setFormData((prevState) => ({
            ...prevState,
            phone: value,
        }));
    };

    const handleFocus = (fieldName) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };
    return (
        <>
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
                                        <Link to="/institution">Home</Link>
                                    </li>
                                    <li className="navbar_items">
                                        <Link>Features</Link>
                                    </li>

                                    <li className="navbar_items">
                                        <Link to={"/contact"}>Pricing</Link>
                                    </li>

                                    <li className="navbar_items">
                                        <Link to={"/contact"}>FAQ</Link>
                                    </li>
                                </ul>

                                <div className="header_btn_main">
                                    <button
                                        className=" blank_btn"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                    >
                                        Sign in
                                    </button>
                                    <button
                                        className="primary_btn "
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                    >
                                        Sign up
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
                            <div className="drawer_top">
                                <a href="/" className="mobile_logo_wrap">
                                    <img src={logo} alt="Assetly logo" />
                                </a>
                                <button
                                    onClick={() => setSideBar(false)}
                                    className="drawer_close_btn"
                                >
                                    <IoCloseCircleOutline />
                                </button>
                            </div>

                            <>
                                <ul className="drawer_menus">
                                    <li>
                                        <Link to="/dashboard">Home</Link>
                                    </li>
                                    <li>
                                        <Link to="/profile">Features</Link>
                                    </li>
                                    <li>
                                        <Link to="/market">Pricing</Link>
                                    </li>
                                    <li>
                                        <Link to="/portfolio">FAQ</Link>
                                    </li>
                                    <li>
                                        <button className="primary_btn  d-block">Sign in</button>
                                    </li>
                                    <li>
                                        <button className="primary_btn  d-block">
                                            <Link to={"/login"}>Sign up</Link>
                                        </button>
                                    </li>
                                </ul>
                            </>
                        </motion.div>

                        {/* Overlay */}
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

            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content wallet_modal_content d-flex flex-row p-0 overflow-hidden">
                        {/* LEFT SIDE */}
                        <div className="wallet_left d-flex flex-column justify-content-start align-items-start text-white">
                            <div className="p-5">
                                <h2>
                                    Invest with Confidence,
                                    <br />
                                    Trade with Ease!
                                </h2>
                                <p className="mt-3">
                                    Enjoy secure, seamless trading experiences with your preferred
                                    wallet.
                                </p>
                            </div>

                            <img
                                src={new URL("../../assets/login.png", import.meta.url)}
                                width="100%"
                                alt="mockup"
                                className="wallet_mockup "
                            />
                        </div>

                        {popup == "signin" ? (
                            <div className="wallet_right p-5 ">
                                <div className="wallet_modal_head">
                                    <div className="d-flex justify-content-end align-items-center">
                                        <RxCrossCircled
                                            className="close_icon"
                                            data-bs-dismiss="modal"
                                        />
                                    </div>
                                </div>

                                <div className="wallet_modal_body">
                                    <h4 className="text-center mb-4">Welcome Back</h4>
                                    <form onSubmit={handleSubmit}>
                                        {/* Email Field */}
                                        <div className="floating-label-group mb-4">
                                            <input
                                                type="email"
                                                className="floating-input"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("email")}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <label
                                                className={`floating-label ${formData.email || focusedField === "email"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                                htmlFor="email"
                                            >
                                                Email address
                                            </label>
                                        </div>

                                        {/* Phone Field */}
                                        <div className="floating-label-group mb-4 phone-input-container">
                                            <PhoneInput
                                                country={"in"}
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                onFocus={() => handleFocus("phone")}
                                                onBlur={handleBlur}
                                                inputClass="phone-input-custom"
                                                buttonClass="phone-button-custom"
                                                containerClass="phone-container-custom"
                                                placeholder=""
                                            />
                                            <label
                                                className={`floating-label phone-floating-label ${formData.phone || focusedField === "phone"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                            >
                                                Phone number
                                            </label>
                                        </div>

                                        {/* Password Field */}
                                        <div className="floating-label-group mb-4 password-input-container">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="floating-input password-input"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("password")}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <label
                                                className={`floating-label ${formData.password || focusedField === "password"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                                htmlFor="password"
                                            >
                                                Password
                                            </label>
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? (
                                                    <AiOutlineEyeInvisible className="eye-icon" />
                                                ) : (
                                                    <AiOutlineEye className="eye-icon" />
                                                )}
                                            </button>
                                        </div>

                                        {/* Sign In Button */}
                                        <div className="d-grid mb-3">
                                            <button type="submit" className="btn-primary">
                                                Sign In
                                            </button>
                                        </div>

                                        {/* Sign Up Link */}
                                        <div className="text-center">
                                            <p className="mb-0 signup-text">
                                                New to BLF Club?{" "}
                                                <a href="#" className="signup-link">
                                                    Sign Up
                                                </a>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : popup == "signup" ? (
                            <div className="wallet_right p-5 ">
                                <div className="wallet_modal_head">
                                    <div className="d-flex justify-content-end align-items-center">
                                        <RxCrossCircled
                                            className="close_icon"
                                            data-bs-dismiss="modal"
                                        />
                                    </div>
                                </div>

                                <div className="wallet_modal_body">
                                    <h4 className="text-center mb-4">Welcome to BLF Cub</h4>
                                    <form onSubmit={handleSubmit}>
                                        {/* Email Field */}
                                        <div className="floating-label-group mb-4 password-input-container">
                                            <input
                                                type="email"
                                                className="floating-input"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("email")}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <label
                                                className={`floating-label ${formData.email || focusedField === "email"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                                htmlFor="email"
                                            >
                                                Email address
                                            </label>

                                            <button
                                                type="button"
                                                className="password-toggle-btn verify"
                                            >
                                                verify
                                            </button>
                                        </div>

                                        {/* Phone Field */}
                                        <div className="floating-label-group mb-4 phone-input-container">
                                            <PhoneInput
                                                country={"in"}
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                onFocus={() => handleFocus("phone")}
                                                onBlur={handleBlur}
                                                inputClass="phone-input-custom"
                                                buttonClass="phone-button-custom"
                                                containerClass="phone-container-custom"
                                                placeholder=""
                                            />
                                            <label
                                                className={`floating-label phone-floating-label ${formData.phone || focusedField === "phone"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                            >
                                                Phone number
                                            </label>
                                            <button
                                                type="button"
                                                className="password-toggle-btn verify"
                                            >
                                                verify
                                            </button>
                                        </div>

                                        {/* Password Field */}
                                        <div className="floating-label-group mb-4 password-input-container">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="floating-input password-input"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("password")}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <label
                                                className={`floating-label ${formData.password || focusedField === "password"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                                htmlFor="password"
                                            >
                                                Password
                                            </label>
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? (
                                                    <AiOutlineEyeInvisible className="eye-icon" />
                                                ) : (
                                                    <AiOutlineEye className="eye-icon" />
                                                )}
                                            </button>
                                        </div>

                                        {/* Password Field */}
                                        <div className="floating-label-group mb-4 password-input-container">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="floating-input password-input"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("password")}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <label
                                                className={`floating-label ${formData.password || focusedField === "password"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                                htmlFor="password"
                                            >
                                                Confirm password
                                            </label>
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? (
                                                    <AiOutlineEyeInvisible className="eye-icon" />
                                                ) : (
                                                    <AiOutlineEye className="eye-icon" />
                                                )}
                                            </button>
                                        </div>

                                        <div className="onboard_check_wrap mb-3 d-flex gap-2">
                                            <div className="onb_check_wrapper">
                                                <input
                                                    type="checkbox"
                                                    id="check"
                                                    name="agreeToOffers"
                                                    className="onboard_checkbox"
                                                />
                                                <label
                                                    htmlFor="check"
                                                    className="custom_checkbox"
                                                ></label>
                                            </div>
                                            <label htmlFor="check" className="signup-text">
                                                I agree to the terms and conditions
                                            </label>
                                        </div>

                                        <div className="d-grid mb-3">
                                            <button type="submit" className="btn-primary">
                                                Sign Up
                                            </button>
                                        </div>

                                        {/* Sign Up Link */}
                                        <div className="text-center">
                                            <p className="mb-0 signup-text">
                                                Already have an account?{" "}
                                                <a href="#" className="signup-link">
                                                    Sign In
                                                </a>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : popup == "email-verify" ? (
                            <div className="wallet_right p-5 ">
                                <div className="wallet_modal_head">
                                    <div className="d-flex gap-1 justify-content-start align-items-center">
                                        <MdKeyboardBackspace
                                            className="close_icon back"
                                            data-bs-dismiss="modal"
                                        />
                                        <h5>Back</h5>
                                    </div>
                                </div>

                                <div className="wallet_modal_body">
                                    <h4 className="text-center mt-3 mb-4">Email Verification</h4>
                                    <h6>
                                        Enter the 6-digit OTP sent to your email to verify your
                                        account.
                                    </h6>

                                    <form onSubmit={handleSubmit}>
                                        {/* Email Field */}
                                        <div className="floating-label-group mb-4">
                                            <input
                                                type="email"
                                                className="floating-input"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("email")}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <label
                                                className={`floating-label ${formData.email || focusedField === "email"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                                htmlFor="email"
                                            >
                                                OTP
                                            </label>
                                        </div>

                                        {/* Sign In Button */}
                                        <div className="d-grid mb-3">
                                            <button type="submit" className="btn-primary">
                                                Verify
                                            </button>
                                        </div>

                                        {/* Sign Up Link */}
                                        <div className="text-center">
                                            <p className="mb-0 signup-text">
                                                Didn’t receive an OTP?{" "}
                                                <a href="#" className="signup-link">
                                                    Click to Resend
                                                </a>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : popup == "phone-verify" ? (
                            <div className="wallet_right p-5 ">
                                <div className="wallet_modal_head">
                                    <div className="d-flex gap-1 justify-content-start align-items-center">
                                        <MdKeyboardBackspace
                                            className="close_icon back"
                                            data-bs-dismiss="modal"
                                        />
                                        <h5>Back</h5>
                                    </div>
                                </div>

                                <div className="wallet_modal_body">
                                    <h4 className="text-center mt-3 mb-4">
                                        Phone no. Verification
                                    </h4>
                                    <h6>
                                        Enter the 6-digit OTP sent to your email to verify your
                                        account.
                                    </h6>

                                    <form onSubmit={handleSubmit}>
                                        {/* Email Field */}
                                        <div className="floating-label-group mb-4">
                                            <input
                                                type="email"
                                                className="floating-input"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("email")}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <label
                                                className={`floating-label ${formData.email || focusedField === "email"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                                htmlFor="email"
                                            >
                                                OTP
                                            </label>
                                        </div>

                                        {/* Sign In Button */}
                                        <div className="d-grid mb-3">
                                            <button type="submit" className="btn-primary">
                                                Verify
                                            </button>
                                        </div>

                                        {/* Sign Up Link */}
                                        <div className="text-center">
                                            <p className="mb-0 signup-text">
                                                Didn’t receive an OTP?{" "}
                                                <a href="#" className="signup-link">
                                                    Click to Resend
                                                </a>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : popup == "forgot" ? (
                            <div className="wallet_right p-5 ">
                                <div className="wallet_modal_head">
                                    <div className="d-flex gap-1 justify-content-start align-items-center">
                                        <MdKeyboardBackspace
                                            className="close_icon back"
                                            data-bs-dismiss="modal"
                                        />
                                        <h5>Back</h5>
                                    </div>
                                </div>

                                <div className="wallet_modal_body">
                                    <h4 className="text-center mt-3 mb-4">Forgot Password</h4>
                                    <h6>
                                        Enter your registered email address and we’ll send you a
                                        6-digit verification code to reset your password.
                                    </h6>

                                    <form onSubmit={handleSubmit}>
                                        {/* Email Field */}
                                        <div className="floating-label-group mb-4">
                                            <input
                                                type="email"
                                                className="floating-input"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("email")}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <label
                                                className={`floating-label ${formData.email || focusedField === "email"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                                htmlFor="email"
                                            >
                                                Email Address
                                            </label>
                                        </div>

                                        {/* Sign In Button */}
                                        <div className="d-grid mb-3">
                                            <button type="submit" className="btn-primary">
                                                Submit
                                            </button>
                                        </div>

                                        {/* Sign Up Link */}
                                    </form>
                                </div>
                            </div>
                        ) : popup == "forgototp" ? (
                            <div className="wallet_right p-5 ">
                                <div className="wallet_modal_head">
                                    <div className="d-flex gap-1 justify-content-start align-items-center">
                                        <MdKeyboardBackspace
                                            className="close_icon back"
                                            data-bs-dismiss="modal"
                                        />
                                        <h5>Back</h5>
                                    </div>
                                </div>

                                <div className="wallet_modal_body">
                                    <h4 className="text-center mt-3 mb-4">Verify Your Email</h4>
                                    <h6>
                                        Enter the 6-digit OTP sent to your email to verify your
                                        identity.
                                    </h6>

                                    <form onSubmit={handleSubmit}>
                                        {/* Email Field */}
                                        <div className="floating-label-group mb-4">
                                            <input
                                                type="email"
                                                className="floating-input"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("email")}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <label
                                                className={`floating-label ${formData.email || focusedField === "email"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                                htmlFor="email"
                                            >
                                                OTP
                                            </label>
                                        </div>

                                        {/* Sign In Button */}
                                        <div className="d-grid mb-3">
                                            <button type="submit" className="btn-primary">
                                                Verify
                                            </button>
                                        </div>

                                        {/* Sign Up Link */}
                                        <div className="text-center">
                                            <p className="mb-0 signup-text">
                                                Didn’t receive an OTP?{" "}
                                                <a href="#" className="signup-link">
                                                    Click to Resend
                                                </a>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : popup == "reset" ? (
                            <div className="wallet_right p-5 ">
                                <div className="wallet_modal_head">
                                    <div className="d-flex gap-1 justify-content-start align-items-center">
                                        <MdKeyboardBackspace
                                            className="close_icon back"
                                            data-bs-dismiss="modal"
                                        />
                                        <h5>Back</h5>
                                    </div>
                                </div>

                                <div className="wallet_modal_body">
                                    <h4 className="text-center mt-3 mb-4">Reset Password</h4>
                                    <h6>Enter your new password below to secure your account.</h6>

                                    <form onSubmit={handleSubmit}>
                                        <div className="floating-label-group mb-4 password-input-container">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="floating-input password-input"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("password")}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <label
                                                className={`floating-label ${formData.password || focusedField === "password"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                                htmlFor="password"
                                            >
                                                Password
                                            </label>
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? (
                                                    <AiOutlineEyeInvisible className="eye-icon" />
                                                ) : (
                                                    <AiOutlineEye className="eye-icon" />
                                                )}
                                            </button>
                                        </div>

                                        <div className="floating-label-group mb-4 password-input-container">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="floating-input password-input"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("password")}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <label
                                                className={`floating-label ${formData.password || focusedField === "password"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                                htmlFor="password"
                                            >
                                                Confirm password
                                            </label>
                                            <button
                                                type="button"
                                                className="password-toggle-btn"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? (
                                                    <AiOutlineEyeInvisible className="eye-icon" />
                                                ) : (
                                                    <AiOutlineEye className="eye-icon" />
                                                )}
                                            </button>
                                        </div>

                                        <div className="d-grid mb-3">
                                            <button type="submit" className="btn-primary">
                                                Verify
                                            </button>
                                        </div>

                                        {/* Sign Up Link */}
                                    </form>
                                </div>
                            </div>
                        ) : popup == "tfa" ? (
                            <div className="wallet_right p-5 ">
                                <div className="wallet_modal_head">
                                    <div className="d-flex gap-1 justify-content-start align-items-center">
                                        <MdKeyboardBackspace
                                            className="close_icon back"
                                            data-bs-dismiss="modal"
                                        />
                                        <h5>Back</h5>
                                    </div>
                                </div>

                                <div className="wallet_modal_body">
                                    <h4 className="text-center mt-3 mb-4">
                                        Two-Factor Authentication
                                    </h4>
                                    <h6>
                                        Enter the 6-digit verification code from your authenticator
                                        app to complete your login.
                                    </h6>

                                    <form onSubmit={handleSubmit}>
                                        {/* Email Field */}
                                        <div className="floating-label-group mb-4">
                                            <input
                                                type="email"
                                                className="floating-input"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => handleFocus("email")}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <label
                                                className={`floating-label ${formData.email || focusedField === "email"
                                                    ? "label-active"
                                                    : ""
                                                    }`}
                                                htmlFor="email"
                                            >
                                                OTP
                                            </label>
                                        </div>

                                        <div className="d-grid mb-3">
                                            <button type="submit" className="btn-primary">
                                                Verify
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
