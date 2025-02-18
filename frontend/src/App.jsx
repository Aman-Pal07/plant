import React from "react";
import Certificate from "./components/main";
import Register from "./components/Register";
import CarbonEmissionChart from "./CarbonEmissionChart";
import Logo from "./components/Logo";

const App = () => {
  return (
    <div
      className="flex flex-col items-center bg-cover bg-center h-full"
      style={{ backgroundImage: "url('/Forest-Habitat.jpg')" }}
    >
      {/* Logo at the top center */}
      <Logo />

      {/* Flex container for Register and CarbonEmissionChart side by side */}
      <div className="flex w-full -xl mt-8 mr-30">
        {/* Register on the left */}
        <div className="w-1/3 ml-[10rem] ">
          <Register />
        </div>

        {/* CarbonEmissionChart on the right */}
        <div className="w-2/3 p-4 ">
          <CarbonEmissionChart />
        </div>
      </div>
    </div>
  );
};

export default App;
