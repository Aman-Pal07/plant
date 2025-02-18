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
        }, videoRef.current.duration * 1000);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
        setPopupMessage(
          data.message || "Something went wrong. Please try again."
        );
        setPopupType("error");
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
    <div className="w-full flex justify-center items-center">
      <video
        ref={videoRef}
        src="/plant_gif.mp4"
        autoPlay
        muted
        className="w-40 h-40 sm:w-60 sm:h-60 md:w-96 md:h-96 object-cover rounded-full"
        onLoadedMetadata={() => {
          videoRef.current.playbackRate = 3;
        }}
        onEnded={() => window.location.reload()}
        style={{ transform: "scale(1.1)" }}
      />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-cover bg-center overflow-x-hidden mt-[-30px] flex items-center justify-center">
      <div className="relative w-full min-h-screen flex flex-col items-center justify-start py-8 px-4">
        {popupMessage && renderPopup()}

        {showAnimation && !videoEnded ? (
          renderAnimation()
        ) : (
          <div className="bg-white/50 backdrop-blur-xl rounded-xl h-[510px] sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl w-full max-w-[95vw] sm:max-w-xl mx-auto flex flex-col items-center justify-center">
            <h2 className="text-lg sm:text-2xl md:text-3xl text-green-700 text-center mb-2 sm:mb-4 font-bold">
              Plant a Tree &<br className="sm:hidden" /> Save the Earth
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
