import React from "react";
import CattleNode from "./CattleNode";

const PedigreeNode = ({ cattle, level = 0, maxLevel = 3 }) => {
  if (!cattle || level > maxLevel) return null;

  return (
    <div className="flex flex-col items-center gap-10">
      {/* parents */}
      {(cattle.sire || cattle.dam) && (
        <div className="flex gap-16">
          <PedigreeNode cattle={cattle.sire} level={level + 1} maxLevel={maxLevel} />
          <PedigreeNode cattle={cattle.dam} level={level + 1} maxLevel={maxLevel} />
        </div>
      )}

      {/* current */}
      <CattleNode cattle={cattle} highlight={level === 0} />
    </div>
  );
};

export default PedigreeNode;
