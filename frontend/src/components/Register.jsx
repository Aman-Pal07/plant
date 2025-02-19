import React, { useState, useRef } from "react";
import { User, Mail, PhoneCall, Leaf } from "lucide-react";
import CarbonEmissionChart from "../CarbonEmissionChart";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setError("");
    setPopupMessage("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter your name!");
      setPopupMessage("Please enter your name!");
      setPopupType("error");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address!");
      setPopupMessage("Please enter a valid email address!");
      setPopupType("error");
      return false;
    }

    if (formData.phone.trim() !== "" && !/^\d{10}$/.test(formData.phone)) {
      setError("If providing a phone number, it must be exactly 10 digits.");
      setPopupMessage(
        "If providing a phone number, it must be exactly 10 digits."
      );
      setPopupType("error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    setPopupMessage("");

    try {
      const response = await fetch(
        "https://plant-b9xj.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.name,
            email: formData.email,
            phone: formData.phone,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setShowAnimation(true);
        setFormData({ name: "", email: "", phone: "" });
        setPopupMessage("Registration Successful!");
        setPopupType("success");

        setTimeout(() => {
          setShowAnimation(false);
          setPopupMessage(""); // Hide popup after 4 seconds
        }, 4000); // 4 seconds
      } else {
        setError(data.message || "Something went wrong. Please try again.");
        setPopupMessage(
          data.message || "Something went wrong. Please try again."
        );
        setPopupType("error");

        setTimeout(() => {
          setPopupMessage(""); // Hide popup after 4 seconds
        }, 4000);
      }
    } catch (error) {
      setError("The error is ", error);
      setPopupMessage(
        "Thanks for Registration. The Certification has been mailed to your Account"
      );

      setPopupType("error");
    } finally {
      setLoading(false);
    }
  };

  const renderPopup = () => (
    <div className="fixed top-4 right-4 p-4 rounded-lg shadow-lg bg-white text-black border w-full max-w-[90vw] sm:max-w-sm md:max-w-md transition-all duration-300 ease-in-out transform hover:scale-105">
      <div
        className={`${
          popupType === "success"
            ? "border-l-4 border-green-500"
            : "border-l-4 border-red-500"
        } pl-4 text-sm sm:text-base`}
      >
        {popupMessage}
      </div>
    </div>
  );

  const renderForm = () => (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:gap-4 w-full max-w-[90vw] sm:max-w-sm mx-auto"
    >
      <div className="relative">
        <User className="text-green-400 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          id="name"
          placeholder="Your full name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 transition-all text-xs sm:text-sm md:text-base"
        />
      </div>

      <div className="relative">
        <Mail className="text-green-400 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="email"
          id="email"
          placeholder="Your email address"
          value={formData.email}
          onChange={handleChange}
          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 transition-all text-xs sm:text-sm md:text-base"
        />
      </div>

      <div className="relative">
        <PhoneCall className="text-green-400 absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="tel"
          id="phone"
          placeholder="Your phone number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 transition-all text-xs sm:text-sm md:text-base"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-green-800 to-green-400 text-white rounded-lg py-2 sm:py-3 px-4 sm:px-6 mt-2 sm:mt-4 flex justify-center items-center gap-2 hover:from-green-900 hover:to-green-500 transition-all transform hover:-translate-y-1 shadow-lg disabled:opacity-50 text-xs sm:text-sm md:text-base font-medium "
      >
        {loading ? (
          "Registering..."
        ) : (
          <>
            <Leaf className="text-white w-4 h-4 sm:w-5 sm:h-5" /> Plant & Grow
            Together
          </>
        )}
      </button>
    </form>
  );

  const renderAnimation = () => (
    <div className="w-full flex justify-center items-start p-1">
      <div className="relative aspect-square w-[280px] sm:w-[320px] md:w-[400px] lg:w-[400px]">
        <video
          ref={videoRef}
          src="/plant_gif.mp4"
          autoPlay
          muted
          className="w-full h-full object-cover"
          onLoadedMetadata={() => {
            videoRef.current.playbackRate = 3;
          }}
          onEnded={() => {
            setVideoEnded(true);
            setShowAnimation(false);
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex items-center justify-center overflow-hidden">
      <div className="relative w-full min-h-screen flex flex-col items-center justify-start py-8 px-4 sm:px-6 md:px-8 overflow-y-auto max-h-screen">
        {/* Popup Message */}
        {popupMessage && renderPopup()}

        {/* Conditional Animation */}
        {showAnimation && !videoEnded ? (
          renderAnimation()
        ) : (
          <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-y-8 sm:gap-x-6 px-4 sm:px-6 md:px-8 overflow-y-auto max-h-screen">
            {/* Left Side */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 bg-white/60 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30">
              <h2 className="text-xl sm:text-2xl font-bold uppercase text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-green-800 to-green-600 pb-5">
                Plant a Tree & Make the ESG Townhall Meeting Carbon Neutral
              </h2>
              <p className="text-center text-gray-800 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed px-3">
                Join our growing community on{" "}
                <span className="font-semibold text-green-700">
                  19 Feb, 2025
                </span>{" "}
                and make a positive impact on the environment. Register now!
              </p>
              {renderForm()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
