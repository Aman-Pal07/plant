import React, { useState, useRef } from "react";
import { User, Mail, PhoneCall, Leaf } from "lucide-react";

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
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  React.useEffect(() => {
    checkVideoAvailability();
  }, []);

  const checkVideoAvailability = async () => {
    try {
      const response = await fetch("/plant_gif.mp4", { method: "HEAD" });
      if (!response.ok) {
        setVideoError(true);
      }
    } catch (error) {
      setVideoError(true);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    // Clear any existing errors when user starts typing
    setError("");
    setPopupMessage("");
  };

  const validateForm = () => {
    // Required fields validation
    if (!formData.name.trim()) {
      setError("Please enter your name!");
      setPopupMessage("Please enter your name!");
      setPopupType("error");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address!");
      setPopupMessage("Please enter a valid email address!");
      setPopupType("error");
      return false;
    }

    // Phone validation (only if provided)
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
      // Use relative URL or environment variable for API endpoint
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
        // Add credentials if needed
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setSuccess(data.message);
      setFormData({ name: "", email: "", phone: "" });
      setPopupMessage("Registration Successful!");
      setPopupType("success");

      // Only show animation if video is available
      if (!videoError) {
        setShowAnimation(true);
        // Set timeout based on actual video duration or fallback to 3 seconds
        const duration = (videoRef.current?.duration || 3) * 1000;
        setTimeout(() => {
          setShowAnimation(false);
          window.location.reload();
        }, duration);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
      setPopupMessage("Registration failed. Please try again.");
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
        className="bg-gradient-to-r from-green-800 to-green-400 text-white rounded-lg py-2 sm:py-3 px-4 sm:px-6 mt-2 sm:mt-4 flex justify-center items-center gap-2 hover:from-green-900 hover:to-green-500 transition-all transform hover:-translate-y-1 shadow-lg disabled:opacity-50 text-xs sm:text-sm md:text-base font-medium"
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
    <div className="w-full flex flex-col justify-center items-center">
      {videoError ? (
        // Fallback content when video isn't available
        <div className="text-center p-8">
          <div className="text-green-600 text-xl mb-4">
            Registration Successful!
          </div>
          <Leaf className="w-16 h-16 mx-auto text-green-500 animate-bounce" />
        </div>
      ) : (
        <video
          ref={videoRef}
          src="/plant_gif.mp4"
          autoPlay
          muted
          playsInline
          className="w-40 h-40 sm:w-60 sm:h-60 md:w-96 md:h-96 object-cover rounded-full"
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.playbackRate = 3;
              setVideoLoaded(true);
            }
          }}
          onError={() => setVideoError(true)}
          onEnded={() => window.location.reload()}
          style={{ transform: "scale(1.1)" }}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen w-full h-[100vh] bg-cover bg-center overflow-x-hidden mt-[-25px]">
      {/* Optional overlay for darkening the background */}
      {/* <div className="absolute inset-0 bg-black opacity-40" /> */}

      <div className="relative w-full min-h-screen flex flex-col items-center justify-start py-8 px-4 sm:px-6 md:px-8">
        {popupMessage && renderPopup()}

        {showAnimation && !videoEnded ? (
          renderAnimation()
        ) : (
          <div className="bg-white/50 backdrop-blur-xl rounded-xl lg:h-[32rem] sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl w-full max-w-[95vw] sm:max-w-xl mx-auto">
            <h2 className="text-lg sm:text-2xl md:text-3xl text-green-700 text-center mb-2 sm:mb-4 font-bold lg:ml-[-1rem] whitespace-normal lg:whitespace-nowrap">
              Plant a Tree & Save the Earth
            </h2>

            <p className="text-center text-gray-700 mb-4 sm:mb-6 text-xs sm:text-sm md:text-base px-2">
              Join our growing community of tree-savers and nature lovers!
            </p>

            {renderForm()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
