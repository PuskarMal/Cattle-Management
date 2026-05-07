
import React from "react";
import { useNavigate } from "react-router-dom";

const CattleNode = ({ cattle, highlight = false }) => {
  const navigate = useNavigate();
  if (!cattle) return null;

  return (
    <div
      onClick={() => navigate(`/cattle/${cattle.unique_id}`)}
      className={`group relative flex flex-col items-center cursor-pointer
        transition transform hover:scale-105`}
    >
      {/* Glow ring for elite / selected */}
      {highlight && (
        <div className="absolute w-28 h-28 rounded-full bg-green-400 blur-xl opacity-30" />
      )}

      <img
        src={`http://localhost:3000/cattle_image/${cattle.image_id}`}
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

const ArrowLayer = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none">
    <defs>
      <marker
        id="arrow"
        markerWidth="10"
        markerHeight="10"
        refX="8"
        refY="5"
        orient="auto"
      >
        <polygon points="0 0, 10 5, 0 10" fill="#9CA3AF" />
      </marker>
    </defs>

    {/* left parent arrow */}
    <line
      x1="30%"
      y1="35%"
      x2="50%"
      y2="65%"
      stroke="#9CA3AF"
      strokeWidth="2"
      markerEnd="url(#arrow)"
      className="animate-draw"
    />

    {/* right parent arrow */}
    <line
      x1="70%"
      y1="35%"
      x2="50%"
      y2="65%"
      stroke="#9CA3AF"
      strokeWidth="2"
      markerEnd="url(#arrow)"
      className="animate-draw"
    />
  </svg>
);

const FamilyTree = ({ tree }) => {
  if (!tree) return null;

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden">

      {/* blurred background using calf image */}
      <div
        className="absolute inset-0 blur-2xl scale-110 opacity-25"
        style={{
          backgroundImage: `url(http://localhost:3000/cattle_image/${tree.image_id})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* glass overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />

      {/* arrow layer */}
      <ArrowLayer />

      {/* grid layout */}
      <div className="relative grid grid-cols-3 grid-rows-2 h-full p-10">

        {/* sire */}
        <div className="flex justify-center items-start">
          <CattleNode cattle={tree.sire} />
        </div>

        {/* spacer */}
        <div />

        {/* dam */}
        <div className="flex justify-center items-start">
          <CattleNode cattle={tree.dam} />
        </div>

        {/* center calf */}
        <div className="col-span-3 flex justify-center items-end">
          <CattleNode cattle={tree} highlight />
        </div>
      </div>
    </div>
  );
};


export default FamilyTree;
