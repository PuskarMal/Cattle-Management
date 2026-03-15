import React, { useState, useRef, useEffect } from "react";

import { useTranslation } from "react-i18next";

const UploadImage = ({onImageReady}) => {
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const { t } = useTranslation();
  const analyzeImage = () => {
        if (!imageFile) {
            alert("Please upload an image first");
            return;
        }
        onImageReady(imageFile)
        
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
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg text-slate-900 font-semibold">{t("uploadphoto")}</span>
        <button onClick={() => speakText("uploadphoto")} className="opacity-70 text-xl">🔊</button>
      </div>

      {!preview && (
        <div
          className="bg-gray-50 p-10 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-green cursor-pointer"
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
              className="py-2 px-4 text-sm font-semibold rounded-full bg-gray-600 hover:bg-gray-200 hover:text-gray-900 cursor-pointer"
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
        <div className="bg-gray-50 p-6 rounded-xl border text-center">
          <img src={preview} alt="Preview" className="max-h-60 mx-auto rounded-lg shadow-md" />
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => fileInputRef.current.click()}
              className="py-2 px-4 text-sm font-semibold rounded-full bg-cyan-900 text-white hover:bg-cyan-700"
            >
              Change Image
            </button>
            <button
              onClick={analyzeImage}
              className="px-4 py-2 text-sm font-semibold rounded-full
                       bg-cyan-900 text-white hover:bg-cyan-700"
            >
              Analyze Image
            </button>
            
          </div>
          <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
        </div>
      )}
    </div>
  );
};

export default UploadImage;
