import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CardPreview from "./CardPreview";
import "./CreateCard.css";
import Navbar from "./Navbar";

const CreateCard = () => {
  const [category, setCategory] = useState(null);
  const [userData, setUserData] = useState({});

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    category: "",
    fullName: "",
    username: "",
    jobTitle: "",
    logo: "",
    profilePhoto: "",
    tagline: "",
    email: "",
    phone: "",
    websiteUrl: "",
    address: "",
    backgroundColor: "",
    fontColor: "",
    iconColor: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      instagram: "",
    },
    role_details: {},
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !token) return;

      try {
        const response = await axios.get(
          `https://vcard-backend.onrender.com/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setUserData(response.data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }
    };

    fetchUserData();
  }, [userId, token]);

  console.log(userData);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    // File upload (logo, profile photo)
    if (files && files[0]) {
      const file = files[0];
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", "vcardImage");
      formDataUpload.append("cloud_name", "dv5j4hevu");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dv5j4hevu/image/upload",
          {
            method: "POST",
            body: formDataUpload,
          }
        );
        const data = await response.json();
        setFormData((prev) => ({ ...prev, [name]: data.secure_url }));
      } catch (err) {
        alert("Failed to upload image");
      }
    }
    // Nested role details (e.g., role_services_offered)
    else if (name.startsWith("role_")) {
      const key = name.replace("role_", "");
      setFormData((prev) => ({
        ...prev,
        role_details: { ...prev.role_details, [key]: value },
      }));
    }
    // Nested social links
    else if (name.includes("socialLinks.")) {
      const socialKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialKey]: value },
      }));
    }
    // Simple fields
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleroleChange = async (e) => {
    const { name, files } = e.target;

    // File upload (QR code)
    if (files && files[0]) {
      const file = files[0];
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", "vcardImage");
      formDataUpload.append("cloud_name", "dv5j4hevu");

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dv5j4hevu/image/upload",
          {
            method: "POST",
            body: formDataUpload,
          }
        );
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          role_details: {
            ...prev.role_details,
            [name]: data.secure_url, // This stores the image URL in the role_details object
          },
        }));
      } catch (err) {
        alert("Failed to upload QR code");
      }
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...formData,
        profileImageUrl: formData.profilePhoto,
      };

      const response = await fetch("https://vcard-backend.onrender.com/card/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong!";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const text = await response.text();
          if (text) errorMessage = text;
        }
        toast.error(errorMessage);
        return;
      }

      const result = await response.json();
      toast.success("Card created successfully!");
      console.log("Saved Card:", result);

      const cardId = result._id;
      if (cardId) {
        navigate(`/card/find/${cardId}`);
      }
    } catch (err) {
      toast.error(err.message || "Network error");
    }
  };

  const handleDownload = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current);
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = `${formData.username || "digital_card"}.png`;
      link.click();
    }
  };

  function lightenColor(hex, percent = 60) {
    if (!hex) return "#ffffff"; // fallback

    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `rgb(${R}, ${G}, ${B})`;
  }

  const topColor = formData.backgroundColor || "#ffffff";
  const bottomColor = lightenColor(topColor);

  const renderRoleFields = () => {
    const renderInput = (name, label, placeholder) => (
      <div className="form-group">
        <label>{label}</label>
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          onChange={handleChange}
        />
      </div>
    );

    switch (formData.category) {
      case "freelancer":
        return (
          <>
            {renderInput(
              "role_services",
              "Services Offered",
              "e.g. Design, Photography"
            )}
            {/* {renderInput(
              "role_portfolio_url",
              "Portfolio URL",
              "https://yourportfolio.com"
            )} */}
            {/* {renderInput(
              "role_pricing_info_url",
              "Pricing Info URL",
              "https://yourpricingpage.com"
            )} */}
            {renderInput("role_testimonials", "Testimonials", "Text or Link")}
            {renderInput(
              "role_hours",
              "Available / Working Hours",
              "e.g. 10 AM - 6 PM"
            )}
            {renderInput(
              "role_call_to_action_text",
              "Call to Action",
              "Text or Link"
            )}
            {renderInput("role_payment", "Payment", "UPI")}
            {/* QR Code Upload Section */}
            <div className="form-group">
              <label>QR Code</label>
              <div className="image-uploader">
                <input
                  type="file"
                  name="qr_code"
                  accept="image/*"
                  onChange={handleroleChange}
                />
                <div className="upload-preview">Upload or Drag QR Code</div>
                {formData.role_details.qr_code && (
                  <img
                    src={formData.role_details.qr_code}
                    alt="QR Code Preview"
                    className="preview-img"
                  />
                )}
              </div>
            </div>
          </>
        );
      case "small_business":
        return (
          <>
            {renderInput(
              "role_business_name",
              "Business Name",
              "e.g. Fresh Farm Foods"
            )}

            {/* Business Logo Upload Section */}
            <div className="form-group">
              <label>Business Logo</label>
              <div className="image-uploader">
                <input
                  type="file"
                  name="business_logo_url"
                  accept="image/*"
                  onChange={handleroleChange}
                />
                <div className="upload-preview">Upload or Drag Logo</div>
                {formData.role_details.business_logo_url && (
                  <img
                    src={formData.role_details.business_logo_url}
                    alt="Business Logo Preview"
                    className="preview-img"
                  />
                )}
              </div>
            </div>

            {renderInput(
              "role_service_list",
              "Service List",
              "e.g. Catering, Delivery"
            )}
            {renderInput(
              "role_working_hours",
              "Working Hours",
              "Mon-Sat 9AM-6PM"
            )}
            {renderInput(
              "role_store_address",
              "Store Address",
              "123 Main St, City"
            )}
            {renderInput(
              "role_google_reviews_link",
              "Google Reviews Link",
              "https://g.page/reviews"
            )}
            {renderInput(
              "role_booking_link",
              "Booking Link",
              "Calendly or custom link"
            )}
            {renderInput(
              "role_accepts_walk_ins",
              "Accepts Walk-ins",
              "yes or no"
            )}
            {renderInput(
              "role_delivery_available",
              "Delivery Available",
              "yes or no"
            )}
          </>
        );
      case "startup":
        return (
          <>
            {/* Company Logo Upload Section */}
            <div className="form-group">
              <label>Company Logo</label>
              <div className="image-uploader">
                <input
                  type="file"
                  name="company_logo_url"
                  accept="image/*"
                  onChange={handleroleChange}
                />
                <div className="upload-preview">
                  Upload or Drag Company Logo
                </div>
                {formData.role_details.company_logo_url && (
                  <img
                    src={formData.role_details.company_logo_url}
                    alt="Company Logo Preview"
                    className="preview-img"
                  />
                )}
              </div>
            </div>
            {renderInput(
              "role_company_name",
              "Company Name",
              "Enter your company name"
            )}
            {renderInput(
              "role_core_services",
              "Core Services",
              "e.g. SaaS, Consulting"
            )}
            {renderInput(
              "role_pitch_summary",
              "Pitch Summary",
              "Short business pitch"
            )}
            {renderInput(
              "role_investor_deck_url",
              "Investor Deck URL",
              "Optional link"
            )}
            {renderInput(
              "role_case_studies_url",
              "Case Studies URL",
              "https://yourcase.com"
            )}
            {renderInput(
              "role_book_meeting_url",
              "Book Meeting URL",
              "Calendly or other"
            )}
            {renderInput(
              "role_company_website",
              "Company Website",
              "https://company.com"
            )}
            {renderInput("role_industry_type", "Industry Type", "e.g. Fintech")}
          </>
        );
      case "healthcare":
        return (
          <>
            {renderInput(
              "role_specialization",
              "Specialization",
              "e.g. Dermatologist"
            )}
            {renderInput(
              "role_qualifications",
              "Qualifications / Certifications",
              "MBBS, MD"
            )}
            {renderInput(
              "role_clinic_name",
              "Clinic Name",
              "e.g. Life Care Clinic"
            )}
            {renderInput(
              "role_available_slots",
              "Available Slots",
              "Mon 10-2, Tue 4-7"
            )}
            {renderInput(
              "role_appointment_booking_link",
              "Appointment Booking Link",
              "https://booknow.com"
            )}
            {renderInput(
              "role_consultation_fee",
              "Consultation Fee",
              "e.g. ₹500"
            )}
            {renderInput(
              "role_online_consultation_available",
              "Online Consultation",
              "yes or no"
            )}
            {renderInput(
              "role_languages_spoken",
              "Languages Spoken",
              "Hindi, English"
            )}
            {renderInput(
              "role_emergency_contact_number",
              "Emergency Contact Number",
              "+91 9999999999"
            )}
          </>
        );
      case "individual":
        return (
          <>
            {renderInput(
              "role_desired_job_role",
              "Desired Job Role",
              "e.g. Product Manager"
            )}
            {renderInput("role_skills", "Skills", "Design, Coding")}
            {renderInput(
              "role_available_for_freelance",
              "Available for Freelance",
              "yes or no"
            )}
            {renderInput(
              "role_resume_url",
              "Resume URL",
              "https://linktoresume.com"
            )}

            {renderInput(
              "role_personal_website",
              "Personal Website",
              "https://personal.com"
            )}
            {renderInput(
              "role_calendar_link",
              "Calendar Link",
              "https://calendly.com/you"
            )}
          </>
        );
      default:
        return null;
    }
  };

  const paymentHandler = async (event) => {
    event.preventDefault();

    // Step 0: Check if username already exists
    if (!formData.username) {
      toast.error("Please enter a URL Name first.");
      return;
    }

    try {
      const { data } = await axios.get(
        `https://vcard-backend.onrender.com/card/exists/${formData.username}`
      );
      if (data.exists) {
        toast.error("This Url Name is already taken. Please choose another.");
        return;
      }
    } catch (err) {
      toast.error("Failed to verify URL name.");
      return;
    }

    // Continue with payment as before
    const amount = 19900;
    const currency = "INR";
    const receiptId = "1234567890";

    try {
      const { data: order } = await axios.post("https://vcard-backend.onrender.com/order", {
        amount,
        currency,
        receipt: receiptId,
      });

      const options = {
        key: "rzp_test_LW5ITABUSHtVev",
        amount,
        currency,
        name: "Digital vCard",
        description: "Test Transaction",
        image:
          "https://digitaldadi.in/wp-content/uploads/2023/12/dd-logo-dark-versi11on-01.png",
        order_id: order.id,
        handler: async function (response) {
          try {
            const { data: validationResult } = await axios.post(
              "https://vcard-backend.onrender.com/validate",
              response
            );

            await axios.patch(`https://vcard-backend.onrender.com/user/${userId}`, {
              subscriptionStatus: "active",
            });

            handleCreate();
          } catch (err) {
            console.error(
              "Error during validation or subscription update",
              err
            );
          }
        },
        prefill: {
          name: "Digital vCard",
          email: "DigitalDadi@gmail.com",
          contact: "9000000000",
        },
        notes: {
          address: "Digital vCard",
        },
        theme: {
          color: "#ff6b35",
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.description);
      });

      rzp1.open();
    } catch (error) {
      console.error("Payment initiation failed", error);
    }
  };

  return (
    <div id="main">
      <Navbar />
      <div className="create-card-container">
        {!formData.category ? (
          <div className="card-type-selector">
            <h2>Select Category</h2>
            <div className="card-type-options">
              {[
                {
                  key: "freelancer",
                  label: "Freelancer",
                  icon: <i className="ri-user-fill"></i>,
                },
                {
                  key: "small_business",
                  label: "Small Business",
                  icon: <i className="ri-store-2-fill"></i>,
                },
                {
                  key: "startup",
                  label: "Startup",
                  icon: <i className="ri-rocket-2-fill"></i>,
                },
                {
                  key: "healthcare",
                  label: "Healthcare",
                  icon: <i className="ri-stethoscope-fill"></i>,
                },
                {
                  key: "individual",
                  label: "Individual",
                  icon: <i className="ri-user-3-fill"></i>,
                },
              ].map((type) => (
                <div
                  key={type.key}
                  className={`type-card ${
                    formData.category === type.key ? "selected" : ""
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, category: type.key }))
                  }
                >
                  <div id="type">{type.icon}</div>
                  <p>{type.label}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="form-section">
            <div className="form-header">
              <i
                className="ri-arrow-left-line"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, category: "" }))
                }
              ></i>

              <h2>Create Your Digital Card</h2>
            </div>

            {/* Section: Personal Info */}
            <div className="editor-section">
              <div className="section-title">
                <span>1</span> Personal Information
              </div>

              <div className="form-group-row">
                <div className="form-group half-width">
                  <label>Company Logo</label>
                  <div className="image-uploader">
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <div className="upload-preview">Upload or Drag Logo</div>
                    {formData.logo && (
                      <img
                        src={formData.logo}
                        alt="Logo Preview"
                        className="preview-img"
                      />
                    )}
                  </div>
                </div>
                <div className="form-group half-width">
                  <label>Profile Photo</label>
                  <div className="image-uploader">
                    <input
                      type="file"
                      name="profilePhoto"
                      accept="image/*"
                      onChange={handleChange}
                    />
                    <div className="upload-preview">
                      Upload or Drag an Image
                    </div>
                    {formData.profilePhoto && (
                      <img
                        src={formData.profilePhoto}
                        alt="Profile Preview"
                        className="preview-img"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Url Name</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Jusername"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Marketing Manager"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>About</label>
                <input
                  type="text"
                  name="tagline"
                  placeholder="One line bio"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section: Style Options */}
            {/* Section: Card Appearance */}
            <div className="editor-section">
              <div className="section-title">
                <span>2</span> Card Appearance
              </div>

              <div className="form-group-row">
                <div className="form-group half-width">
                  <label>Background Color</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="color"
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleChange}
                      style={{
                        width: "50px",
                        height: "36px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    />
                    <div
                      style={{
                        width: "80px",
                        height: "36px",
                        background: `linear-gradient(to bottom, ${
                          formData.backgroundColor
                        }, ${lightenColor(formData.backgroundColor)})`,
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="form-group half-width">
                  <label>Heading Color</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="color"
                      name="fontColor"
                      value={formData.fontColor}
                      onChange={handleChange}
                      style={{
                        width: "50px",
                        height: "36px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    />
                    <div
                      style={{
                        width: "80px",
                        height: "36px",
                        background: `${formData.fontColor}`,
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="form-group half-width">
                  <label>Icon Color</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="color"
                      name="iconColor"
                      value={formData.iconColor}
                      onChange={handleChange}
                      style={{
                        width: "50px",
                        height: "36px",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    />
                    <div
                      style={{
                        width: "80px",
                        height: "36px",
                        background: `${formData.iconColor}`,
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Contact Info */}
            <div className="editor-section">
              <div className="section-title">
                <span>2</span> Contact Information
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 1234567890"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Website URL</label>
                <input
                  type="url"
                  name="websiteUrl"
                  placeholder="https://yourwebsite.com"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="City, State, Country"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section: Social Links */}
            <div className="editor-section">
              <div className="section-title">
                <span>3</span> Social Links
              </div>

              <div className="form-group">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="socialLinks.linkedin"
                  placeholder="LinkedIn Profile"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Twitter</label>
                <input
                  type="url"
                  name="socialLinks.twitter"
                  placeholder="Twitter Handle"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="url"
                  name="socialLinks.instagram"
                  placeholder="Instagram Profile"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="url"
                  name="socialLinks.facebook"
                  placeholder="Facebook Profile"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section: Role Specific Fields */}
            <div className="section-title">
              <span>4</span> Additional Details
            </div>
            {renderRoleFields()}

            <div className="action-buttons">
              {userData.subscriptionStatus === "active" ? (
                <button className="save-btn" onClick={handleCreate}>
                  Create Card
                </button>
              ) : (
                <button className="save-btn" onClick={paymentHandler}>
                  Make it Live <i class="ri-vip-crown-fill"></i>
                </button>
              )}
            </div>
          </div>
        )}
        <div className="previewCard">
          <CardPreview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default CreateCard;
