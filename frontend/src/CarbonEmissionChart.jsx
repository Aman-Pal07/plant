// src/components/CarbonEmissionChart.js
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components for ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CarbonEmissionChart = () => {
  // State for flight hours and trees planted
  const [flightHours, setFlightHours] = useState(5);
  const [treesPlanted, setTreesPlanted] = useState(5);

  // Constants
  const CO2_PER_HOUR = 95; // Avg 95 kg CO2 per flight hour per passenger
  const CO2_ABSORPTION_PER_TREE = 22; // kg CO2 per tree per year

  // Calculate emissions and reductions
  const flightEmissions = flightHours * CO2_PER_HOUR;
  const carbonReduction = treesPlanted * CO2_ABSORPTION_PER_TREE;
  const netEmissions = Math.max(flightEmissions - carbonReduction, 0);

  // Chart data
  const data = {
    labels: ["Flight Emissions", "Carbon Reduction", "Net Emissions"],
    datasets: [
      {
        label: "Carbon Emissions (kg CO₂)",
        data: [flightEmissions, carbonReduction, netEmissions],
        backgroundColor: ["#e74c3c", "#27ae60", "#3498db"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Carbon Emissions vs Reduction",
      },
    },
  };

  return (
    <div className="bg-gradient-to-r bg-white/50 p-4 rounded-xl shadow-xl w-full max-w-4xl mx-auto backdrop-blur-lg">
      <h2 className="text-2xl font-semibold text-white text-center mb-4">
        Carbon Emissions Visualization
      </h2>

      <div className="space-y-4 mb-4">
        {/* Flight Hours Input */}
        <div className="flex flex-col">
          <label htmlFor="flightHours" className="text-white font-medium mb-2">
            Flight Hours:
          </label>
          <input
            id="flightHours"
            type="number"
            value={flightHours}
            min="1"
            onChange={(e) => setFlightHours(Number(e.target.value))}
            className="px-3 py-2 rounded-lg bg-white/70 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
        </div>

        {/* Trees Planted Input */}
        <div className="flex flex-col">
          <label htmlFor="treesPlanted" className="text-white font-medium mb-2">
            Trees Planted:
          </label>
          <input
            id="treesPlanted"
            type="number"
            value={treesPlanted}
            min="0"
            onChange={(e) => setTreesPlanted(Number(e.target.value))}
            className="px-3 py-2 rounded-lg bg-white/70 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="w-full h-[250px] flex justify-center items-center bg-white/50 rounded-lg shadow-lg">
        <Bar
          data={data}
          options={options}
          width={undefined} // Remove static width
          height={undefined} // Remove static height
        />
      </div>
    </div>
  );
};

export default CarbonEmissionChart;
