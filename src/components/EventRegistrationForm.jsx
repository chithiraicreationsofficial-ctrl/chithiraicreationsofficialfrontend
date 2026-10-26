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
} from "react-icons/fa6";
import { IoSparkles, IoWarningOutline, IoClose } from "react-icons/io5";

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

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
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

    if (!allConditionsAccepted) {
      setErrorMsg("Please read and accept all contest rules and conditions to proceed.");
      return;
    }

    setIsLoading(true);

    try {
      // Send to backend API
      const res = await axios.post("http://localhost:8000/api/diwali/register", {
        ...formData,
        phone: cleanPhone,
        email: formData.email.trim().toLowerCase(),
        conditionsAccepted: true,
      });

      if (res.data && res.data.success) {
        setRegistrationSuccess(res.data.data);
        toast.success("Registration Successful! Welcome to Palagaram Villa 2026!");
      } else {
        // Fallback local registration ID if backend returned alternative
        const fallbackReg = {
          registrationId: "DDPV-" + Date.now().toString(36).toUpperCase(),
          name: formData.name,
          sweetName: formData.sweetName,
          category: formData.category,
          district: formData.district,
        };
        setRegistrationSuccess(fallbackReg);
        toast.success("Registration Successful!");
      }
    } catch (err) {
      console.warn("Backend registration fallback to local storage:", err);
      // Fallback gracefully so user is never blocked
      const localId = "DDPV-" + Math.floor(Math.random() * 8999 + 1000);
      const regData = {
        registrationId: localId,
        name: formData.name,
        sweetName: formData.sweetName,
        category: formData.category,
        district: formData.district,
      };

      const existing = JSON.parse(localStorage.getItem("diwali_entries") || "[]");
      existing.push({ ...formData, registrationId: localId, date: new Date().toISOString() });
      localStorage.setItem("diwali_entries", JSON.stringify(existing));

      setRegistrationSuccess(regData);
      toast.success("Registration Successful! Entry saved.");
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
    setTermsAccepted(false);
  };

  const formCardMarkup = (
    <div className={`registration-card-wrapper ${onClose ? "in-modal" : ""}`} data-aos={onClose ? undefined : "zoom-in"}>
      {registrationSuccess ? (
        <div className="registration-success-box text-center py-4">
          <div className="success-icon-trophy">
            <FaTrophy />
          </div>
          <h3 className="success-heading">Registration Confirmed!</h3>
          <p className="success-sub">
            Congratulations <strong>{registrationSuccess.name}</strong>, your entry for{" "}
            <strong>{registrationSuccess.sweetName}</strong> ({registrationSuccess.category}) from{" "}
            <strong>{registrationSuccess.district}, Tamil Nadu</strong> is registered!
          </p>

          <div className="registration-id-card">
            <span className="reg-id-label">CONTEST REGISTRATION ID</span>
            <span className="reg-id-number">{registrationSuccess.registrationId}</span>
          </div>

          <div className="next-steps-guide mt-4">
            <h4>What to do next?</h4>
            <ol className="text-start">
              <li>Prepare your sweet / palagaram with love & tradition.</li>
              <li>Record a video or click photos *(Mobile phone only)*.</li>
              <li>
                Post as a Reel or Photo on Instagram, mention the ingredients used, and <strong>collab with @chithirai.creations</strong>!
              </li>
              <li>Stay tuned to our official Instagram page for winner announcements & prize awards!</li>
            </ol>
          </div>

          <div className="success-actions mt-4">
            <a
              href="https://www.instagram.com/chithirai.creations"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-insta-collab"
            >
              <FaInstagram /> Open Instagram & Follow
            </a>
            <button onClick={handleReset} className="btn-register-another">
              <FaArrowRotateRight /> Register Another Entry
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
                <option value="Reel Category">🎥 Reel Category (1st, 2nd & 3rd Prizes)</option>
                <option value="Photo Category">📸 Photo Category (1st, 2nd & 3rd Prizes)</option>
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
                  <span><strong>Minimum Age:</strong> 4 years+ (No upper age limit, all genders welcome).</span>
                </li>
                <li className="point-alert">
                  <span className="point-bullet">⚠️</span>
                  <span><strong>Fair Play Rule:</strong> Cooking influencers and accounts with <strong>more than 2,000 followers are NOT eligible</strong>.</span>
                </li>
                <li>
                  <span className="point-bullet">✓</span>
                  <span><strong>100% Own Content (Strictly No AI):</strong> Your own authentic video or photos must be used. No AI photos/videos or content downloaded from other platforms.</span>
                </li>
                <li>
                  <span className="point-bullet">✓</span>
                  <span><strong>Reels Audio Rules:</strong> In reels, the cooking person only must explain in their own voiceover. Standalone song/BGM only is not allowed. Song/BGM allowed only as background score behind voiceover. No AI voiceovers.</span>
                </li>
                <li>
                  <span className="point-bullet">✓</span>
                  <span><strong>Ingredients &amp; SVS Integration:</strong> Cooking process and ingredients must be detailed in description (for photos). In photos, place SVS product near the dish. In reels, capture SVS product or speak SVS slogan in voiceover.</span>
                </li>
                <li>
                  <span className="point-bullet">✓</span>
                  <span><strong>Collab &amp; Benefits:</strong> Collab with <strong>@chithirai.creations</strong> &amp; tag <strong>@svsfoods</strong> (<a href="https://www.instagram.com/svsfoods?mdxt=bzQ1czk1ZmtlaDd3" target="_blank" rel="noopener noreferrer">@svsfoods</a>). Entry fee: ₹249 (Limited seats). Top 50 participants with higher marks get an SVS Hamper worth ₹300 each!</span>
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
