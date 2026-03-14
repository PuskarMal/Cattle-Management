import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const MyCattle = () => {
  const [cattle, setCattle] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get('https://cattle-management-ptz0.onrender.com/my-cattle',{
      headers: {
        id: `${localStorage.getItem('id')}`
      }
    }).then(res => setCattle(res.data));
  });

  return (
    <div className="p-8 min-h-screen max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
        My Cattle
      </h2>
      <div className="grid grid-cols-3 gap-6">
        {cattle.map(c => (
          <div
            key={c._id}
            onClick={() => navigate(`/cattle-profile/${c.unique_id}`)}
            className="cursor-pointer bg-white p-4 rounded-xl shadow hover:shadow-lg"
          >
            <img
              src={`https://cattle-management-ptz0.onrender.com/cattle_image/${c.image_id}`}
              className="w-full h-40 object-cover rounded"
            />
            <p className="font-semibold mt-2">{c.unique_id}</p>
            <p className="text-sm text-gray-500">{c.breed_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCattle;
