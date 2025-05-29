import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../Pages/Home.css";

const LoginPopup = ({ isOpen, onClose, onSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleAuth = async () => {
    const url = isSignup
      ? "http://localhost:8080/user/signup"
      : "http://localhost:8080/user/signin";

    const body = isSignup ? { name, email, password } : { email, password };

    try {
      const response = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("isLoggedIn", true);
        toast.success(isSignup ? "Signup successful!" : "Login successful!");
        onClose();
        onSuccess?.();
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="popup-overlay-home">
      <div className="popup">
        <h2 className="popup-title">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="popup-subtitle">
          {isSignup ? "Sign up to get started" : "Login to continue"}
        </p>

        {isSignup && (
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <div className="popup-buttons">
          <button className="btn-primary" onClick={handleAuth}>
            {isSignup ? "Sign Up" : "Login"}
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>

        <p className="toggle-auth">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Login" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;
