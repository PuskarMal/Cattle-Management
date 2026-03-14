import React, { useEffect, useState, useMemo } from "react";
import { DISEASE_GUIDE } from "../src/data/diseaseGuide";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import UploadImage from "../components/UploadImage/UploadImage";

/* ---------- COLORS ---------- */

const COLORS = {
  Healthy: "#22c55e",
  "Foot and Mouth": "#ef4444",
  "Lumpy Disease": "#f59e0b"
};

const severityColor = {
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
  Normal: "bg-green-100 text-green-700"
};

/* ---------- Confidence bar color ---------- */

const getConfidenceColor = (confidence) => {
  if (confidence >= 80) return "bg-green-500";
  if (confidence >= 50) return "bg-yellow-400";
  return "bg-red-500";
};

/* ---------- Component ---------- */

const Disease = () => {
  const [disease, setDisease] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  /* Preview URL with cleanup */
  const previewURL = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  /* Prediction API call */

  useEffect(() => {
    if (!imageFile) return;

    const fetchPrediction = async () => {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append("image", imageFile);

        const result = await fetch(
          "https://cattle-management-ptz0.onrender.com/predict-disease",
          { method: "POST", body: formData }
        );

        const data = await result.json();

        setDisease(data);

        if (data?.all_probabilities) {
          const chart = Object.entries(data.all_probabilities).map(
            ([name, value]) => ({ name, value })
          );
          setChartData(chart);
        }

      } catch (err) {
        console.error("Prediction error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [imageFile]);

  const guide = disease ? DISEASE_GUIDE[disease.disease] : null;

  /* ---------- UI ---------- */

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">

      <UploadImage
  onImageReady={(imageFile) => setImageFile(imageFile)}
/>



      {loading && (
        <p className="text-center text-gray-500">
          Analyzing image…
        </p>
      )}

      {disease && (
        <div className="bg-white p-6 rounded-xl shadow border space-y-6">

          {/* IMAGE + DIAGNOSIS */}
          <div className="flex flex-col md:flex-row gap-6">

            <img
              src={previewURL}
              alt="Uploaded"
              className="w-full md:w-1/3 max-h-64 object-contain rounded-lg"
            />

            <div className="flex-1 space-y-4">

              {/* PRIMARY DIAGNOSIS */}
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-500">
                  Detected Condition
                </p>

                <p className="text-2xl font-bold text-gray-800">
                  {disease.disease}
                </p>

                {/* Confidence bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Confidence</span>
                    <span>{disease.confidence}%</span>
                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${getConfidenceColor(
                        disease.confidence
                      )}`}
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

                <div className="h-40">
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
                </div>

                <div className="flex justify-center gap-3 mt-2 flex-wrap">
                  {chartData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            COLORS[item.name] || "#94a3b8"
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* TREATMENT GUIDE */}

          {guide && (
            <div className="bg-gray-50 p-5 rounded-xl border space-y-4">

              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                  Treatment Guide
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${severityColor[guide.severity]}`}
                >
                  {guide.severity} Severity
                </span>
              </div>

              <div>
                <p className="font-medium text-gray-700">
                  Vaccination
                </p>
                <p className="text-sm text-gray-600">
                  {guide.vaccination}
                </p>
              </div>

              <div>
                <p className="font-medium text-gray-700">
                  Medicine
                </p>
                <ul className="list-disc ml-5 text-sm text-gray-600">
                  {guide.medicine.map((med, i) => (
                    <li key={i}>{med}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-medium text-gray-700">
                  Feed & Care
                </p>
                <p className="text-sm text-gray-600">
                  {guide.feed}
                </p>
              </div>

              <div>
                <p className="font-medium text-gray-700">
                  Precaution
                </p>
                <p className="text-sm text-gray-600">
                  {guide.isolation}
                </p>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Disease;
