import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const TopPrediction = ({ predictions }) => {
  const data = {
    labels: predictions.map(p => p.breed),
    datasets: [
      {
        label: "Confidence (%)",
        data: predictions.map(p => p.confidence),
        backgroundColor: "#16a34a",
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: value => `${value}%`
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="h-50 w-full bg-white p-8 rounded-xl  shadow-sm">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">
        Top 5 Breed Predictions
      </h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TopPrediction;
