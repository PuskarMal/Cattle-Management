import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 

const UploadImage = () => {
    const fileInputRef = useRef(null);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(); //sujit
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const analyzeImage = () => {
        if (!imageFile) {
            alert("Please upload an image first");
            return;
        }
        navigate("/analytics", { state: { imageFile } });
    };
    return (
        <div>
            {!preview && (
                <div>
                    <span className="text-xl font-semibold mb-6" data-i18n="uploadphoto">{t("uploadphoto")}</span>
                    <button className="opacity-70 text-xl cursor-pointer hover:opacity-100 py-4"
                        title="Listen">🔊</button>
                    <div
                        className="bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-300 transition duration-300 hover:border-primary-green group relative"
                        onClick={() => fileInputRef.current.click()}>

                        <div className="flex flex-col items-center justify-center text-center">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-gray-400 group-hover:text-primary-green mb-3"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                                strokeLinecap="round" strokeLinejoin="round">
                                <path
                                    d="M4 14.9V8.5a2.5 2.5 0 0 1 2.5-2.5h11a2.5 2.5 0 0 1 2.5 2.5v11a2.5 2.5 0 0 1-2.5 2.5H6.5a2.5 2.5 0 0 1-2.5-2.5V14.9" />
                                <path d="m14 17-2-2-2 2" />
                                <path d="M12 15.5V9" />
                                <rect x="18" y="3" width="3" height="3" rx="1" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700" data-i18n="dragdrop">{t("dragdrop")}
                            </span>
                            <button className="opacity-70 text-xl cursor-pointer hover:opacity-100"
                                title="Listen">🔊</button>
                            <span className="text-xs text-gray-500 mb-4" data-i18n="limit">{t("limit")}</span>
                            <button className="opacity-70 text-xl cursor-pointer hover:opacity-100"
                                title="Listen">🔊</button>
                            <span
                                className="py-2 px-4 text-sm cursor-pointer font-semibold rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-150"
                            >
                                {t("upload")}
                            </span>
                            <button className="opacity-70 text-xl cursor-pointer hover:opacity-100"
                                title="Listen">🔊</button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>


                        <div className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                            title="Maximum file size is 200MB">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </div>
                    </div>
                </div>)}

            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 rounded-lg shadow-md"
                />
            )}



            <span id="analyze-button" data-i18n="analysis"
                className="mt-6 w-full py-3 border-2 flex cursor-pointer items-center text-white bg-cyan-900 hover:bg-cyan-700 border-sky-600 justify-center rounded-lg transition duration-200 font-semibold shadow-xl hover:shadow-2xl"
                onClick={analyzeImage}>

                {t("analyze")}
            </span>
            <button className="opacity-70 text-xl cursor-pointer hover:opacity-100"
                title="Listen">🔊</button>



            <div id="feedback-message" className="mt-4 text-sm text-center text-gray-600 hidden"></div>


        </div>
    )
};
export default UploadImage;