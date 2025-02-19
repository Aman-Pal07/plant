import React from "react";
import Certificate from "./components/main";
import Register from "./components/Register";
import CarbonEmissionChart from "./CarbonEmissionChart";
import Logo from "./components/Logo";

const App = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: "url('/bg-3.jpg')" }}
    >
      {/* Logo at the top center */}
      <div className="mb-4">
        <Logo />
      </div>

      {/* Register Component below the Logo */}
      <div>
        <Register />
      </div>
    </div>
  );
};

export default App;
