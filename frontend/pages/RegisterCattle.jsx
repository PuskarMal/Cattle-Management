import React, { useState, useRef, useEffect } from "react";
import axios from "axios"
import statedistricts from "../src/data/statedistricts.json";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const RegisterCattle = () => {
  const [dob, setDob] = useState("");
  const [submit, setSubmit] = useState(false);
  const [analysisMode, setAnalysisMode] = useState(false);
  const [result, setResult] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [breedDetails, setBreedDetails] = useState(null);
  const [state, setState] = useState("");
  const [disease, setDisease] = useState(null)
  const [district, setDistrict] = useState("");
  const [owner, setOwner] = useState(null)
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    animal_tag_id: "",
    name: "",
    species: "Cow",
    breed_name: "",
    age_in_months: "",
    gender: "Female",
    state: "",
    district: "",
    address: "",
    milk_production: {
      average_yield_lpd: "",
      fat_percentage: ""
    },
    health_status: {
      current_condition: "",
      last_vaccination_date: ""
    },
    unique_id: "",
    image_id: ""
  });
  const breeds = [
    "Alambadi", "Amritmahal", "Ayrshire", "Banni", "Bargur", "Bhadawari",
    "Brown_Swiss", "Dangi", "Deoni", "Gir", "Guernsey", "Hallikar",
    "Hariana", "Holstein_Friesian", "Jaffrabadi", "Jersey", "Kangayam",
    "Kankrej", "Kasargod", "Kenkatha", "Kherigarh", "Khillari",
    "Krishna_Valley", "Malnad_gidda", "Mehsana", "Murrah", "Nagori",
    "Nagpuri", "Nili_Ravi", "Nimari", "Ongole", "Pulikalam", "Rathi",
    "Red_Dane", "Red_Sindhi", "Sahiwal", "Surti", "Tharparkar", "Toda",
    "Umblacherry", "Vechur"
  ];
  const calculateAgeInMonths = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();

    let months =
      (today.getFullYear() - birthDate.getFullYear()) * 12 +
      (today.getMonth() - birthDate.getMonth());

    return months >= 0 ? months : "";
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("milk_")) {
      setFormData((prev) => ({
        ...prev,
        milk_production: {
          ...prev.milk_production,
          [name.replace("milk_", "")]: value
        }
      }));
    }
    else if (name.startsWith("health_")) {
      setFormData((prev) => ({
        ...prev,
        health_status: {
          ...prev.health_status,
          [name.replace("health_", "")]: value
        }
      }));
    }
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  }
  const handleOwner = (e) => {
    setOwner(e.target.value)
  }
  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    setState(selectedState);
    setDistrict("");
    setFormData((prev) => ({
      ...prev,
      state: selectedState,
      district: ""
    }));
  };
  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("animal_tag_id", formData.animal_tag_id);
    data.append("name", formData.name);
    data.append("species", formData.species);
    data.append("breed_name", formData.breed_name);
    data.append("age_in_months", formData.age_in_months);
    data.append("gender", formData.gender);
    data.append("state", formData.state);
    data.append("district", formData.district);
    data.append("address", formData.address)
    // ✅ STRINGIFY nested objects
    data.append(
      "milk_production",
      JSON.stringify(formData.milk_production)
    );
    data.append(
      "health_status",
      JSON.stringify(formData.health_status)
    );
    // Append image
    if (imageFile) {
      data.append("image", imageFile);
      const res = await axios.post("https://cattle-management-ptz0.onrender.com/register-cattle", data, {
        headers: { ownerid: owner }
      });
      const uniqueId = res.data.unique_id;

      setFormData(prev => ({ ...prev, unique_id: uniqueId }));
      setSubmit(true);

      await downloadReport(uniqueId);
      navigate(`/identify/${uniqueId}`);
    }
  }
  const downloadReport = async (unique_id) => {
    const response = await fetch(
      `https://cattle-management-ptz0.onrender.com/download-report/${unique_id}`
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${unique_id}_report.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  const analyzeImage = async () => {
  if (!imageFile) {
    alert("Please upload an image first");
    return;
  }

  try {

    const breedForm = new FormData();
    breedForm.append("image", imageFile);

    const breedRes = await fetch(
      "https://breed-classification-cs1z.onrender.com/predict-breed",
      {
        method: "POST",
        body: breedForm
      }
    );

    const breedData = await breedRes.json();
    console.log("Breed API:", breedData);

    setResult(breedData);

    if (!breedData.top_predictions?.length) {
      console.error("Breed prediction failed");
      return;
    }

    const diseaseForm = new FormData();
    diseaseForm.append("image", imageFile);

    const diseaseRes = await fetch(
      "https://breed-classification-cs1z.onrender.com/predict-disease",
      {
        method: "POST",
        body: diseaseForm
      }
    );

    const diseaseData = await diseaseRes.json();
    console.log("Disease API:", diseaseData);

    setDisease(diseaseData);

    const breedDetailsRes = await fetch(
      `https://cattle-management-ptz0.onrender.com/predict/fetch_details/${breedData.top_predictions[0].breed}`
    );

    const breedDetail = await breedDetailsRes.json();
    setBreedDetails(breedDetail.description);

  } catch (err) {
    console.error("Analyze image failed:", err);
  }
};
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };
  // 🔹 Cleanup preview URL (important)
  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);
  return (

    <main className="max-w-5xl mx-auto p-6">
      {!submit && (
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Register New Cattle
          </h2>

          <div>
            <div className="flex items-center gap-2 mt-10">
              <span className="text-lg font-semibold text-gray-700 mb-4">{t("uploadphoto")}</span>
              <button onClick={() => speakText("uploadphoto")} className="opacity-70 text-xl">🔊</button>
            </div>

            {!preview && (
              <div
                className="bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-green cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <div className="flex flex-col items-center text-center">
                  <svg className="h-10 w-10 text-gray-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 14.9V8.5a2.5 2.5 0 0 1 2.5-2.5h11a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5H6.5a2.5 2.5 0 0 1-2.5-2.5V14.9" />
                    <path d="m14 17-2-2-2 2" />
                    <path d="M12 15.5V9" />
                  </svg>

                  <p className="text-sm font-medium text-gray-700">{t("dragdrop")}</p>
                  <p className="text-xs text-gray-500 mb-4">{t("limit")}</p>

                  <button
                    type="button"
                    className="py-2 px-4 text-sm font-semibold rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                  >
                    {t("upload")}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            )}

            {preview && (
              <div className="relative overflow-hidden h-[380px] mt-6 rounded-2xl">

                {/* ORIGINAL PREVIEW */}
                <div
                  className={`absolute inset-0 transition-transform duration-700 ease-in-out
      ${analysisMode ? "-translate-x-full" : "translate-x-0"}`}
                >
                  <div className="h-full bg-gray-50 p-6 rounded-2xl border flex flex-col justify-center items-center gap-4">
                    <img
                      src={preview}
                      className="h-44 rounded-xl shadow-md object-contain"
                    />

                    <div className="flex gap-3">
                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="px-4 py-2 text-sm font-medium rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        Change Image
                      </button>

                      <button
                        onClick={() => {
                          setShowOverlay(true);
                          analyzeImage();
                          setAnalysisMode(true);
                          setTimeout(() => setShowOverlay(false), 1800);
                        }}
                        className="px-4 py-2 text-sm font-semibold rounded-full
                       bg-cyan-900 text-white hover:bg-cyan-700"
                      >
                        Analyze Image
                      </button>
                    </div>
                  </div>
                </div>

                {/* ANALYSIS PANEL */}
                <div
                  className={`absolute inset-0 transition-transform duration-700 ease-in-out
      ${analysisMode ? "translate-x-0" : "translate-x-full"}`}
                >
                  <div className="relative h-full rounded-2xl overflow-hidden">

                    {/* BLURRED BACKGROUND */}
                    <div
                      className="absolute inset-0 scale-110 blur-xl"
                      style={{
                        backgroundImage: `url(${preview})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    />

                    {/* DARK OVERLAY */}
                    <div className="absolute inset-0 bg-black/60" />

                    {/* CENTERED IMAGE */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                      <img
                        src={preview}
                        className="h-52 rounded-xl shadow-2xl border border-white/20"
                      />
                    </div>

                    {/* LOADING OVERLAY (TIMED) */}
                    {(showOverlay || !result) && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="w-2/3 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full w-[75%] bg-cyan-400 animate-progress" />
                        </div>
                        <p className="mt-3 text-sm text-white/80">
                          Fetching the results…
                        </p>
                      </div>
                    )}


                    {/* RESULT OVERLAY */}
                    {result && disease && !showOverlay && (
                      <div className="absolute bottom-6 left-6 right-6 z-30 text-white space-y-2">

                        <div className="flex justify-between">
                          <p className="text-2xl font-bold tracking-wide">
                            {result.top_predictions?.[0]?.breed || "Unknown Breed"}
                          </p>
                          <p className=" flex flex-col gap-2">

                            <span
                              className={`inline-block px-3 py-1 rounded-full text-md font-semibold
                            ${result.top_predictions?.[0]?.confidence >= 80
                                  ? "bg-green-500/20 text-green-400"
                                  : result.top_predictions?.[0]?.confidence >= 50
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                            >
                              Breed Confidence: {result.top_predictions?.[0]?.confidence.toFixed(2)}



                            </span>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-md font-semibold
                            ${disease.confidence >= 80
                                  ? "bg-green-500/20 text-green-400"
                                  : disease.confidence >= 50
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                            >
                              Health Status: {disease.disease}



                            </span>
                          </p>
                        </div>

                        <p className="text-md text-white/80 leading-snug">
                          {breedDetails || "Breed characteristics and regional traits."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6 mt-8"
          >
            {/* Basic Info */}
            <section>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div> {/* Animal Tag ID */}
                  <p className="pb-2">Ear Tag ID</p>
                  <input
                    name="animal_tag_id"
                    placeholder="Ear Tag ID"
                    className="w-full p-2 border border-gray-300 rounded-lg
         focus:outline-none focus:ring-1 focus:ring-green-200
         bg-white text-gray-800"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div> {/* Name */}
                  <p className="pb-2">Name</p>
                  <input
                    name="name"
                    placeholder="Optional"
                    className="w-full p-2 border border-gray-300 rounded-lg
         focus:outline-none focus:ring-1 focus:ring-green-200
         bg-white text-gray-800"
                    onChange={handleChange}
                  />
                </div>
                <div> {/* Species */}
                  <p className="pb-2">Species Name</p>
                  <select
                    name="species"
                    className="w-full p-2 border border-gray-300 rounded-lg
         focus:outline-none focus:ring-1 focus:ring-green-200
         bg-white text-gray-800"
                    onChange={handleChange} defaultValue="Select Species" required
                  >
                    <option>Cow</option>
                    <option>Buffalo</option>
                  </select>
                </div>
                <div> {/* Breed Name */}
                  <p className="pb-2">Breed Name</p>
                  <input
                    list="breedList"
                    name="breed_name"
                    placeholder="Type or select breed"
                    className="w-full p-2 border border-gray-300 rounded-lg
         focus:outline-none focus:ring-1 focus:ring-green-200
         bg-white text-gray-800"
                    onChange={handleChange}
                    required
                  />

                  <datalist id="breedList">
                    {breeds.map((breed) => (
                      <option key={breed} value={breed} />
                    ))}
                  </datalist>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* DOB and Age */}
                  <p>Date of Birth</p>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => {
                      const selectedDob = e.target.value;
                      setDob(selectedDob);

                      const ageMonths = calculateAgeInMonths(selectedDob);

                      setFormData((prev) => ({
                        ...prev,
                        age_in_months: ageMonths
                      }));
                    }}
                    required
                  />

                  <p>Age (months)</p>
                  <input
                    type="number"
                    name="age_in_months"
                    value={calculateAgeInMonths(dob)}
                    className="w-full px-4 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-1 focus:ring-green-200
              bg-white text-gray-800 cursor-not-allowed"
                    readOnly
                    placeholder=""
                  />
                </div>
                <div> {/* Gender */}
                  <p className="pb-2">Gender</p>
                  <select
                    name="gender"
                    className="w-full p-2 border border-gray-300 rounded-lg
         focus:outline-none focus:ring-2 focus:ring-primary-green
         bg-white text-gray-800"
                    onChange={handleChange}
                  >
                    <option>Female</option>
                    <option>Male</option>
                  </select>
                </div>
                <div> {/* State */}
                  <p className="pb-2">State</p>
                  <select
                    value={state}
                    onChange={handleStateChange}
                    className="w-full p-2 border border-gray-300 rounded-lg
         focus:outline-none focus:ring-1 focus:ring-green-200
         bg-white text-gray-800"
                  >
                    <option value="">Select State</option>
                    {Object.keys(statedistricts).map((stateName) => (
                      <option key={stateName} value={stateName}>
                        {stateName}
                      </option>
                    ))}
                  </select>


                </div>
                <div> {/* District */}
                  <p className="pb-2">District</p>
                  <select
                    value={district}
                    onChange={handleDistrictChange}
                    disabled={!state}
                    className="w-full p-2 border border-gray-300 rounded-lg
         focus:outline-none focus:ring-1 focus:ring-green-200
         bg-white text-gray-800"
                  >
                    <option value="">Select District</option>
                    {state &&
                      statedistricts[state].map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                  </select>

                </div>
              </div>
            </section>
            {/* Owner Info */}
            <section>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Owner Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div> {/* Owner AADHAR ID */}
                  <p className="pb-2">Owner AADHAR ID</p>
                  <input
                    name="owner_id"
                    placeholder="Owner AADHAR ID"
                    className="w-full p-2 border border-gray-300 rounded-lg
         focus:outline-none focus:ring-1 focus:ring-green-200
         bg-white text-gray-800"
                    onChange={handleOwner}
                    required
                  />
                </div>

                <div>
                  <p className="pb-2">Current Address</p>
                  <input
                    name="address"
                    placeholder="Current Address of the Cattle"
                    className="w-full p-2 border border-gray-300 rounded-lg
         focus:outline-none focus:ring-1 focus:ring-green-200
         bg-white text-gray-800"
                    onChange={handleChange}
                  />
                </div>

              </div>
            </section>
            {/* Milk Production */}
            <section>
              <h2 className="text-lg font-semibold text-gray-700 mb-4"
              >
                Milk Production
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="pb-2">Average Milk Yield (LPD)</p>
                  <input
                    name="milk_average_yield_lpd"
                    type="number"
                    step="0.1"
                    placeholder="Litres of milk produced daily"
                    className="w-full p-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-1 focus:ring-green-200
              bg-white text-gray-800"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p className="pb-2">Fat Percentage (%)</p>
                  <input
                    name="milk_fat_percentage"
                    type="number"
                    step="0.1"
                    placeholder="Percentage of fat in milk"
                    className="w-full p-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-1 focus:ring-green-200
            bg-white text-gray-800"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>
            {/* Submit */}
            {!submit && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="cursor-pointer px-6 py-2 rounded-lg  text-white bg-cyan-900 hover:bg-cyan-700 border-sky-600 font-semibold hover:bg-secondary-green transition"
                >
                  Register Cattle
                </button>
              </div>
            )}
          </form>
        </div>
      )}

    </main>
  );
};

export default RegisterCattle;
