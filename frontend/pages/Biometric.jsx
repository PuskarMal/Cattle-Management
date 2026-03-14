import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import demo from "../src/assets/demo.jpg"

export default function Biometric() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null)
  const [iden, setIden] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();


  const handleSubmit = async () => {
    if (!image) {
      alert("Upload muzzle image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);



    try {
      setLoading(true);

      const res = await axios.post(
        `https://cattle-management-ptz0.onrender.com/link-biometric/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );


      alert(res.data.message);
    } catch (err) {
      alert("Biometric linking failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = async () => {
    const formData = new FormData();
    formData.append("image", image);

    const res = await axios.post(
      "https://cattle-management-ptz0.onrender.com/verify-biometric",
      formData
    );

    alert(
      res.data.verified
        ? `Verified: ${res.data.cattle.unique_id}`
        : "Verification failed"
    );
    navigate(`/cattle-profile/${res.data.cattle.unique_id}`)
  };
    const handleVerifyID = async () => {
    
    const res = await axios.get(
      `https://cattle-management-ptz0.onrender.com/fetch-cattle-profile/${iden}`,
      
    );

    
    navigate(`/cattle-profile/${iden}`)
  };


  return (
    <div className="min-h-screen bg-gray-50 p-10">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">

    {/* ================= BIOMETRIC CARD ================= */}
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">
        Biometric Registration & Verification
      </h2>

      <div className="flex flex-col gap-4">

        {/* File Input */}
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Upload Muzzle Image
          </span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
            className="mt-1 block w-full text-sm 
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </label>

        {/* Preview */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Preview</p>
            {preview ? (
              <img
                src={preview}
                className="h-40 w-full object-cover rounded-lg border"
              />
            ) : (
              <div className="h-40 flex items-center justify-center border rounded-lg text-gray-400">
                No image selected
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Demo Image</p>
            <img
              src={demo}
              className="h-40 w-full object-cover rounded-lg border"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleVerify}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-green-600 
                       text-white font-medium hover:bg-green-700
                       disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Biometric"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 
                       text-white font-medium hover:bg-blue-700
                       disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Biometric"}
          </button>
        </div>
      </div>
    </div>

    {/* ================= ID VERIFICATION CARD ================= */}
    {!id && (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Verification by Unique ID
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Cattle Unique ID"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => {setIden(e.target.value)}}
          />

          <button
            onClick={handleVerifyID}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 
                       text-white font-medium hover:bg-blue-700
                       disabled:opacity-50"
          >
            {loading ? "Processing..." : "Verify ID"}
          </button>

          <p className="text-sm text-gray-500">
            Use this option if biometric verification is unavailable.
          </p>
        </div>
      </div>
    )}

  </div>
</div>
  )
}
