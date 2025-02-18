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

      {/* Flex container for Register and CarbonEmissionChart */}
      <div className="flex w-full mt-8 flex-col md:flex-row lg:mr-[10rem]">
        {/* Register: Add margin-left on mobile only */}
        <div className="w-full sm:ml-12 md:w-1/3 md:ml-[10rem]  ">
          <Register />
        </div>

        {/* CarbonEmissionChart: Add margin-top on mobile only */}
        <div className="w-full md:w-2/3 p-4 mt-[-17rem] sm:mt-12 sm:ml-0">
          <CarbonEmissionChart />
        </div>
      </div>
    </div>
  );
};

export default App;
