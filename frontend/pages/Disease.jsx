import React, { useEffect, useState, useMemo, useRef } from "react";
import { DISEASE_GUIDE } from "../src/data/diseaseGuide";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import UploadImage from "../components/UploadImage/UploadImage";

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

const getConfidenceColor = (confidence) => {
  if (confidence >= 80) return "bg-green-500";
  if (confidence >= 50) return "bg-yellow-400";
  return "bg-red-500";
};

const Disease = () => {
  const fileInputRef = useRef(null);
  const [disease, setDisease] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const previewURL = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (previewURL) URL.revokeObjectURL(previewURL);
    };
  }, [previewURL]);

  // Refactored API call to be triggerable manually or automatically
  const fetchPrediction = async (file) => {
    if (!file) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);

      const result = await fetch("http://127.0.0.1:5000/predict-disease", {
        method: "POST",
        body: formData,
      });

      const data = await result.json();

      if (data?.all_probabilities) {
        const chart = Object.entries(data.all_probabilities).map(([name, value]) => ({
          name,
          value: value
        }));
        setChartData(chart);
        setDisease({
          disease: data.disease,
          confidence: data.confidence,
        });
      }
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Backend not reaching. Ensure Flask is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  // Automatic trigger on first upload
  const handleNewImage = (file) => {
    setDisease(null); // Clear old results
    setChartData([]);
    setImageFile(file);
    fetchPrediction(file);
  };

  const guide = disease ? DISEASE_GUIDE[disease.disease] : null;

  return (
    <div className="min-h-screen p-8 space-y-8 max-w-6xl mx-auto">
      {/* Hidden input to support the "Change Image" button */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => e.target.files[0] && handleNewImage(e.target.files[0])}
      />

      {!imageFile && (
        <UploadImage onImageReady={handleNewImage} />
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="w-12 h-12 border-4 border-cyan-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 animate-pulse">Analyzing animal health data...</p>
        </div>
      )}

      {imageFile && !loading && (
        <div className="bg-white p-6 rounded-xl shadow-lg border space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <img
                src={previewURL}
                alt="Uploaded animal"
                className="w-full max-h-80 object-cover mt-16 rounded-xl shadow-md"
              />
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="w-full py-3 px-4 text-md font-semibold rounded-xl bg-cyan-900 text-white hover:bg-cyan-800 transition-colors"
                >
                  Change Image
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              {disease ? (
                <>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">Diagnosis Result</p>
                    <h2 className="text-3xl font-semibold text-gray-900">{disease.disease}</h2>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm font-semibold mb-2">
                        <span>Analysis Confidence</span>
                        <span className="text-cyan-700">{disease.confidence}%</span>
                      </div>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full transition-all duration-1000 ${getConfidenceColor(disease.confidence)}`}
                          style={{ width: `${disease.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4">Probability Spread</p>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={8}
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={1500}
                          >
                            {chartData.map((entry) => (
                              <Cell key={entry.name} fill={COLORS[entry.name] || "#cbd5e1"} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2 flex-wrap">
                      {chartData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[item.name] || "#cbd5e1" }} />
                          {item.name} ({item.value}%)
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 italic">
                  Upload an image to see the diagnosis details.
                </div>
              )}
            </div>
          </div>

          {guide && (
            <div className="bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-semibold text-2xl text-gray-800">Veterinary Treatment Guide</h3>
                <span className={`px-4 py-1.5 rounded-lg text-sm font-semibold uppercase tracking-tighter ${severityColor[guide.severity]}`}>
                  {guide.severity}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <section>
                    <h4 className="font-semibold text-cyan-900 flex items-center gap-2">💉 Vaccination Status</h4>
                    <p className="text-gray-600 leading-relaxed">{guide.vaccination}</p>
                  </section>
                  <section>
                    <h4 className="font-semibold text-cyan-900 flex items-center gap-2">💊 Recommended Medicine</h4>
                    <ul className="grid grid-cols-1 gap-2 mt-2">
                      {guide.medicine.map((med, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm bg-blue-50 text-blue-800 px-3 py-2 rounded-lg border border-blue-100">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> {med}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
                <div className="space-y-4">
                  <section>
                    <h4 className="font-semibold text-cyan-900 flex items-center gap-2">🌾 Feed & Nutrition</h4>
                    <p className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-100">{guide.feed}</p>
                  </section>
                  <section>
                    <h4 className="font-semibold text-cyan-900 flex items-center gap-2">🛡️ Isolation & Precaution</h4>
                    <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg border border-red-100">{guide.isolation}</p>
                  </section>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Disease;