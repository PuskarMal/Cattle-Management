import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ImCheckmark } from "react-icons/im";
import UploadImage from "../UploadImage/UploadImage";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("https://cattle-management-ptz0.onrender.com/recent-activity");
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchActivities();
  }, []);

  const handleVideoProgress = (e) => {
    const progress = e.target.currentTime / e.target.duration;
    if (progress > 0.82) setShowContent(true);
  };

  return (
    <main className="w-full p-3 bg-gray-100">

  {/* ================= HERO SECTION ================= */}
  <div className="relative w-full min-h-[60vh] md:min-h-[50vh] lg:min-h-[55vh] overflow-hidden lg:mb-12 mb-2">

    {/* Video */}
    <video
      src="/OIG2.mp4"
      autoPlay
      muted
      playsInline
      onTimeUpdate={handleVideoProgress}
      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000
      ${showContent ? "scale-110 blur-sm brightness-75" : ""}`}
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-white/10"></div>

    {/* Content */}
    <div
      className={`relative z-10 mx-auto max-w-4xl pb-1
      p-5 sm:p-6 md:p-8 lg:p-10
      text-white
      
      
      transition-all duration-1000
      ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >

      {/* Heading */}
      <h1
        className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3
        bg-gradient-to-r from-green-300 via-emerald-400 to-lime-300
        bg-[length:200%_auto] bg-clip-text text-transparent
        animate-[shimmer_4s_linear_infinite] underline"
      >
        {t("head")}
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed max-w-3xl">
        {t("longtext")}
      </p>

      {/* Feature Chips */}
      <div className="flex flex-wrap gap-2 mt-5 text-xs sm:text-sm">
        {[
          "Offline-first Architecture",
          "AI-driven Decision Support",
          "Government Guideline Aligned",
          "Farmer-friendly UX",
        ].map((item, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-full bg-white/20 border border-white/30
            backdrop-blur-md whitespace-nowrap
            animate-[float_4s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Checklist */}
      <ul className="mt-6 space-y-2 sm:space-y-3 text-xs sm:text-sm">
        {[t("f1"), t("f2"), t("f3"), t("f4")].map((text, i) => (
          <li
            key={i}
            className="flex items-start gap-2 transition hover:translate-x-1"
          >
            <span className="text-green-400 animate-pulse">
              <ImCheckmark />
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* ================= MAIN GRID ================= */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-3 lg:px-10 lg:gap-10">

    {/* Upload */}
    <div className="w-full pt-3">
      <UploadImage
        onImageReady={(file) =>
          navigate("/analytics", { state: { imageFile: file } })
        }
      />
    </div>

    {/* Recent Activity */}
    <section className="space-y-4 pb-5">
      <div className="flex items-center justify-between ">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {t("recentactivity")}
        </h2>
        <a
          href="/activity"
          className="text-xs sm:text-sm text-green-600 hover:underline"
        >
          {t("viewall")}
        </a>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="p-3 sm:p-4 flex items-start gap-3 sm:gap-4
            transition-all duration-300 hover:bg-green-50 hover:scale-[1.01]"
          >

            <div className="flex-shrink-0">
              <span
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center
                rounded-full bg-green-100 text-green-600"
              >
                ➕
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-sm text-gray-800 truncate">
                {activity.action === "CATTLE_REGISTERED"
                  ? "Cattle Registered"
                  : activity.action === "REPORT_GENERATED"
                  ? "Health Report Generated"
                  : activity.action === "CATTLE_UPDATED"
                  ? "Cattle Details Updated"
                  : activity.action}
              </p>

              <p className="text-xs sm:text-sm text-gray-500 truncate">
                {activity.metadata?.breed || "No description"}
              </p>
            </div>

            {activity.entityId?.unique_id && (
              <span className="text-xs bg-gray-500 px-2 py-1 rounded-lg whitespace-nowrap">
                #{activity.entityId.unique_id}
              </span>
            )}
          </div>
        ))}

      </div>
    </section>
  </div>
</main>
  );
};

export default Dashboard;
