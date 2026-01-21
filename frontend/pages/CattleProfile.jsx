import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import { useParams } from "react-router-dom";

const CattleProfile = () => {
  const unique_id = useParams();

  const [cattle, setCattle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCattleProfile = async () => {
      try {
  
        const res = await axios.get(
          `http://localhost:3000/fetch-cattle-profile/${unique_id.id}`
        );

        setCattle(res.data);
      } catch (err) {
        setError("Failed to load cattle profile. Check the Cattle ID.");
      } finally {
        setLoading(false);
      }
    };


    fetchCattleProfile();

  }, [unique_id]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="max-w-5xl min-h-screen mx-auto p-6 text-center">
        <p className="text-gray-500">Loading cattle profile…</p>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <div className="max-w-5xl min-h-screen mx-auto p-6 text-center text-red-600">
        <p>{error}</p>
        <button className="bg-gray-400 text-white rounded px-4 py-1 mt-4 cursor-pointer"
        onClick={() => navigate("/identify")}>
          Back
        </button>
      </div>
    );
  }

  /* ---------------- NO DATA ---------------- */
  if (!cattle) {
    return (
      <div className="max-w-5xl min-h-screen mx-auto p-6 text-center text-gray-500">
        No cattle data found
      </div>
    );
  }

  /* ---------------- PROFILE UI ---------------- */
  return (
    <div className="min-h-screen p-5">
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Cattle Profile
        </h2>
          <h1 className="text-2xl font-bold text-gray-800">
            {cattle.name || "Unnamed Cattle"}
          </h1>
          <p className="text-sm text-gray-500">
            Ear Tag ID:{" "}
            <span className="font-medium text-gray-700">
              {cattle.animal_tag_id}
            </span>
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
          Active
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Image & Biometric */}
        <div className="bg-zinc-50 rounded-xl p-4 text-center shadow-sm">

          <img
            src={`http://localhost:3000/cattle_image/${cattle.image_id}`}
            alt="Cattle"
            className="h-48 mx-auto rounded-lg object-cover shadow"
          />


          {cattle.biometric && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Biometric Confidence</p>
              <p
                className={`text-xl font-bold ${cattle.biometric.confidence >= 0.85
                    ? "text-green-600"
                    : cattle.biometric.confidence >= 0.6
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
              >
                {(cattle.biometric.confidence * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="col-span-2 bg-zinc-50 shadow-sm rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Basic Information
          </h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Species" value={cattle.species} />
            <Info label="Breed" value={cattle.breed_name} />
            <Info label="Gender" value={cattle.gender} />
            <Info label="Age" value={`${cattle.age_in_months} months`} />
            <Info label="State" value={cattle.state} />
            <Info label="District" value={cattle.district} />
            <Info label="Adress" value={cattle.address}/>
          </div>
        </div>
      </div>

      {/* Owner & Milk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-zinc-50 shadow-sm rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Owner Information
          </h2>
          <Info label="Name" value={cattle.owner_id.name} />
          <Info label="Phone" value={cattle.owner_id.phone} />
          <Info label="Aadhaar" value={cattle.owner_id.id} />
        </div>

        <div className="bg-zinc-50 shadow-sm rounded-xl p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Milk Production
          </h2>
          <Info
            label="Average Yield"
            value={`${cattle.milk_production.average_yield_lpd || "—"} L/day`}
          />
          <Info
            label="Fat Percentage"
            value={`${cattle.milk_production.fat_percentage || "—"}%`}
          />
        </div>
      </div>
    </div>
    </div>
  );
};

/* ---------- Reusable Info Row ---------- */
const Info = ({ label, value }) => (
  <p className="text-sm">
    <span className="text-gray-500">{label}:</span>{" "}
    <span className="font-medium">{value || "—"}</span>
  </p>
);

export default CattleProfile;
