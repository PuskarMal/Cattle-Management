import React from 'react'
import { useTranslation } from "react-i18next"; //sujit

import { ImCheckmark } from "react-icons/im";
import SpeakerButton from '../Speaker/Speaker'; //Sujit
import UploadImage from '../UploadImage/UploadImage';

const Dashboard = () => {
    const { t, i18n } = useTranslation(); //sujit    
    return (
        <main id="main-content" className="w-full lg:w-3/4 p-8 bg-gray-100">


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
                                <button className="opacity-70 text-xl hover:opacity-100" 
                                    title="Listen">🔊</button>
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
                <UploadImage />
                <section className="space-y-4 mt-4">


                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 cursor-pointer">
                            {t("recentactivity")}
                        </h2>
                        <a href="/activity.html" className="text-sm cursor-pointer text-primary-green hover:underline">
                            {t("viewall")}
                        </a>
                    </div>


                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y">


                        <div className="p-4 flex items-start gap-3">
                            <span className="text-green-600 text-lg">➕</span>
                            <div>
                                <p className="text-sm text-gray-800">
                                    {t("newanimalregistered")}
                                </p>
                                <p className="text-xs text-gray-500 hover-underline cursor-pointer hover:text-blue-500">
                                    C100669110
                                </p>
                            </div>
                        </div>

                        <div className="p-4 flex items-start gap-3">
                            <span className="text-blue-600 text-lg">📷</span>
                            <div>
                                <p className="text-sm text-gray-800">
                                    {t("animalidentified")}
                                </p>
                                <p className="text-xs text-gray-500">
                                    C100578424
                                </p>
                            </div>
                        </div>

                        <div className="p-4 flex items-start gap-3">
                            <span className="text-purple-600 text-lg">🧬</span>
                            <div>
                                <p className="text-sm text-gray-800">
                                    {t("genetictestcompleted")}
                                </p>
                                <p className="text-xs text-gray-500">
                                    M500677384
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
            

        </main>
    )
}

export default Dashboard