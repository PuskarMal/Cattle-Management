import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
const Activity = () => {
  const [activities, setActivities] = useState([])
    const navigate = useNavigate();
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:3000/activity");
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="p-8 min-h-screen">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Activities
        </h2>
        <ul className="space-y-4" >
          {activities.map((activity) => (
            <li key={activity._id} className="mb-4 p-4 border rounded shadow-sm cursor-pointer" onClick={() => navigate(`/cattle-profile/${activity.entityId.unique_id || ""}`)}>
              <div className="font-medium">{activity.action} - {activity.entityId?.unique_id || ""}</div>
              <div className="text-sm text-gray-600">{activity.metadata?.breed || "No description available"}</div>
              <div className="text-xs text-gray-500 mt-1">{activity.createdAt}</div>
            </li>
          ))}
        </ul>
    </div>
  )
}

export default Activity