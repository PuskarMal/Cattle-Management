import React, { useEffect, useState } from "react";
import { data, useLocation } from "react-router-dom";
import TopPrediction from "../components/Charts/TopPrediction";

const BreedAnalytics = () => {
  const { state } = useLocation();
  const [result, setResult] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state?.imageFile) return;

    const fetchPrediction = async () => {
      try {
        const formData = new FormData();
        formData.append("image", state.imageFile);

        const res = await fetch(
          "http://127.0.0.1:5000/predict",
          { method: "POST", body: formData }
        );
        const data = await res.json();
        setResult(data);

        const breedDetailsRes = await fetch(
          `http://localhost:3000/predict/fetch_details/${data.breed}`
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
        No image provided. Please upload an image first.
      </p>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Breed Analytics
        </h1>
        <span className="text-sm text-gray-500">
          AI-powered identification
        </span>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* IMAGE PREVIEW */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-lg font-semibold mb-4">Uploaded Image</h2>
          <img
            src={URL.createObjectURL(state.imageFile)}
            alt="Uploaded"
            className="w-full max-h-72 object-contain rounded-lg"
          />
        </div>

        {/* ANALYSIS */}
        <div className="bg-white p-6 rounded-xl shadow border space-y-4">
          <h2 className="text-lg font-semibold">Analysis Result</h2>

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

              {/* CONFIDENCE BAR */}
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
  <div className="mt-4">
    <TopPrediction predictions={result.top_predictions} />
  </div>
</div>

              </div>

              <p className="text-sm text-gray-500">
                {result.description}
              </p>
              
            </>
          )}
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

          {/* DISEASES */}
          <div className="grid grid-cols-2 gap-8">
            <div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Recommended Fodder
            </h3>
            <div className="flex flex-wrap gap-2">
              {details.recommended_feed?.map((f, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-md rounded-full bg-green-50 text-green-700 border border-red-200"
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
                  className="px-3 py-1 text-md rounded-full bg-red-50 text-red-700 border border-red-200"
                >
                  {d}
                </span>
              ))}
            </div>
            </div>
            
          </div>
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