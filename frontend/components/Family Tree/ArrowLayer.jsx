import React from 'react';
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

    {/* parents to center */}
    <line x1="35%" y1="28%" x2="50%" y2="45%" stroke="#9CA3AF" strokeWidth="1" />
    <line x1="65%" y1="28%" x2="50%" y2="45%" stroke="#9CA3AF" strokeWidth="1" />

    
  </svg>
);

export default ArrowLayer;
