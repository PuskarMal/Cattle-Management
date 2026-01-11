import React, { useState } from "react";
import UploadImage from "../components/UploadImage/UploadImage";
const RegisterCattle = () => {
  const [formData, setFormData] = useState({
    species: "",
    breed: "",
    gender: "",
    dob: "",
    avgMilkYield: "",
    vaccinationStatus: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) =>
      data.append(key, formData[key])
    );
    data.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/register-cattle", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      alert("Cattle registered successfully!");
      console.log(result);
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Register Cattle
      </h1>
      <UploadImage/>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 space-y-6"
      >
        {/* Species & Breed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="species"
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          >
            <option value="">Select Species</option>
            <option value="Cow">Cow</option>
            <option value="Buffalo">Buffalo</option>
          </select>

          <input
            type="text"
            name="breed"
            placeholder="Breed"
            className="border rounded-lg p-3"
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender & DOB */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="gender"
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          >
            <option value="">Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>

          <input
            type="date"
            name="dob"
            className="border rounded-lg p-3"
            onChange={handleChange}
            required
          />
        </div>

        {/* Milk Yield & Vaccination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            name="avgMilkYield"
            placeholder="Avg Milk Yield (LPD)"
            className="border rounded-lg p-3"
            onChange={handleChange}
          />

          <select
            name="vaccinationStatus"
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option value="">Vaccination Status</option>
            <option value="Up to date">Up to date</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Location */}
        <input
          type="text"
          name="location"
          placeholder="Village / District / State"
          className="border rounded-lg p-3 w-full"
          onChange={handleChange}
          required
        />

        
        

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-primary-green text-white rounded-lg font-semibold hover:bg-secondary-green transition"
        >
          Register Cattle
        </button>
      </form>
    </div>
  );
};

export default RegisterCattle;
