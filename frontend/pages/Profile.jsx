import React, { useEffect, useState } from "react";
import axios from "axios";


const Profile = () => {
  

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/users/profile/${storedUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);
      } catch (error) {
        console.error("Profile fetch error:", error);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        User not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        {/* Header */}
        <div className="flex items-center gap-6 border-b pb-6">
          
          {/* Profile Image */}
          <div className="relative">
            <img
              src={"https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250"}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border"
            />

            <label className="absolute bottom-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded cursor-pointer">
              Edit
              <input
                type="file"
                //onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Name & Role */}
          <div>
            <h2 className="text-2xl font-bold">{user.full_name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-sm text-blue-600 capitalize">
              {user.role || "Farmer"}
            </p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">

          <div>
            <p className="text-gray-500 text-sm">Phone</p>
            <p className="text-lg font-medium">
              {user.phone_number || "Not added"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Address</p>
            <p className="text-lg font-medium">
              {user.location.district || "Not added"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">State</p>
            <p className="text-lg font-medium">
              {user.location.state || "Not added"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Joined</p>
            <p className="text-lg font-medium">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"
                }
            </p>
          </div>

        </div>

        {/* Settings Section */}
        <div className="mt-8 border-t pt-6">

          <h3 className="text-xl font-semibold mb-4">Settings</h3>

          <div className="space-y-3">

            <button className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100">
              Edit Profile
            </button>

            <button className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100">
              Change Password
            </button>

            <button className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100">
              Notification Preferences
            </button>

          </div>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition"
        >
          Logout
        </button>

      </div>
    
    </div>
)
};

export default Profile;
