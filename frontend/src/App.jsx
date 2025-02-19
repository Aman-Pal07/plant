import React from "react";
import Certificate from "./components/main";
import Register from "./components/Register";
import CarbonEmissionChart from "./CarbonEmissionChart";
import Logo from "./components/Logo";

const App = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundImage: "url('/bg-3.jpg')" }}
    >
      {/* Logo at the top center */}
      <div className="">
        <Logo />
      </div>

      {/* Register Component below the Logo */}
      <div className="sm:mt-[-2rem]">
        <Register />
      </div>
    </div>
  );
};

export default App;
