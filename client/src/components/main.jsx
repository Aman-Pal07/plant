import React from "react";

const Certificate = () => {
  // Function to redirect to the plant location
  const handleLocationClick = () => {
    window.open(
      "https://www.google.com/maps", // Replace with the actual plant location URL
      "_blank"
    );
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-[800px] bg-white shadow-2xl rounded-lg p-8 relative overflow-hidden border-t-8 border-green-700">
        {/* Logo in Top Right Corner */}
        <div className="absolute top-4 right-4 w-30 h-30">
          <img
            src="../../public/oil-2.png"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r w-[30rem] from-green-700 to-green-500 text-white py-3 px-6 rounded-t-md shadow-md">
          <h1 className="text-3xl font-extrabold tracking-wide">
            Certificate of Completion
          </h1>
        </div>

        {/* Body */}
        <div className="mt-8 text-center">
          <p className="text-gray-700 text-lg">
            This Certificate of Completion is Presented to
          </p>
          <h2 className="text-green-800 text-5xl font-extrabold mt-2 underline decoration-green-500 underline-offset-4">
            Ashok Pathan
          </h2>
          <p className="mt-4 text-gray-700 max-w-xl mx-auto text-[15px] leading-relaxed">
            Thank you for your co-operation for signing this initiative from{" "}
            <span className="font-bold text-green-800">
              OIL CLIMATE ACADEMY
            </span>{" "}
            for successfully completing the program aimed to enhance
            understanding and capabilities in addressing challenges related to
            climate change, sustainability & energy transition.
          </p>
          <p className="mt-8 text-gray-600 text-lg font-medium">
            December, 21, 2024
          </p>
        </div>

        {/* Decorative Line */}
        <div className="mt-8 border-t border-gray-300"></div>

        {/* Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLocationClick}
            className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out"
          >
            View Plant Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
