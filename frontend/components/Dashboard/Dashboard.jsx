import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next"; //sujit
import { useNavigate } from "react-router-dom"
import { ImCheckmark } from "react-icons/im";
import SpeakerButton from '../Speaker/Speaker'; //Sujit
import UploadImage from '../UploadImage/UploadImage';


const Dashboard = () => {
    const { t, i18n } = useTranslation(); //sujit  
    const navigate = useNavigate()
    const [activities, setActivities] = useState([])
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch("http://localhost:3000/recent-activity");
                const data = await res.json();
                setActivities(data);
            } catch (err) {
                console.error("Failed to fetch activities:", err);
            }
        };
        fetchActivities();
    }, []);
    return (
        <main id="main-content" className="w-full p-8 bg-gray-100">


            <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900" data-i18n="head">
                            {t("head")}                         {/*Sujit*/}
                        </h1>
                        <SpeakerButton textKey="head" />        {/*Sujit*/}
                    </div>


                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:items-center gap-6">


                        <div className="md:w-3/5 space-y-5">


                            <div className="flex items-start gap-2">
                                <p className="text-gray-700 text-justify max-w-xl leading-relaxed text-sm md:text-base" data-i18n="desc">
                                    {t("longtext")}
                                </p>
                                <SpeakerButton textKey="longtext" />
                            </div>


                            <div className="flex flex-wrap gap-2 text-xs">
                                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                                    Offline-first Architecture
                                </span>
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                    AI-driven Decision Support
                                </span>
                                <span
                                    className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                                    Government Guideline Aligned
                                </span>
                                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                    Farmer-friendly UX
                                </span>
                            </div>


                            <ul className="space-y-3 text-gray-700 text-sm">

                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5"><ImCheckmark /></span>
                                    <span data-i18n="d1">
                                        {t("f1")}
                                    </span>
                                    <button className="opacity-70 text-lg hover:opacity-100"
                                        title="Listen">🔊</button>
                                </li>

                                <li className="flex items-start gap-2">
                                    <span className="text-green-600"><ImCheckmark /></span>
                                    <span data-i18n="d2">
                                        {t("f2")}
                                    </span>
                                    <button className="opacity-70 text-lg hover:opacity-100"
                                        title="Listen">🔊</button>
                                </li>

                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5"><ImCheckmark /></span>
                                    <span data-i18n="d3">
                                        {t("f3")}
                                    </span>
                                    <button className="opacity-70 text-lg hover:opacity-100"
                                        title="Listen">🔊</button>
                                </li>

                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-0.5"><ImCheckmark /></span>
                                    <span>
                                        {t("f4")}
                                    </span>
                                </li>

                            </ul>
                        </div>


                        <div className="md:w-2/5 mt-6 md:mt-0 flex justify-end">
                            <div
                                className="w-full rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white">
                                <img src="https://thumbs.dreamstime.com/b/farmer-milking-cow-village-india-koriya-chhattisgarh-india-farmer-taking-out-milk-mother-s-cow-udder-270282390.jpg"
                                    alt="Rural dairy farming in India" className="w-full h-64 object-cover" />
                                <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t">
                                    {t("caption")}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <UploadImage onImageReady={(file) =>
                        navigate("/analytics", { state: { imageFile: file } })
                    } />


                    <div id="feedback-message" className="mt-4 text-sm text-center text-gray-600 hidden"></div>
                </div>
                <section className="space-y-4">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {t("recentactivity")}
                        </h2>
                        <a
                            href="/activity"
                            className="text-sm text-green-600 hover:underline font-medium"
                        >
                            {t("viewall")}
                        </a>
                    </div>

                    {/* Activity List */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y">

                        {activities.map((activity, index) => (
                            <div
                                key={index}
                                className="p-4 flex items-start gap-4 hover:bg-gray-50 transition"
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-green-100 text-green-600">
                                        ➕
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1">

                                    {/* Action */}
                                    <p className="text-sm font-medium text-gray-800">
                                        {activity.action === "CATTLE_REGISTERED"
                                            ? "Cattle Registered"
                                            : activity.action === "REPORT_GENERATED"
                                                ? "Health Report Generated"
                                                : activity.action === "CATTLE_UPDATED"
                                                    ? "Cattle Details Updated"
                                                    : activity.action}
                                    </p>

                                    {/* Metadata */}
                                    <p className="text-md text-gray-500">
                                        {activity.metadata?.breed || "No description available"}
                                    </p>
                                </div>

                                {/* Entity ID Badge */}
                                {activity.entityId?.unique_id && (
                                    <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                                        #{activity.entityId.unique_id}
                                    </span>
                                )}
                            </div>
                        ))}

                    </div>
                </section>


            </div>


        </main>
    )
}

export default Dashboard