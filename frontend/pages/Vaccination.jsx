import React, { useState, useEffect } from "react";
import axios from "axios";

import { CiLocationOn } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { PiCityLight } from "react-icons/pi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";

const VaccinationEvents = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [events, setEvents] = useState([]);
  
  const userid = localStorage.getItem("id");
  const dis = localStorage.getItem("district") || "Unknown";
  const userRole = localStorage.getItem("role");

  const initialForm = {
    title: "",
    district: dis,
    date: "",
    time: "",
    location: "",
    funds: "",
    desc: "",
    organizer: ""
  };

  const [form, setForm] = useState(initialForm);

  // Fetch events
  const fetchEvents = () => {
    axios.get(`http://localhost:3000/vaccination/get-vEvents/${dis}`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to fetch events", err));
  };

  useEffect(() => {
    fetchEvents();
  }, [dis]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCompleted = (date) => new Date(date) < today;

  const filteredEvents = events.filter((e) => 
    activeTab === "upcoming" ? !isCompleted(e.date) : isCompleted(e.date)
  );

  // Open modal for Create
  const openCreateModal = () => {
    setIsEditMode(false);
    setForm(initialForm);
    setShowModal(true);
  };

  // Open modal for Edit
  const openEditModal = (event) => {
    setIsEditMode(true);
    setCurrentEventId(event.id);
    setForm({ ...event });
    setShowModal(true);
  };

  const handleCreateEvent = async () => {
    try {
      await axios.post("http://localhost:3000/vaccination/create-vEvent", form);
      alert("Event created successfully");
      fetchEvents();
      setShowModal(false);
    } catch (err) {
      alert("Failed to create event");
    }
  };

  const handleUpdateEvent = async () => {
    try {
      await axios.put(`http://localhost:3000/vaccination/update-vEvents/${currentEventId}`, form);
      alert("Event updated successfully");
      fetchEvents();
      setShowModal(false);
    } catch (err) {
      alert("Failed to update event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:3000/vaccination/delete-vEvents/${id}`);
        setEvents(events.filter(e => e.id !== id));
        alert("Event deleted");
      } catch (err) {
        alert("Failed to delete event");
      }
    }
  };

  return (
    <div className="p-8 min-h-screen max-w-5xl space-y-6 mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 py-2 border-b">
        <h1 className="text-2xl font-semibold text-gray-800">Vaccination Management</h1>
        {userRole === "admin" && (
          <button
            onClick={openCreateModal}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            + Create Event
          </button>
        )}
      </div>

      <div className="flex gap-4">
        {["upcoming", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize transition-colors ${
              activeTab === tab ? "border-b-2 border-green-600 text-green-600 font-bold" : "text-gray-500"
            }`}
          >
            {tab} Events
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {filteredEvents.length === 0 ? (
          <p className="text-gray-500">No {activeTab} events found</p>
        ) : (
          filteredEvents.map((event) => {
            const eventDone = isCompleted(event.date);
            return (
              <div key={event.id} className="bg-white border p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${eventDone ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"}`}>
                    {eventDone ? "Completed" : "Upcoming"}
                  </span>
                </div>
                
                <p className="text-slate-500 mb-4 line-clamp-2">{event.desc}</p>

                <div className="space-y-3 mb-6 flex-grow text-gray-700 text-sm grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <p className="flex items-center gap-2"><CiLocationOn className="text-xl text-gray-400"/> {event.location}</p>
                  <p className="flex items-center gap-2"><PiCityLight className="text-xl text-gray-400"/> {event.district}</p>
                  <p className="flex items-center gap-2"><SlCalender className="text-xl text-gray-400"/> {event.date}</p>
                  <p className="flex items-center gap-2"><IoTimeOutline className="text-xl text-gray-400"/> {event.time}</p>
                  {userRole === "admin" && (
                    <p className="flex items-center gap-2 font-semibold"><RiMoneyRupeeCircleLine className="text-xl text-gray-400"/> ₹{event.funds}</p>
                  )}
                </div>

                <div className="mt-auto border-t pt-4">
                  <p className="text-xs text-slate-500 mb-3">Organized by <span className="font-bold">{event.organizer}</span></p>
                  
                  {userRole === "admin" && activeTab === "upcoming" && (
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(event)} className="flex-1 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 py-1.5 rounded font-semibold transition-colors">Edit</button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="flex-1 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 py-1.5 rounded font-semibold transition-colors">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800">{isEditMode ? "Edit Event" : "Create New Event"}</h2>
            
            <div className="max-h-[60vh] overflow-y-auto space-y-4 px-1">
                <input placeholder="Event Title" className="w-full border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
                <input placeholder="District" className="w-full border p-2 rounded bg-gray-50 text-gray-500" value={dis} disabled />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="border p-2 rounded outline-none" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
                  <input placeholder="Time (10:00 AM)" className="border p-2 rounded outline-none" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} />
                </div>
                <input placeholder="Location" className="w-full border p-2 rounded outline-none" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} />
                <input placeholder="Funds Allocated" type="number" className="w-full border p-2 rounded outline-none" value={form.funds} onChange={(e) => setForm({...form, funds: e.target.value})} />
                <textarea placeholder="Description" className="w-full border p-2 rounded outline-none h-20" value={form.desc} onChange={(e) => setForm({...form, desc: e.target.value})} />
                <input placeholder="Organizer Name" className="w-full border p-2 rounded outline-none" value={form.organizer} onChange={(e) => setForm({...form, organizer: e.target.value})} />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 font-medium hover:bg-gray-100 rounded">Cancel</button>
              {isEditMode ? (
                <button onClick={handleUpdateEvent} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Save Changes</button>
              ) : (
                <button onClick={handleCreateEvent} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Create Event</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationEvents;