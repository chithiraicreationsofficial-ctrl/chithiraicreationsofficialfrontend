import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./EventRegistrationForm.css";
import DiyaIcon from "./DiyaIcon";
import {
  FaInstagram,
  FaTrophy,
  FaShieldHalved,
  FaCalendarDays,
  FaArrowRotateRight,
  FaUpload,
  FaCopy,
  FaCheck,
  FaTrash,
  FaFileInvoiceDollar,
} from "react-icons/fa6";
import { IoSparkles, IoWarningOutline, IoClose, IoCheckmarkCircle } from "react-icons/io5";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// All 38 Districts of Tamil Nadu
const TN_DISTRICTS = [
  "Madurai",
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kanchipuram",
  "Kanyakumari",
  "Karur",
  "Krishnagiri",
  "Mayiladuthurai",
  "Nagapattinam",
  "Namakkal",
  "Nilgiris",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "Theni",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Tiruvarur",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",
];

export default function EventRegistrationForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Female",
    state: "Tamil Nadu",
    district: "Madurai",
    instagramProfile: "",
    phone: "",
    email: "",
    sweetName: "",
    category: "Reel Category",
    ingredients: "",
  });

  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    setPaymentScreenshot(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrorMsg("");
  };

  const handleRemoveScreenshot = () => {
    setPaymentScreenshot(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleCopyUPI = (upiId) => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    toast.info(`UPI ID copied: ${upiId}`);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const allConditionsAccepted = termsAccepted;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!formData.age || Number(formData.age) < 4) {
      setErrorMsg("Minimum age required to participate is 4 years+.");
      return;
    }

    if (!formData.instagramProfile.trim()) {
      setErrorMsg("Please enter your Instagram profile link or handle.");
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (!formData.sweetName.trim()) {
      setErrorMsg("Please specify the sweet or palagaram you will showcase.");
      return;
    }

    if (!paymentScreenshot) {
      setErrorMsg("Please upload your payment screenshot (proof of ₹249 entry fee payment).");
      return;
    }

    if (!allConditionsAccepted) {
      setErrorMsg("Please read and accept all contest rules and conditions to proceed.");
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("age", formData.age);
      data.append("gender", formData.gender);
      data.append("state", formData.state || "Tamil Nadu");
      data.append("district", formData.district);
      data.append("instagramProfile", formData.instagramProfile.trim());
      data.append("phone", cleanPhone);
      data.append("email", formData.email.trim().toLowerCase());
      data.append("sweetName", formData.sweetName.trim());
      data.append("category", formData.category);
      data.append("ingredients", formData.ingredients.trim());
      data.append("conditionsAccepted", "true");
      data.append("paymentScreenshot", paymentScreenshot);

      const res = await axios.post(`${API_BASE_URL}/diwali/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.success) {
        setRegistrationSuccess(res.data.data);
        toast.success("Registration submitted! Admin will verify and email your token.");
      } else {
        throw new Error(res.data?.message || "Registration failed.");
      }
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please check your information and try again.";
      setErrorMsg(serverMessage);
      toast.error(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRegistrationSuccess(null);
    setFormData({
      name: "",
      age: "",
      gender: "Female",
      state: "Tamil Nadu",
      district: "Madurai",
      instagramProfile: "",
      phone: "",
      email: "",
      sweetName: "",
      category: "Reel Category",
      ingredients: "",
    });
    handleRemoveScreenshot();
    setTermsAccepted(false);
    setErrorMsg("");
  };

  const formCardMarkup = (
    <div className={`registration-card-wrapper ${onClose ? "in-modal" : ""}`} data-aos={onClose ? undefined : "zoom-in"}>
      {registrationSuccess ? (
        <div className="registration-success-box text-center py-4">
          <div className="success-icon-trophy">
            <FaTrophy />
          </div>
          <div className="success-status-badge pending-badge">
            ⏳ Verification Pending
          </div>
          <h3 className="success-heading">Registration Submitted!</h3>
          <p className="success-sub">
            Thank you <strong>{registrationSuccess.name}</strong>! Your registration for{" "}
            <strong>{registrationSuccess.sweet_name || registrationSuccess.sweetName}</strong> ({registrationSuccess.category}) from{" "}
            <strong>{registrationSuccess.district}, Tamil Nadu</strong> has been submitted with your payment proof.
          </p>

          <div className="registration-id-card">
            <span className="reg-id-label">TEMPORARY REGISTRATION ID</span>
            <span className="reg-id-number">{registrationSuccess.registration_id || registrationSuccess.registrationId}</span>
          </div>

          <div className="verification-token-notice mt-3 p-3">
            <div className="notice-icon-title">
              <IoCheckmarkCircle className="text-warning fs-5" />
              <strong>Official Token Will Be Emailed:</strong>
            </div>
            <p className="mb-0 mt-1">
              Our admin will review your payment screenshot. Once approved, your <strong>Official Verification Token (e.g. DDPVREG01)</strong> will be emailed directly to:
              <br />
              <span className="user-email-highlight">{registrationSuccess.email || formData.email}</span>
            </p>
          </div>

          <div className="next-steps-guide mt-4">
            <h4>What to do next?</h4>
            <ol className="text-start">
              <li>Prepare your sweet / palagaram with love &amp; tradition.</li>
              <li>Record a video (90 sec) or click 5 photos *(Mobile phone only)* in the specified order.</li>
              <li>Post as a Reel or Photo on Instagram, mention ingredients used &amp; SVS product/slogan.</li>
              <li><strong>Collab with BOTH @chithirai.creations and @svsfoods!</strong></li>
              <li>Check your email inbox for your official token code (e.g. DDPVREG01).</li>
            </ol>
          </div>

          <div className="success-actions mt-4">
            <a
              href="https://www.instagram.com/chithirai.creations"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-insta-collab"
            >
              <FaInstagram /> Open Instagram &amp; Follow @chithirai.creations
            </a>
            <button onClick={handleReset} className="btn-register-another">
              <FaArrowRotateRight /> Register Another Participant
            </button>
            {onClose && (
              <button onClick={onClose} className="btn-close-modal-done">
                Close
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="diwali-registration-form">
          {/* Symmetrical Clean Festive Header with Close Button */}
          <div className="form-festive-header">
            <div className="form-header-title-wrap">
              <DiyaIcon size={26} />
              <div className="form-header-text">
                <h3 className="form-modal-title">DIGITAL DIWALI PALAGARAM VILLA 2026</h3>
                <span className="form-header-subtitle">Contest Registration • State: Tamil Nadu</span>
              </div>
            </div>
            {onClose && (
              <button
                type="button"
                className="form-modal-close-btn"
                onClick={onClose}
                aria-label="Close Registration Modal"
              >
                <IoClose size={22} />
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="form-error-alert">
              <IoWarningOutline className="alert-icon" /> {errorMsg}
            </div>
          )}

          {/* Form Grid: Perfectly Aligned Symmetrical 2-Column Responsive Layout */}
          <div className="row g-3 g-md-4">
            {/* Row 1: Full Name & Age */}
            <div className="col-12 col-md-6">
              <label htmlFor="reg-name" className="form-label-custom">
                Full Name <span className="req-star">*</span>
              </label>
              <input
                type="text"
                id="reg-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="form-control-custom"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="reg-age" className="form-label-custom">
                Age (Years) <span className="req-star">*</span>
              </label>
              <input
                type="number"
                id="reg-age"
                name="age"
                min="4"
                max="110"
                value={formData.age}
                onChange={handleChange}
                placeholder="Min 4+ years"
                className="form-control-custom"
                required
              />
            </div>

            {/* Row 2: Gender & State */}
            <div className="col-12 col-md-6">
              <label htmlFor="reg-gender" className="form-label-custom">
                Gender <span className="req-star">*</span>
              </label>
              <select
                id="reg-gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-control-custom"
                required
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="reg-state" className="form-label-custom">
                State <span className="req-star">*</span>
              </label>
              <input
                type="text"
                id="reg-state"
                name="state"
                value={formData.state}
                readOnly
                className="form-control-custom readonly-field"
              />
            </div>

            {/* Row 3: Tamil Nadu District & WhatsApp Phone Number */}
            <div className="col-12 col-md-6">
              <label htmlFor="reg-district" className="form-label-custom">
                Tamil Nadu District <span className="req-star">*</span>
              </label>
              <select
                id="reg-district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="form-control-custom"
                required
              >
                {TN_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="reg-phone" className="form-label-custom">
                WhatsApp Phone Number <span className="req-star">*</span>
              </label>
              <input
                type="tel"
                id="reg-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="form-control-custom"
                required
              />
            </div>

            {/* Row 4: Instagram & Email Address */}
            <div className="col-12 col-md-6">
              <label htmlFor="reg-insta" className="form-label-custom">
                Instagram Profile Link or Handle <span className="req-star">*</span>
                <span className="label-subnote">(&lt; 2K followers)</span>
              </label>
              <div className="input-with-icon-wrap">
                <FaInstagram className="field-prefix-icon" />
                <input
                  type="text"
                  id="reg-insta"
                  name="instagramProfile"
                  value={formData.instagramProfile}
                  onChange={handleChange}
                  placeholder="@your_instagram_handle"
                  className="form-control-custom with-icon"
                  required
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="reg-email" className="form-label-custom">
                Email Address <span className="req-star">*</span>
              </label>
              <input
                type="email"
                id="reg-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="form-control-custom"
                required
              />
            </div>

            {/* Row 5: Sweet / Palagaram Name & Contest Category */}
            <div className="col-12 col-md-6">
              <label htmlFor="reg-sweet" className="form-label-custom">
                Sweet / Palagaram Name <span className="req-star">*</span>
              </label>
              <input
                type="text"
                id="reg-sweet"
                name="sweetName"
                value={formData.sweetName}
                onChange={handleChange}
                placeholder="e.g. Traditional Ghee Mysore Pak, Athirasam, Laddu..."
                className="form-control-custom"
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="reg-category" className="form-label-custom">
                Contest Category <span className="req-star">*</span>
              </label>
              <select
                id="reg-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control-custom"
                required
              >
                <option value="Reel Category">🎥 Reel Category (Winner, First Runner-up, Second Runner-up)</option>
                <option value="Photo Category">📸 Photo Category (Winner, First Runner-up, Second Runner-up)</option>
              </select>
            </div>

            {/* Row 6: Ingredients & Process (Full Width) */}
            <div className="col-12">
              <label htmlFor="reg-ingredients" className="form-label-custom">
                Ingredients &amp; Brief Process Used
              </label>
              <textarea
                id="reg-ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows="3"
                placeholder="List the key ingredients and brief preparation method..."
                className="form-control-custom textarea-custom"
              ></textarea>
            </div>

            {/* Row 7: Entry Fee Payment & Screenshot Upload (Full Width) */}
            <div className="col-12">
              <div className="payment-upload-card">
                <div className="payment-card-header">
                  <div className="payment-title-wrap">
                    <FaFileInvoiceDollar className="payment-gold-icon" />
                    <div>
                      <h4 className="payment-main-title">Contest Entry Fee: ₹249 (Limited Seats)</h4>
                      <p className="payment-sub-text">Pay ₹249 via any UPI app &amp; upload proof below</p>
                    </div>
                  </div>
                  <span className="payment-badge-mandatory">Mandatory Step</span>
                </div>

                <div className="payment-card-body">
                  <div className="upi-info-container">
                    <div className="upi-step-label">
                      <strong>Step 1:</strong> Pay ₹249 to the official UPI ID via GPay / PhonePe / Paytm / BHIM:
                    </div>
                    <div className="upi-box-interactive">
                      <div className="upi-details-left">
                        <span className="upi-label-small">UPI ID</span>
                        <code className="upi-id-highlight">7010240042@upi</code>
                        <span className="upi-payee-note">Payee: Chithirai Creations</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyUPI("7010240042@upi")}
                        className={`btn-upi-copy ${copiedUpi ? "copied" : ""}`}
                      >
                        {copiedUpi ? (
                          <>
                            <FaCheck /> Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy /> Copy UPI ID
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="screenshot-upload-container mt-3">
                    <label className="screenshot-label">
                      <strong>Step 2:</strong> Upload Payment Screenshot / Transaction Proof <span className="req-star">*</span>
                    </label>

                    {!previewUrl ? (
                      <label htmlFor="reg-payment-screenshot" className="upload-dropzone-box">
                        <input
                          type="file"
                          id="reg-payment-screenshot"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          onChange={handleFileChange}
                          className="d-none"
                        />
                        <div className="dropzone-content">
                          <div className="dropzone-icon-circle">
                            <FaUpload />
                          </div>
                          <span className="dropzone-prompt">
                            <strong>Click or tap to upload payment screenshot</strong>
                          </span>
                          <span className="dropzone-hints">Supports JPG, PNG, WEBP (Max 10MB)</span>
                        </div>
                      </label>
                    ) : (
                      <div className="screenshot-preview-wrapper">
                        <div className="preview-img-box">
                          <img src={previewUrl} alt="Payment Proof Preview" className="uploaded-proof-img" />
                        </div>
                        <div className="preview-info-box">
                          <div className="preview-header-line">
                            <IoCheckmarkCircle className="check-proof-icon" />
                            <strong>Payment Proof Selected</strong>
                          </div>
                          <span className="preview-filename">{paymentScreenshot?.name}</span>
                          <span className="preview-filesize">
                            {(paymentScreenshot?.size / (1024 * 1024)).toFixed(2)} MB • Ready for submission
                          </span>
                          <button
                            type="button"
                            onClick={handleRemoveScreenshot}
                            className="btn-remove-proof"
                          >
                            <FaTrash /> Remove &amp; Choose Another
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              MANDATORY CONDITIONS & SINGLE CHECKBOX ACCEPTANCE
             ======================================================== */}
          <div className="contest-conditions-checklist mt-4">
            <div className="conditions-header-pill">
              <FaShieldHalved /> Contest Rules, Eligibility &amp; Conditions
            </div>

            <div className="contest-rules-summary-box mt-3">
              <ul className="rules-summary-points">
                <li>
                  <span className="point-bullet">✓</span>
                  <span><strong>How to Participate:</strong> Make ONE unique Diwali sweet or snack yourself.</span>
                </li>
                <li>
                  <span className="point-bullet">✓</span>
                  <span><strong>Reel (90s) &amp; 5 Photos Order:</strong> Record a Reel (90 sec, you in it) and click 5 Photos, all taken by you on a mobile, in this order: <em>Ingredients → Making → SVS product in use → Dish → Final dish with you</em>.</span>
                </li>
                <li>
                  <span className="point-bullet">✓</span>
                  <span><strong>Ingredients &amp; Procedure:</strong> Photo: write all ingredients and the cooking procedure in the description. Reel: explain all ingredients and full procedure in video, in your own voice, at every step. (No standalone songs/BGM only, no AI voices).</span>
                </li>
                <li>
                  <span className="point-bullet">✓</span>
                  <span><strong>MAIN POINT: SVS Product (Choose 1):</strong> Option 1: Use SVS product in your photo or video. OR Option 2: Mention SVS slogan in description (Photo) or speak in video (Reel).</span>
                </li>
                <li>
                  <span className="point-bullet">🤝</span>
                  <span><strong>Collab is a MUST:</strong> Collab with BOTH accounts: <strong>@chithirai.creations</strong> &amp; <a href="https://www.instagram.com/svsfoods?mdxt=bzQ1czk1ZmtlaDd3" target="_blank" rel="noopener noreferrer">@svsfoods</a>.</span>
                </li>
                <li>
                  <span className="point-bullet">✓</span>
                  <span><strong>Eligibility:</strong> Minimum age: 4 years+ (no upper age limit, all genders welcome). Submit ONE unique dish only. 100% own content (no AI, no downloads from YouTube, Pinterest, Google). Reel must be exactly 90s with you in the whole reel.</span>
                </li>
                <li className="point-alert">
                  <span className="point-bullet">❌</span>
                  <span><strong>Fair Play Rule:</strong> Cooking influencers are strictly <strong>NOT eligible</strong>. Accounts with <strong>more than 2,000 followers are also NOT eligible</strong>.</span>
                </li>
                <li>
                  <span className="point-bullet">📅</span>
                  <span><strong>Contest Dates &amp; Prizes:</strong> Upload between <strong>28 Oct and 09 Nov 2026</strong>. Entry fee: <strong>₹249 (limited seats)</strong>. Top 50 high scorers get a <strong>₹300 SVS Festive Gift Hamper Pack!</strong> Total prizes worth ₹1,00,000!</span>
                </li>
              </ul>

              {/* ONE SINGLE CHECKBOX */}
              <div className="single-checkbox-confirmation pt-3 mt-3">
                <label className="condition-checkbox-label master-terms-label">
                  <input
                    type="checkbox"
                    id="master-terms-checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      setErrorMsg("");
                    }}
                  />
                  <span className="condition-custom-box"></span>
                  <span className="condition-text master-agree-text">
                    <strong>I have read, understood, and accept all the contest rules, conditions, and eligibility criteria stated above.</strong>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn-submit-registration ${
                allConditionsAccepted ? "btn-active" : "btn-disabled-state"
              }`}
            >
              {isLoading ? (
                <span>Submitting Entry...</span>
              ) : (
                <>
                  <FaTrophy /> Submit Registration (₹249 • Limited Seats)
                </>
              )}
            </button>
            <div className="submit-subtext mt-2">
              Total Prizes Worth ₹1,00,000 (1 Lakh!) • Entry Fee: Just ₹249 • Top 50 Get ₹300 SVS Hampers • SVS Title Sponsor
            </div>
          </div>
        </form>
      )}
    </div>
  );

  if (onClose) {
    return formCardMarkup;
  }

  return (
    <section className="event-registration-section py-5" id="register">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <div className="registration-pill">
            <IoSparkles /> Official Contest Entry • Limited Seats
          </div>
          <h2 className="registration-main-heading">
            Event <span className="gold-shimmer-text">Registration</span>
          </h2>
          <p className="registration-lead-text">
            Digital Diwali Palagaram Villa • Total Prizes Worth ₹1,00,000 (1 Lakh!) • Entry Just ₹249 • Top 50 High Scorers Win ₹300 SVS Hampers!
          </p>
        </div>
        {formCardMarkup}
      </div>
    </section>
  );
}
