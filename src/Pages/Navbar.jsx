import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LoginPopup from "../Components/LoginPopup";

const Navbar = () => {
  const navigate = useNavigate();

  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showName, setShowName] = useState("");  // You need this to show logged-in user's name

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId || !token) return;

      try {
        const response = await axios.get(`http://localhost:8080/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.user?.name) {
          setShowName(response.data.user.name);
        }
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleClick = () => {
    setShowUserDropdown((prev) => !prev);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isLoggedIn");
    setShowName("");
    toast.success("Logout successful!");
    navigate("/");
  };

  // Handle what happens after login/signup success
  const onLoginSuccess = () => {
    setShowLoginPopup(false);
    // Reload user info after login/signup success
    const fetchUserData = async () => {
      if (!userId || !token) return;
      try {
        const response = await axios.get(`http://localhost:8080/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.user?.name) {
          setShowName(response.data.user.name);
        }
      } catch (err) {
        console.error("Failed to fetch user details:", err);
      }
    };
    fetchUserData();
  };

  return (
    <>
      <div id="navbar">
        <div id="logo" onClick={() => navigate("/")}>
          Digital vCard
        </div>
        <div className="nav-links">
          <a href="#demo">Demo</a>
          <a href="#steps">Steps</a>
          <a href="#contact">Contact</a>
        </div>

        {!showName ? (
          <button className="button" onClick={() => setShowLoginPopup(true)}>
            Sign In
          </button>
        ) : (
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
              onClick={handleClick}
            >
              <i className="ri-user-fill" style={{ fontSize: "20px" }}></i>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                {showName}
              </span>
              <i className="ri-arrow-down-s-line" style={{ fontSize: "16px" }}></i>
            </div>

            {showUserDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  width: "120px",
                  right: 0,
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  padding: "8px 12px",
                  zIndex: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                <button
                  onClick={handleSignOut}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#333",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <i className="ri-logout-box-r-line"></i>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onSuccess={onLoginSuccess}
      />
    </>
  );
};

export default Navbar;
