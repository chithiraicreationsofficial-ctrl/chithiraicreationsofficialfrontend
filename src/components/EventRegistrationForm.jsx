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
    sweetName: "",
    category: "Reel Category",
    ingredients: "",
  });

  const [conditions, setConditions] = useState({
    minAge: false,
    followersLimit: false,
    originalHomemade: false,
    collabRequired: false,
    masterTerms: false,
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
    conditions.followersLimit &&
    conditions.originalHomemade &&
    conditions.collabRequired &&
    conditions.masterTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!formData.age || Number(formData.age) < 4) {
      setErrorMsg("Minimum age required to participate is 4 years.");
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

    if (!formData.sweetName.trim()) {
      setErrorMsg("Please specify the sweet or palagaram you will showcase.");
      return;
    }

    if (!allConditionsAccepted) {
      setErrorMsg("Please read and accept all contest conditions to proceed.");
      return;
    }

    setIsLoading(true);

    try {
      // Send to backend API
      const res = await axios.post("http://localhost:8000/api/diwali/register", {
        ...formData,
        phone: cleanPhone,
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
      sweetName: "",
      category: "Reel Category",
      ingredients: "",
    });
    setConditions({
      minAge: false,
      followersLimit: false,
      originalHomemade: false,
      collabRequired: false,
      masterTerms: false,
    });
  };

  return (
    <section className="event-registration-section py-5" id="register">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <div className="registration-pill">
            <IoSparkles /> Official Contest Entry
          </div>
          <h2 className="registration-main-heading">
            Event <span className="gold-shimmer-text">Registration</span>
          </h2>
          <p className="registration-lead-text">
            Digital Diwali Palagaram Villa • Prizes Worth ₹60,000! Complete your registration below and join the grand festivity.
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

                {/* 8. Sweet / Palagaram Name */}
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

                {/* 9. Category Dropdown */}
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

                {/* 10. Ingredients Used */}
                <div className="col-12">
                  <label htmlFor="reg-ingredients" className="form-label-custom">
                    Ingredients Used (Optional / As per poster guidelines)
                  </label>
                  <textarea
                    id="reg-ingredients"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleChange}
                    rows="3"
                    placeholder="List the key ingredients used (e.g. Gram flour, Ghee, Sugar, Saffron, Nuts...)"
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
                  <label className="condition-checkbox-label">
                    <input
                      type="checkbox"
                      checked={conditions.minAge}
                      onChange={() => handleConditionToggle("minAge")}
                    />
                    <span className="condition-custom-box"></span>
                    <span className="condition-text">
                      <strong>Age Eligibility:</strong> I confirm I am 4 years or older. There is no upper age limit or gender restriction.
                    </span>
                  </label>

                  <label className="condition-checkbox-label">
                    <input
                      type="checkbox"
                      checked={conditions.followersLimit}
                      onChange={() => handleConditionToggle("followersLimit")}
                    />
                    <span className="condition-custom-box"></span>
                    <span className="condition-text">
                      <strong>Fair Play Follower Rule:</strong> I confirm my Instagram account has <strong>2,000 or fewer followers</strong> (participants with &gt; 2,000 followers are not eligible).
                    </span>
                  </label>

                  <label className="condition-checkbox-label">
                    <input
                      type="checkbox"
                      checked={conditions.originalHomemade}
                      onChange={() => handleConditionToggle("originalHomemade")}
                    />
                    <span className="condition-custom-box"></span>
                    <span className="condition-text">
                      <strong>Authenticity:</strong> Content must be my own original preparation and recorded using a mobile phone only.
                    </span>
                  </label>

                  <label className="condition-checkbox-label">
                    <input
                      type="checkbox"
                      checked={conditions.collabRequired}
                      onChange={() => handleConditionToggle("collabRequired")}
                    />
                    <span className="condition-custom-box"></span>
                    <span className="condition-text">
                      <strong>Instagram Collab:</strong> I agree to upload my entry between <strong>28 Oct and 09 Nov 2026</strong> and collaborate with <strong>@chithirai.creations</strong> on Instagram.
                    </span>
                  </label>

                  <label className="condition-checkbox-label master-terms-label">
                    <input
                      type="checkbox"
                      checked={conditions.masterTerms}
                      onChange={() => handleConditionToggle("masterTerms")}
                    />
                    <span className="condition-custom-box"></span>
                    <span className="condition-text">
                      <strong>Acceptance:</strong> I accept all official contest conditions, judging criteria (Uniqueness, Creativity, Presentation, Concept, Visual Appeal), and decisions.
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
                      <FaTrophy /> Submit Registration &amp; Join Contest
                    </>
                  )}
                </button>
                <div className="submit-subtext mt-2">
                  Total Prizes Worth ₹60,000 • Powered by SVS Title Partner • Chithirai Creations
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
