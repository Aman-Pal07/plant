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
  const [videoEnded, setVideoEnded] = useState(false); // Track when video ends
  const videoRef = useRef(null); // Create reference to video element

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setPopupMessage(""); // Reset popup message before submitting

    try {
      const response = await fetch(
        "https://plant-ebon.vercel.app/api/auth/register",
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

        // Reset animation after a delay, so the user sees the entire video
        setTimeout(() => {
          setShowAnimation(false);
        }, videoRef.current.duration * 1000); // Delay based on the video's actual duration
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
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 bg-white text-black border ${
        popupType === "success" ? "border-green-500" : "border-red-500"
      }`}
    >
      {popupMessage}
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="relative">
        <User className="text-green-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          id="name"
          placeholder="Your full name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 transition-all"
        />
      </div>

      <div className="relative">
        <Mail className="text-green-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        <input
          type="email"
          id="email"
          placeholder="Your email address"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 transition-all"
        />
      </div>

      <div className="relative">
        <PhoneCall className="text-green-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        <input
          type="tel"
          id="phone"
          placeholder="Your phone number"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-gradient-to-r from-green-800 to-green-400 text-white rounded-lg py-3 sm:py-4 mt-4 flex justify-center items-center gap-2 hover:from-green-900 hover:to-green-500 transition-transform transform hover:-translate-y-1 shadow-lg disabled:opacity-50"
      >
        {loading ? (
          "Registering..."
        ) : (
          <>
            <Leaf className="text-white" /> Plant & Grow Together
          </>
        )}
      </button>
    </form>
  );

  const renderAnimation = () => (
    <div className="absolute top-0 left-0 w-full h-full z-0 flex justify-center items-center">
      <video
        ref={videoRef}
        src="/plant_gif.mp4"
        autoPlay
        muted
        className="w-96 h-96 object-cover rounded-full"
        onLoadedMetadata={() => {
          console.log("Video Duration:", videoRef.current.duration);
          videoRef.current.playbackRate = 3;
        }}
        onEnded={() => window.location.reload()} // Reloads the page when video ends
        style={{ transform: "scale(1.1)" }}
      />
    </div>
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-cover bg-center relative bg-[url('/Forest-Habitat.jpg')]">
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

      {/* Logo at the top center */}
      <div className="absolute top-4 bg-white left-1/2 transform -translate-x-1/2 z-10">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Oil_India_Logo.svg/800px-Oil_India_Logo.svg.png"
          alt="Logo"
          className="h-16 w-auto"
        />
      </div>

      {/* Popup Message */}
      {popupMessage && renderPopup()}

      {/* Render animation or form */}
      {showAnimation && !videoEnded ? (
        renderAnimation()
      ) : (
        <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 sm:p-10 shadow-2xl max-w-md w-full relative z-10 transition-transform duration-300">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-green-700 text-center mb-4 ml-[-1rem] font-bold whitespace-nowrap">
            Plant a Tree & Save the Earth
          </h2>

          <p className="text-center text-gray-700 mb-6 text-sm sm:text-base">
            Join our growing community of tree-savers and nature lovers!
          </p>

          {renderForm()}
        </div>
      )}
    </div>
  );
};

export default Register;
