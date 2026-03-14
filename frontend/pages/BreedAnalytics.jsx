import React, { useEffect, useState } from "react";
import { data, useLocation } from "react-router-dom";
import TopPrediction from "../components/Charts/TopPrediction";
import Silage from "../src/assets/fodder/Silage.jpg";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = {
  "Healthy": "#22c55e",        // green
  "Foot and Mouth": "#ef4444", // red
  "Lumpy Disease": "#f59e0b"   // amber
};
const InfoModal = ({ popup, onClose }) => {
  if (!popup.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 animate-scaleIn">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Image */}
        {popup.data.image && (
          <img
            src={popup.data.image}
            alt={popup.data.name}
            className="w-full h-40 object-cover rounded-xl mb-4"
          />
        )}

        {/* Title */}
        <h3 className={`text-xl font-semibold mb-2
          ${popup.type === "fodder" ? "text-green-700" : "text-red-700"}`}>
          {popup.data.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-700 leading-relaxed">
          {popup.data.description}
        </p>

        {/* Footer */}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const BreedAnalytics = () => {
  const { state } = useLocation();
  const [result, setResult] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [disease, setDisease] = useState(null);
  const [chartData, setChartData] = useState(null)

  const getConfidenceColor = (value) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  useEffect(() => {
    if (!state?.imageFile) return;

    const fetchPrediction = async () => {
      try {
        const formData = new FormData();
        formData.append("image", state.imageFile);
        const result = await fetch("https://cattle-management-ptz0.onrender.com/predict-disease", {
          method: "POST",
          body: formData
        });

        const diseasedata = await result.json();
        setDisease(diseasedata)
        const chart = Object.entries(diseasedata.all_probabilities).map(
          ([name, value]) => ({
            name,
            value
          })
        );
        setChartData(chart)
        const res = await fetch(
          "https://cattle-management-ptz0.onrender.com/predict-breed",
          { method: "POST", body: formData }
        );
        const data = await res.json();
        setResult(data);
        const breedDetailsRes = await fetch(
          `https://cattle-management-ptz0.onrender.com/predict/fetch_details/${data.top_predictions[0].breed}`
        );
        const breedDetails = await breedDetailsRes.json();
        setDetails(breedDetails);

      } catch (err) {
        console.error("Prediction error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [state]);

  if (!state?.imageFile) {
    return (
      <p className="text-center mt-20 text-gray-500">
        {t("warning")}
      </p>
    );
  }
  const [popup, setPopup] = useState({
  open: false,
  type: null,     // "fodder" | "disease"
  data: null
});

  const handleFooder = (fodder) => {
  setPopup({
    open: true,
    type: "fodder",
    data: {
      name: fodder,
      image: `../src/assets/fodder/${fodder}.jpg`,
      description: "Improves digestion and milk yield."
    }
  });
};

const handleDisease = (disease) => {
  setPopup({
    open: true,
    type: "disease",
    data: {
      name: disease,
      description: "A common cattle disease requiring timely vaccination."
    }
  });
};





  return (
    <div className="p-8 min-h-screen space-y-8 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Breed Analytics
        </h2>
        <span className="text-sm text-gray-500">
          AI-powered identification
        </span>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {disease && (
  <div className="bg-white p-6 rounded-xl shadow border h-full flex flex-col">
    <h2 className="text-lg font-semibold mb-4">Uploaded Image</h2>

    <div className="flex flex-1 gap-4 items-center">
      {/* IMAGE */}
      <img
        src={URL.createObjectURL(state.imageFile)}
        alt="Uploaded"
        className="w-[45%] max-h-64 object-contain rounded-lg"
      />

      {/* DISEASE INFO */}
      <div className="flex flex-col gap-4 flex-1">

        {/* PRIMARY DIAGNOSIS */}
        <div className="p-4 rounded-xl bg-gray-50">
          <p className="text-sm text-gray-500">Detected Condition</p>
          <p className="text-2xl font-bold text-gray-800">
            {disease.disease}
          </p>

          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Confidence</span>
              <span>{disease.confidence}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${getConfidenceColor(disease.confidence)}`}
                style={{ width: `${disease.confidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="p-4 rounded-xl bg-gray-50">
          <p className="text-sm text-gray-500">
            Disease Probability Distribution
          </p>

          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[entry.name] || "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v.toFixed(2)}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-3"> 
              {chartData.map((item) => ( 
              <div key={item.name} className="flex items-center gap-2 text-xs"> 
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.name] }} /> 
                <span>{item.name}</span> 
              </div>))}
              </div>
          </div>
        </div>

      </div>
    </div>
  </div>
)}

        
  <div className="bg-white p-6 rounded-xl shadow border h-full flex flex-col">
  <h2 className="text-lg font-semibold mb-4">Analysis Result</h2>

  <div className="flex-1 space-y-4">
    {loading && (
      <p className="text-gray-500 animate-pulse">
        Analyzing image using CNN model…
      </p>
    )}

    {result && (
      <>
        <div>
          <p className="text-xl font-bold text-primary-green">
            {result.top_predictions[0].breed}
          </p>
          <p className="text-sm text-gray-600">
            Predicted Breed
          </p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Confidence</span>
            <span>{result.top_predictions[0].confidence}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 bg-green-500 rounded-full transition-all"
              style={{ width: `${result.top_predictions[0].confidence}%` }}
            />
          </div>
        </div>

        <TopPrediction predictions={result.top_predictions} />

        <p className="text-sm text-gray-500">
          {result.description}
        </p>
      </>
    )}
  </div>
</div>



          
          
      </div>

      {/* BREED DETAILS */}
      {details && (
        <div className="bg-gray-50 p-8 rounded-xl border space-y-6">

          <h2 className="text-2xl font-semibold text-gray-800">
            Breed Insights
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {details.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <InfoCard label="Species" value={details.species} />
            <InfoCard label="Origin" value={details.origin_state} />
            <InfoCard label="Milk Yield" value={`${details.avg_milk_yield_lpd} L/day`} />
            <InfoCard label="Fat %" value={`${details.fat_percentage}%`} />
            <InfoCard label="Lactation Days" value={details.lactation_days} />
            <InfoCard label="First Calving" value={`${details.age_first_calving} months`} />

          </div>

         
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Recommended Fodder
              </h3>
              <div className="flex flex-wrap gap-2">
                {details.recommended_feed?.map((f, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-md rounded-full bg-green-50 text-green-700 border border-red-200 cursor-pointer" onClick={() => handleFooder(f)}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Common Diseases
              </h3>
              <div className="flex flex-wrap gap-2">
                {details.common_diseases?.map((d, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-md rounded-full bg-red-50 text-red-700 border border-red-200 cursor-pointer" onClick={() => handleDisease(d)}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

          </div>
          <InfoModal
  popup={popup}
  onClose={() => setPopup({ open: false })}
/>
        </div>
      )}
    </div>
  );
};

/* Reusable Card */
const InfoCard = ({ label, value }) => (
  <div className="bg-white p-4 rounded-lg border shadow-sm">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-gray-800">{value}</p>
  </div>
);



export default BreedAnalytics