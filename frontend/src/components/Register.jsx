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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setError("Thanks for register");
      setPopupMessage("Thanks for register");
      setPopupType("error");
    } finally {
      setLoading(false);
    }
  };

  const renderPopup = () => (
    <div className="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 bg-white text-black border max-w-[90vw] md:max-w-md transition-all duration-300 ease-in-out transform hover:scale-105">
      <div
        className={`${
          popupType === "success"
            ? "border-l-4 border-green-500"
            : "border-l-4 border-red-500"
        } pl-4`}
      >
        {popupMessage}
      </div>
    </div>
  );

  const renderForm = () => (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-sm mx-auto"
    >
      <div className="relative">
        <User className="text-green-400 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
        <input
          type="text"
          id="name"
          placeholder="Your full name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 transition-all text-base sm:text-lg"
        />
      </div>

      <div className="relative">
        <Mail className="text-green-400 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
        <input
          type="email"
          id="email"
          placeholder="Your email address"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 transition-all text-base sm:text-lg"
        />
      </div>

      <div className="relative">
        <PhoneCall className="text-green-400 absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
        <input
          type="tel"
          id="phone"
          placeholder="Your phone number"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 transition-all text-base sm:text-lg"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-green-800 to-green-400 text-white rounded-lg py-3 px-6 mt-4 flex justify-center items-center gap-2 hover:from-green-900 hover:to-green-500 transition-all transform hover:-translate-y-1 shadow-lg disabled:opacity-50 text-base sm:text-lg font-medium"
      >
        {loading ? (
          "Registering..."
        ) : (
          <>
            <Leaf className="text-white w-5 h-5" /> Plant & Grow Together
          </>
        )}
      </button>
    </form>
  );

  const renderAnimation = () => (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <video
        ref={videoRef}
        src="/plant_gif.mp4"
        autoPlay
        muted
        className="w-full h-full max-w-md max-h-md object-contain rounded-2xl"
        onLoadedMetadata={() => {
          videoRef.current.playbackRate = 3;
        }}
        onEnded={() => window.location.reload()}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center relative bg-[url('/Forest-Habitat.jpg')] px-4 py-6">
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

      {/* Logo */}
      <div className="absolute top-4 left-1/2 transform bg-white -translate-x-1/2 z-10 w-full max-w-[200px] px-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Oil_India_Logo.svg/800px-Oil_India_Logo.svg.png"
          alt="Logo"
          className="w-full h-auto object-contain"
        />
      </div>

      {popupMessage && renderPopup()}

      {showAnimation && !videoEnded ? (
        renderAnimation()
      ) : (
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl w-full max-w-md mx-auto relative z-10 mt-20 transition-transform duration-300">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-green-700 text-center mb-4 font-bold">
            Plant a Tree &<br className="sm:hidden" /> Save the Earth
          </h2>

          <p className="text-center text-gray-700 mb-6 text-sm sm:text-base px-2">
            Join our growing community of tree-savers and nature lovers!
          </p>

          {renderForm()}
        </div>
      )}
    </div>
  );
};

export default Register;
