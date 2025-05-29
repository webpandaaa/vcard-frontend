import React, { useState } from "react";
import "./CreateCard.css";

const CardPreview = ({ formData }) => {
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  function lightenColor(hex, percent = 60) {
    if (!hex) return "#ffffff"; // fallback

    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `rgb(${R}, ${G}, ${B})`;
  }

  const handlePopupClose = () => {
    setShowPaymentPopup(false);
  };

  const topColor = formData.backgroundColor || "#ffffff";
  const bottomColor = lightenColor(topColor);

  console.log(formData);
  console.log(formData.role_details.services_offered);

  const generateVCard = () => {
    const vCardData = `
BEGIN:VCARD
VERSION:3.0
FN:${formData.fullName || "Your Name"}
ORG:${formData.companyName || "Company Name"}
TEL:${formData.phone || ""}
EMAIL:${formData.email || ""}
ADR:${formData.address || ""}
URL:${formData.websiteUrl || ""}
PHOTO;VALUE=URL:${formData.logo || ""}
NOTE:${formData.tagline || "Your Bio"}

${
  formData.category === "freelancer"
    ? `
TITLE:${formData.jobTitle || "Freelancer"}
SERVICES:${formData.role_details.services || ""}
`
    : ""
}

${
  formData.category === "small_business"
    ? `
BUSINESS NAME:${formData.role_details.business_name || "Business Name"}
SERVICES:${formData.role_details.service_list || ""}
`
    : ""
}

${
  formData.category === "startup"
    ? `
COMPANY NAME:${formData.role_details.company_name || "Startup Name"}
PITCH SUMMARY:${formData.role_details.pitch_summary || ""}
`
    : ""
}

${
  formData.category === "healthcare"
    ? `
SPECIALIZATION:${formData.role_details.specialization || "Healthcare"}
QUALIFICATIONS:${formData.role_details.qualifications || "Qualifications"}
`
    : ""
}

END:VCARD
    `;

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formData.fullName || "Contact"}_${Date.now()}.vcf`; // Download file with dynamic name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="preview-section">
      <div className="mobile-frame">
        <div
          className="card-preview"
          style={{
            background: `linear-gradient(to bottom, ${
              formData.backgroundColor
            }, ${lightenColor(formData.backgroundColor)})`,
          }}
        >
          <div className="forlogo">
            {formData.logo && (
              <img src={formData.logo} alt="Company Logo" className="logo" />
            )}
            {formData.profilePhoto && (
              <img
                src={formData.profilePhoto}
                alt="Profile"
                className="profile-photo"
              />
            )}
          </div>

          <div className="lower">
            <h3 style={{ color: formData.fontColor }}>
              {formData.fullName || " Your Name"}
            </h3>
            <p>{formData.jobTitle || " Title"}</p>
            <h6>{formData.tagline || " Your Bio"}</h6>
            <div className="social-links">
              <a
                href={formData.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                style={{ color: formData.iconColor }}
              >
                <i className="ri-linkedin-fill"></i>
              </a>
              <a
                href={formData.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
                style={{ color: formData.iconColor }}
              >
                <i className="ri-twitter-fill"></i>
              </a>
              <a
                href={formData.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                style={{ color: formData.iconColor }}
              >
                <i className="ri-instagram-fill"></i>
              </a>
              <a
                href={formData.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                style={{ color: formData.iconColor }}
              >
                <i className="ri-facebook-fill"></i>
              </a>
            </div>
            {formData.companyName && (
              <p>Company - {formData.companyName || "Company Name"}</p>
            )}

            {formData.address && <p> {formData.address || "Address"}</p>}
          </div>

          <div className="contact-buttons">
            <a
              href={`mailto:${formData.email}`}
              className="contact-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i style={{ color: formData.iconColor }} class="ri-mail-fill"></i>{" "}
              Email
            </a>

            <a href={`tel:${formData.phone}`} className="contact-button">
              <i
                style={{ color: formData.iconColor }}
                class="ri-phone-fill"
              ></i>{" "}
              Phone
            </a>

            <a
              href={formData.websiteUrl}
              className="contact-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i
                style={{ color: formData.iconColor }}
                class="ri-global-fill"
              ></i>{" "}
              Website
            </a>
          </div>

          {formData.category === "freelancer" && (
            <div id="freelancer" className="extras">
              {/* Services */}
              {formData.role_details.services && (
                <div className="tag-section">
                  <h3 style={{ color: formData.fontColor }}>Services</h3>
                  <div className="tag-list">
                    {formData.role_details.services
                      .split(",")
                      .map((skill, index) => (
                        <span key={index} className="tag">
                          {skill.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {formData.role_details.testimonials && (
                <div className="tag-section">
                  <h3 style={{ color: formData.fontColor }}>Testimonials</h3>
                  <div className="tag-list">
                    {formData.role_details.testimonials
                      .split(",")
                      .map((service, index) => (
                        <span key={index} className="tag service-tag">
                          {service.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* Working Hours */}
              {formData.role_details.hours && (
                <div className="info-card">
                  <i
                    style={{ color: formData.iconColor }}
                    className="icon ri-alarm-fill"
                  ></i>
                  <div className="info">
                    <h4>Working Hours</h4>
                    <p>{formData.role_details.hours}</p>
                  </div>
                </div>
              )}

              <div className="contact-buttons">
                {formData.role_details.call_to_action_text && (
                  <a
                    href={formData.role_details.call_to_action_text}
                    className="contact-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "15px" }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      class="ri-mail-check-line"
                    ></i>
                    Hire Me
                  </a>
                )}
                {/* Payment Button */}
                {formData.role_details.payment && (
                  <a
                    onClick={() => setShowPaymentPopup(true)}
                    className="contact-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "15px", cursor: "pointer" }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      className="ri-currency-line"
                    ></i>
                    Payment
                  </a>
                )}

                {/* Payment Popup Modal */}
                {showPaymentPopup && (
                  <div className="popup-overlay">
                    <div className="popup-content">
                      <button
                        onClick={handlePopupClose}
                        className="popup-close-button"
                      >
                        <i class="ri-close-fill"></i>
                      </button>
                      <h2>Payment Details</h2>
                      <div className="payment-info">
                        {/* Display QR Code if available */}
                        {formData.role_details.qr_code && (
                          <div className="qr-code">
                            <img
                              src={formData.role_details.qr_code}
                              alt="QR Code"
                              className="qr-img"
                            />
                          </div>
                        )}
                        {/* Display UPI ID */}
                        {formData.role_details.payment && (
                          <div className="upi-info">
                            <p>UPI ID: {formData.role_details.payment}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {formData.category === "small_business" && (
            <div className="business-card-container">
              {/* Business Logo & Name */}
              {formData.role_details.business_logo_url && (
                <img
                  src={formData.role_details.business_logo_url}
                  alt="Business Logo"
                  className="business-logo"
                />
              )}

              {formData.role_details.business_name && (
                <h2 className="business-name">
                  {formData.role_details.business_name}
                </h2>
              )}

              <div className="extras">
                {formData.role_details.service_list && (
                  <div className="tag-section">
                    <h3 style={{ color: formData.fontColor }}>Services</h3>
                    <div className="tag-list">
                      {formData.role_details.service_list
                        .split(",")
                        .map((skill, index) => (
                          <span key={index} className="tag">
                            {skill.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Working Hours */}
              {formData.role_details.working_hours && (
                <div className="section-block icon-block">
                  <i
                    style={{ color: formData.iconColor }}
                    className="ri-time-fill section-icon"
                  ></i>
                  <div>
                    <h4 className="section-title">Working Hours</h4>
                    <p className="section-text">
                      {formData.role_details.working_hours}
                    </p>
                  </div>
                </div>
              )}

              {/* Store Address */}
              {formData.role_details.store_address && (
                <div className="section-block icon-block">
                  <i
                    style={{ color: formData.iconColor }}
                    className="ri-map-pin-fill section-icon"
                  ></i>
                  <div>
                    <h4 className="section-title">Store Address</h4>
                    <p className="section-text">
                      {formData.role_details.store_address}
                    </p>
                  </div>
                </div>
              )}

              {/* Accept Walkins */}
              {formData.role_details.accepts_walk_ins && (
                <div className="section-block icon-block">
                  <i
                    style={{ color: formData.iconColor }}
                    className="ri-team-fill section-icon"
                  ></i>
                  <div>
                    <h4 className="section-title">Accept Walkins ?</h4>
                    <p className="section-text">
                      {formData.role_details.accepts_walk_ins}
                    </p>
                  </div>
                </div>
              )}

              {/* Deilvey Avaliable */}
              {formData.role_details.delivery_available && (
                <div className="section-block icon-block">
                  <i
                    style={{ color: formData.iconColor }}
                    className="ri-e-bike-2-line section-icon"
                  ></i>
                  <div>
                    <h4 className="section-title">Delivery Available ?</h4>
                    <p className="section-text">
                      {formData.role_details.delivery_available}
                    </p>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="contact-buttons">
                {formData.role_details.google_reviews_link && (
                  <a
                    href={formData.role_details.google_reviews_link}
                    className="contact-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "15px" }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      class="ri-medal-2-line"
                    ></i>
                    Review
                  </a>
                )}
                {formData.role_details.booking_link && (
                  <a
                    href={formData.role_details.booking_link}
                    className="contact-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "15px" }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      class="ri-calendar-check-fill"
                    ></i>
                    Book Meeting
                  </a>
                )}
              </div>
            </div>
          )}

          {formData.category === "startup" && (
            <div className="forStartup">
              <div className="startup-card-container">
                {/* Company Logo */}
                {formData.role_details.company_logo_url && (
                  <div className="logo-section">
                    <img
                      src={formData.role_details.company_logo_url}
                      alt="Company Logo"
                      className="company-logo"
                    />
                  </div>
                )}

                {/* Company Name */}
                {formData.role_details.company_name && (
                  <h2 className="highlighted-title">
                    {formData.role_details.company_name}
                  </h2>
                )}

                {/* Pitch Summary */}
                {formData.role_details.pitch_summary && (
                  <div className=" ">
                    <p className="">{formData.role_details.pitch_summary}</p>
                  </div>
                )}

                {/* Core Services */}
                {formData.role_details.core_services && (
                  <div className="section-block">
                    <h4 className="section-title">Core Services</h4>
                    <div className="tag-list">
                      {formData.role_details.core_services
                        .split(",")
                        .map((item, index) => (
                          <span className="tag service-tag" key={index}>
                            {item.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Industry Type */}
                {formData.role_details.industry_type && (
                  <div className="section-block icon-block">
                    <i
                      style={{ color: formData.iconColor }}
                      className="ri-building-4-fill section-icon"
                    ></i>
                    <div>
                      <h4 className="section-title">Industry</h4>
                      <p className="section-text">
                        {formData.role_details.industry_type}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* Buttons */}
              <div className="contact-buttons">
                {formData.role_details.investor_deck_url && (
                  <a
                    href={formData.role_details.investor_deck_url}
                    className="contact-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "15px" }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      class="ri-shake-hands-fill"
                    ></i>
                    Invenstor Indeck
                  </a>
                )}
                {formData.role_details.case_studies_url && (
                  <a
                    href={formData.role_details.case_studies_url}
                    className="contact-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "15px" }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      class="ri-book-2-fill"
                    ></i>
                    Case Studies
                  </a>
                )}
                {formData.role_details.book_meeting_url && (
                  <a
                    href={formData.role_details.book_meeting_url}
                    className="contact-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "15px" }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      class="ri-computer-fill"
                    ></i>
                    Book a Meeting
                  </a>
                )}
                {formData.role_details.company_website && (
                  <a
                    href={formData.role_details.company_website}
                    className="contact-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "15px" }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      class="ri-send-plane-fill"
                    ></i>
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          )}

          {formData.category === "healthcare" && (
            <>
              <div className="healthcare-card-container">
                {/* Specialization */}
                {formData.role_details.specialization && (
                  <div
                    className="health-info-block"
                    style={{ borderLeftColor: formData.iconColor }}
                  >
                    <i
                      className="ri-heart-pulse-fill health-icon specialization"
                      style={{ color: formData.iconColor }}
                    ></i>
                    <div>
                      <h4 className="health-label">Specialization</h4>
                      <p>{formData.role_details.specialization}</p>
                    </div>
                  </div>
                )}

                {/* Qualifications */}
                {formData.role_details.qualifications && (
                  <div
                    className="health-info-block"
                    style={{ borderLeftColor: formData.iconColor }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      className="ri-award-fill health-icon qualification"
                    ></i>
                    <div>
                      <h4 className="health-label">Qualifications</h4>
                      <p>{formData.role_details.qualifications}</p>
                    </div>
                  </div>
                )}

                {/* Clinic Name */}
                {formData.role_details.clinic_name && (
                  <div
                    className="health-info-block"
                    style={{ borderLeftColor: formData.iconColor }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      className="ri-hospital-fill health-icon clinic"
                    ></i>
                    <div>
                      <h4 className="health-label">Clinic</h4>
                      <p>{formData.role_details.clinic_name}</p>
                    </div>
                  </div>
                )}

                {/* Available Slots */}
                {formData.role_details.available_slots && (
                  <div
                    className="health-info-block"
                    style={{ borderLeftColor: formData.iconColor }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      className="ri-time-fill health-icon slots"
                    ></i>
                    <div>
                      <h4 className="health-label">Available Slots</h4>
                      <p>{formData.role_details.available_slots}</p>
                    </div>
                  </div>
                )}

                {/* Consultation Fee */}
                {formData.role_details.consultation_fee && (
                  <div
                    className="health-info-block"
                    style={{ borderLeftColor: formData.iconColor }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      className="ri-wallet-3-fill health-icon fee"
                    ></i>
                    <div>
                      <h4 className="health-label">Consultation Fee</h4>
                      <p>{formData.role_details.consultation_fee}</p>
                    </div>
                  </div>
                )}

                {/* Online Consultation */}
                {formData.role_details.online_consultation_available && (
                  <div
                    className="health-info-block"
                    style={{ borderLeftColor: formData.iconColor }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      className="ri-video-chat-fill health-icon video"
                    ></i>
                    <div>
                      <h4 className="health-label">Online Consultation</h4>
                      <p>
                        {formData.role_details.online_consultation_available}
                      </p>
                    </div>
                  </div>
                )}

                {/* Languages Spoken */}
                {formData.role_details.languages_spoken && (
                  <div
                    className="health-info-block"
                    style={{ borderLeftColor: formData.iconColor }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      className="ri-translate health-icon language"
                    ></i>
                    <div>
                      <h4 className="health-label">Languages Spoken</h4>
                      <p>{formData.role_details.languages_spoken}</p>
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {formData.role_details.emergency_contact_number && (
                  <div className="health-info-block emergency-highlight">
                    <i className="ri-phone-fill health-icon emergency"></i>
                    <div>
                      <h4 className="health-label">Emergency Contact</h4>
                      <p>{formData.role_details.emergency_contact_number}</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Buttons */}
              <div className="contact-buttons">
                {formData.role_details.appointment_booking_link && (
                  <a
                    href={formData.role_details.appointment_booking_link}
                    className="contact-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "15px" }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      class="ri-shake-hands-fill"
                    ></i>
                    Book Appointment
                  </a>
                )}
              </div>
            </>
          )}

          {formData.category === "individual" && (
            <>
              <div className="individual-card-container">
                {/* Desired Job Role */}
                {formData.role_details.desired_job_role && (
                  <div className="hero-role-banner">
                    <i className="ri-user-star-fill icon"></i>
                    <span>{formData.role_details.desired_job_role}</span>
                  </div>
                )}

                {/* Skills */}
                {formData.role_details.skills && (
                  <div className="section-tagbox">
                    <h4
                      style={{ color: formData.fontColor }}
                      className="tagbox-title"
                    >
                      Skills
                    </h4>
                    <div className="tag-list">
                      {formData.role_details.skills
                        .split(",")
                        .map((skill, index) => (
                          <span key={index} className="tag pill-tag">
                            {skill.trim()}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Freelance Availability */}
                {formData.role_details.available_for_freelance && (
                  <div className="highlight-box">
                    <i className="ri-briefcase-line"></i>
                    <span>
                      Freelance: {formData.role_details.available_for_freelance}
                    </span>
                  </div>
                )}
              </div>
              <div className="contact-buttons">
                {formData.role_details.calendar_link && (
                  <a
                    href={formData.role_details.calendar_link}
                    className="contact-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "15px" }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      class="ri-shake-hands-fill"
                    ></i>
                    Book a Time
                  </a>
                )}
                {formData.role_details.resume_url && (
                  <a
                    href={formData.role_details.resume_url}
                    className="contact-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "15px" }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      class="ri-arrow-down-circle-fill"
                    ></i>
                    Resume
                  </a>
                )}
                {formData.role_details.personal_website && (
                  <a
                    href={formData.role_details.personal_website}
                    className="contact-button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: "15px" }}
                  >
                    <i
                      style={{ color: formData.iconColor }}
                      class="ri-send-plane-fill"
                    ></i>
                    Personal Website
                  </a>
                )}
              </div>
            </>
          )}
          
          <div className="contact-buttons">
            <div
              className="contact-button"
              target="_blank"
              rel="noopener noreferrer"
              onClick={generateVCard}
            >
              <i
                style={{ color: formData.iconColor }}
                class="ri-download-2-line"
              ></i>{" "}
              Save Info
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
