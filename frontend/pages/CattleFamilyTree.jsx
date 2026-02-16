import React from "react";


import CattleNode from "../components/Family Tree/CattleNode";
import ArrowLayer from "../components/Family Tree/ArrowLayer";

const FamilyTree = ({ tree }) => {
  if (!tree) return null;
  

  return (
    <div className="relative w-full min-h-[520px] rounded-2xl overflow-hidden p-10">

      {/* blurred background */}
      <div
        className="absolute inset-0 blur-2xl scale-110 opacity-25"
        style={{
          backgroundImage: `url(http://localhost:3000/cattle_image/${tree.image_id})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />

      <ArrowLayer />

      <div className="relative flex flex-col items-center gap-12">

        {/* parents */}
        <div className="flex gap-24">
          {tree.sire && <CattleNode cattle={tree.sire} />}
          {tree.dam && <CattleNode cattle={tree.dam} />}
        </div>

        {/* current */}
        <CattleNode cattle={tree} highlight />

        {/* children */}
        {tree.children?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-12 mt-6">
            {tree.children.map((child) => (
              <CattleNode key={child.unique_id} cattle={child} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};




export default FamilyTree;
