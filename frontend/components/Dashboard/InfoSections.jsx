import { ImCheckmark, ImVolumeHigh, ImFileText, ImStatsBars } from "react-icons/im";
import React, { useState, useEffect } from "react";
import axios from "axios";
const InfoSections = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/reports").then(res => setReports(res.data));
  }, [])
  return (
    <section className="mt-16 space-y-16 ">

      {/* HOW IT WORKS */}
      <section className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {[
            "Upload cattle image",
            "AI analyzes health indicators",
            "Report is generated",
            "Take informed action"
          ].map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 shadow-sm border
        hover:-translate-y-1 hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-green-600 text-white font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <p className="text-sm text-gray-700">{step}</p>
            </div>
          ))}
        </div>
      </section>


      {/* GOVERNMENT ADVISORY */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50
border-l-4 border-green-600 rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-green-900 mb-4">
          Government Advisory Alignment
        </h2>

        <ul className="space-y-3 text-sm text-green-900">
          {[
            "Aligned with veterinary disease reporting norms",
            "Supports vaccination and preventive care advisories",
            "Breed-specific recommendations for Indian cattle"
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <ImCheckmark className="mt-1 text-green-700" />
              {item}
            </li>
          ))}
        </ul>
      </section>


      {/* FARMER BENEFITS */}
      <section className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg border">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">
          Farmer Benefits & Impact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            "Early disease detection",
            "Reduced veterinary cost",
            "Faster decision-making",
            "Improved cattle productivity"
          ].map((benefit, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border
        hover:shadow-md transition text-center"
            >
              <ImStatsBars className="mx-auto text-2xl text-green-600 mb-3" />
              <p className="text-sm text-gray-700">{benefit}</p>
            </div>
          ))}
        </div>
      </section>


      {/* SAVED / RECENT REPORTS */}
      <section className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg border">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Saved / Recent Reports
        </h2>

        <div className="divide-y rounded-xl border bg-white">
          {reports.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 text-center">
              No reports saved yet.
            </p>
          ) : (
            reports.slice(0, 3).map((r, i) => (
              <div
                key={i}
                className="p-4 flex justify-between items-center hover:bg-green-50 hover:rounded-xl transition"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {r.name || "Health Report"}
                  </p>
                  <p className="text-xs text-gray-500">{r.date}</p>
                </div>
                <ImFileText className="text-xl text-green-600" />
              </div>
            ))
          )}
        </div>
      </section>


      {/* ACCESSIBILITY & VOICE */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100
rounded-2xl p-8 border shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Accessibility & Voice Support
        </h2>

        <p className="text-sm text-gray-700 mb-4">
          Designed for low-literacy and multilingual users.
          Tap the speaker icon to listen to instructions and reports.
        </p>

        <div className="flex items-center gap-3 text-green-700 text-sm">
          <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center">
            <ImVolumeHigh />
          </div>
          Voice-assisted navigation available across the app
        </div>
      </section>


    </section>
  );
}
export default InfoSections;