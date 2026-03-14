import React from "react";
import { useNavigate } from "react-router-dom";

const CattleNode = ({ cattle, highlight = false }) => {
  const navigate = useNavigate();
  if (!cattle) return null;

  return (
    <div
      onClick={() => navigate(`/cattle-profile/${cattle.unique_id}`)}
      className="relative flex flex-col items-center cursor-pointer transition hover:scale-105"
    >
      {highlight && (
        <div className="absolute w-28 h-28 rounded-full bg-yellow-200 blur-xl opacity-30" />
      )}

      <img
        src={`https://cattle-management-ptz0.onrender.com/cattle_image/${cattle.image_id}`}
        alt={cattle.name}
        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
      />

      <div className="mt-2 text-center bg-white/90 backdrop-blur px-3 py-1 rounded-xl shadow-md">
        <p className="font-semibold text-sm">{cattle.name}</p>
        <p className="text-xs text-gray-500">{cattle.unique_id}</p>
        <p className="text-xs text-gray-600">{cattle.breed_name}</p>
      </div>
    </div>
  );
};

export default CattleNode;
