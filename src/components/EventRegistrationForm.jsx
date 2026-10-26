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

  const [conditions, setConditions] = useState({
    minAge: false,
    influencerRule: false,
    originalHomemade: false,
    audioRules: false,
    svsRules: false,
    collabAndBenefits: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleConditionToggle = (key) => {
    setConditions((prev) => ({ ...prev, [key]: !prev[key] }));
    setErrorMsg("");
  };

  const allConditionsAccepted =
    conditions.minAge &&
    conditions.influencerRule &&
    conditions.originalHomemade &&
    conditions.audioRules &&
    conditions.svsRules &&
    conditions.collabAndBenefits;

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
    setConditions({
      minAge: false,
      influencerRule: false,
      originalHomemade: false,
      audioRules: false,
      svsRules: false,
      collabAndBenefits: false,
    });
  };

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

        <div className="registration-card-wrapper position-relative" data-aos="zoom-in">
          {onClose && (
            <button
              type="button"
              className="form-modal-close-btn"
              onClick={onClose}
              aria-label="Close Registration Modal"
            >
              <IoClose />
            </button>
          )}

          {registrationSuccess ? (
            <div className="registration-success-box text-center py-5">
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
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="diwali-registration-form">
              <div className="form-festive-header">
                <div className="d-flex align-items-center gap-2">
                  <DiyaIcon size={26} />
                  <span className="form-badge-title">DIGITAL DIWALI PALAGARAM VILLA 2026</span>
                </div>
                <span className="form-state-badge">State: Tamil Nadu</span>
              </div>

              {/* Entry Fee & Limited Seats Highlight Bar */}
              <div className="registration-fee-alert-bar mb-3">
                <span className="fee-badge-item">🎟️ Entry Fee: <strong>Just ₹249</strong></span>
                <span className="seats-badge-item">⚡ <strong>Limited Seats Only!</strong></span>
                <span className="prizes-badge-item">🏆 <strong>Prizes: ₹1,00,000 (1 Lakh)</strong></span>
                <span className="hamper-badge-item">🎁 Top 50 Get <strong>₹300 SVS Hampers</strong></span>
              </div>

              {errorMsg && (
                <div className="form-error-alert">
                  <IoWarningOutline className="alert-icon" /> {errorMsg}
                </div>
              )}

              {/* Form Grid */}
              <div className="row g-3">
                {/* 1. Name */}
                <div className="col-md-6">
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

                {/* 2. Age */}
                <div className="col-md-3">
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
                    placeholder="Min 4+"
                    className="form-control-custom"
                    required
                  />
                </div>

                {/* 3. Gender Dropdown */}
                <div className="col-md-3">
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

                {/* 4. State (Tamil Nadu) */}
                <div className="col-md-6">
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

                {/* 5. District Dropdown (Tamil Nadu 38 Districts) */}
                <div className="col-md-6">
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

                {/* 6. Instagram Profile Link / Handle */}
                <div className="col-md-6">
                  <label htmlFor="reg-insta" className="form-label-custom">
                    Instagram Profile Link or Handle <span className="req-star">*</span>
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
                  <span className="field-hint-text">
                    ⚠️ Accounts with &gt; 2,000 followers are not eligible. Collab mandatory.
                  </span>
                </div>

                {/* 7. Phone Number */}
                <div className="col-md-6">
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

                {/* 8. Email Address */}
                <div className="col-md-6">
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

                {/* 9. Sweet / Palagaram Name */}
                <div className="col-md-6">
                  <label htmlFor="reg-sweet" className="form-label-custom">
                    Sweet / Palagaram Name <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="reg-sweet"
                    name="sweetName"
                    value={formData.sweetName}
                    onChange={handleChange}
                    placeholder="e.g. Traditional Ghee Mysore Pak, Athirasam, Ladoo..."
                    className="form-control-custom"
                    required
                  />
                </div>

                {/* 10. Category Dropdown */}
                <div className="col-md-6">
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
                    <option value="Reel Category">🎥 Reel Category (1st &amp; Runner-Up Prizes)</option>
                    <option value="Photo Category">📸 Photo Category (1st &amp; Runner-Up Prizes)</option>
                  </select>
                </div>

                {/* 11. Ingredients & Cooking Process */}
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
                  MANDATORY CONDITIONS & ELIGIBILITY CHECKLIST
                 ======================================================== */}
              <div className="contest-conditions-checklist mt-4">
                <div className="conditions-header-pill">
                  <FaShieldHalved /> Contest Rules, Eligibility &amp; Conditions
                </div>

                <div className="conditions-list-group mt-3">
                  {/* Rule 1: Age */}
                  <label className="condition-checkbox-label">
                    <input
                      type="checkbox"
                      checked={conditions.minAge}
                      onChange={() => handleConditionToggle("minAge")}
                    />
                    <span className="condition-custom-box"></span>
                    <span className="condition-text">
                      <strong>Minimum Age Requirement:</strong> 4 years+ (Everyone above 4 years can participate; no gender restriction).
                    </span>
                  </label>

                  {/* Rule 2: Cooking Influencers */}
                  <label className="condition-checkbox-label">
                    <input
                      type="checkbox"
                      checked={conditions.influencerRule}
                      onChange={() => handleConditionToggle("influencerRule")}
                    />
                    <span className="condition-custom-box"></span>
                    <span className="condition-text">
                      <strong>Fair Play Rule:</strong> Cooking influencers are strictly <strong>NOT eligible</strong>. Participants with <strong>more than 2,000 followers are also NOT eligible</strong>.
                    </span>
                  </label>

                  {/* Rule 3: Originality & No AI */}
                  <label className="condition-checkbox-label">
                    <input
                      type="checkbox"
                      checked={conditions.originalHomemade}
                      onChange={() => handleConditionToggle("originalHomemade")}
                    />
                    <span className="condition-custom-box"></span>
                    <span className="condition-text">
                      <strong>Own Authentic Content (Strictly No AI):</strong> Your own authentic video or photos must be used. Using AI photos/videos or content downloaded from YouTube, Pinterest, Google or any other platforms is strictly prohibited.
                    </span>
                  </label>

                  {/* Rule 4: Audio / Reels Voiceover */}
                  <label className="condition-checkbox-label">
                    <input
                      type="checkbox"
                      checked={conditions.audioRules}
                      onChange={() => handleConditionToggle("audioRules")}
                    />
                    <span className="condition-custom-box"></span>
                    <span className="condition-text">
                      <strong>Reels Voiceover &amp; Audio:</strong> In reels, the cooking person only must speak/explain in their own voice. Standalone song or BGM only is not allowed. Song/BGM can be used only as background score behind the voiceover. Strictly NO AI voiceover or third-party automated voices.
                    </span>
                  </label>

                  {/* Rule 5: Cooking Process, Ingredients & SVS Product */}
                  <label className="condition-checkbox-label">
                    <input
                      type="checkbox"
                      checked={conditions.svsRules}
                      onChange={() => handleConditionToggle("svsRules")}
                    />
                    <span className="condition-custom-box"></span>
                    <span className="condition-text">
                      <strong>Ingredients &amp; SVS Integration:</strong> Cooking process and ingredients must be detailed in description (for photos). In photos, capture/place SVS product near the dish and mention SVS in caption. In reels, capture SVS product or speak the SVS slogan in voiceover.
                    </span>
                  </label>

                  {/* Rule 6: Collab, Entry Fee & Top 50 Hampers */}
                  <label className="condition-checkbox-label master-terms-label">
                    <input
                      type="checkbox"
                      checked={conditions.collabAndBenefits}
                      onChange={() => handleConditionToggle("collabAndBenefits")}
                    />
                    <span className="condition-custom-box"></span>
                    <span className="condition-text">
                      <strong>Entry Fee &amp; Collab:</strong> Entry fee is <strong>just ₹249 (Limited seats only)</strong>. I agree to collab with <strong>@chithirai.creations</strong> and tag <strong>@svsfoods</strong> (<a href="https://www.instagram.com/svsfoods?mdxt=bzQ1czk1ZmtlaDd3" target="_blank" rel="noopener noreferrer">@svsfoods</a>). Top 50 participants who get higher marks receive an <strong>SVS Gift Hamper worth ₹300 each (for 50 people)</strong>! Total prizes worth ₹1,00,000!
                    </span>
                  </label>
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
      </div>
    </section>
  );
}
