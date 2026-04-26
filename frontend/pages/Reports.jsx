import React, { useEffect, useState } from "react";
import axios from "axios";
import DoneIcon from '@mui/icons-material/Done';
import { RxCross2 } from "react-icons/rx";
import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  
  // 1. Define selection state per row ID
  const [rowSelection, setRowSelection] = useState({}); // Stores { reportId: "Rural" | "Urban" }

  const statusColors = {
    "Pending": "text-yellow-600",
    "Active": "text-green-600",
    "Rejected": "text-red-600"
  };

  useEffect(() => {
    axios.get("http://localhost:3000/reports").then(res => setReports(res.data));
  }, []);

  const handleApprove = (reportId, newStatus) => {
    const selectedType = rowSelection[reportId] || reports.find(r => r._id === reportId)?.rural_urban; // Get current selection or fallback to DB value
    // Validation: If approving, a type must be selected
    if (newStatus === "Active" && !selectedType) {
      alert("Please select Rural or Urban location first.");
      return;
    }

    axios.put(`http://localhost:3000/reports/${reportId}/status`, {
      status: newStatus, 
      type: selectedType // Send the type specific to this row
    })
    .then(res => {  
      setReports(reports.map(report =>
        report._id === reportId ? { ...report, status: newStatus, rural_urban: selectedType } : report
      ));
      // Clear local selection after success
      setRowSelection(prev => {
        const next = {...prev};
        delete next[reportId];
        return next;
      });
    });
  };
  const handleReject = (reportId, newStatus) => {

    axios.put(`http://localhost:3000/reports/${reportId}/status`, {
      status: newStatus, 
      
    })
    .then(res => {  
      setReports(reports.map(report =>
        report._id === reportId ? { ...report, status: newStatus } : report
      ));
      
    });
  };

  return (
    <div className="p-8 min-h-screen max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Reports</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Breed</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Date</th>
              <th className="p-3">PDF</th>
              <th className="p-3 text-center">Location Type</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => {
              const isHovered = hoveredRowId === r._id;
              // Check if selected locally OR already saved in DB
              const currentType = rowSelection[r._id] || r.rural_urban;

              return (
                <tr key={r._id} className="border-t hover:bg-gray-50 transition-colors"
                  onMouseEnter={() => setHoveredRowId(r._id)}
                  onMouseLeave={() => setHoveredRowId(null)}>
                  
                  <td className="p-3 text-center">{r.name}</td>
                  <td className="p-3 text-center">{r.cattle_id.breed_name}</td>
                  <td className="p-3 text-center">{r.owner_id.full_name}</td>
                  <td className="p-3 text-center">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-center">
                    <a href={`...`} target="_blank" className="text-blue-600 underline">Download</a>
                  </td>

                  {/* Location Selection Cell */}
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center">
                        <HolidayVillageOutlinedIcon 
                          onClick={() => setRowSelection(prev => ({...prev, [r._id]: "Rural"}))}
                          className={`text-2xl cursor-pointer transition-all ${currentType === "Rural" ? "text-green-600 scale-110" : "text-gray-300 hover:text-gray-400"}`} 
                        />
                        <span className="text-[10px] text-gray-400">Rural</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <ApartmentOutlinedIcon 
                          onClick={() => setRowSelection(prev => ({...prev, [r._id]: "Urban"}))}
                          className={`text-2xl cursor-pointer transition-all ${currentType === "Urban" ? "text-blue-600 scale-110" : "text-gray-300 hover:text-gray-400"}`} 
                        />
                        <span className="text-[10px] text-gray-400">Urban</span>
                      </div>
                    </div>
                  </td>
                <td className="p-3 text-center">
                  {/* Relative container with fixed dimensions to prevent layout jump */}
                  <div className="relative h-8 w-32 mx-auto flex items-center justify-center">

                    {/* 1. The Status Text (Hidden on hover) */}
                    <span className={`font-semibold font-serif text-xl transition-opacity duration-200  ${statusColors[r.status] || "text-gray-600"
                      } ${hoveredRowId === r._id ? 'opacity-0' : 'opacity-100'}`}>
                      {r.status}
                    </span>

                    {/* 2. The Icons (Absolute positioned to prevent size growth) */}
                    <div className={`absolute inset-0 flex items-center justify-center gap-4 transition-opacity duration-200 ${hoveredRowId === r._id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}>

                      {r.status === "Pending" && (
                        <>
                          <DoneIcon
                            className="text-green-700 bg-emerald-50 cursor-pointer text-4xl hover:text-green-500 transition-colors"
                            onClick={() => handleApprove(r._id, "Active")}
                          />
                          <RxCross2
                            className="text-red-500 bg-violet-100 cursor-pointer text-3xl hover:text-red-400 transition-colors "
                            onClick={() => handleReject(r._id, "Rejected")}
                          />
                        </>
                      )}

                      {r.status === "Active" && (
                        <RxCross2
                          className="text-red-500 cursor-pointer text-2xl hover:text-red-400 transition-colors"
                          onClick={() => handleReject(r._id, "Rejected")}
                        />
                      )}

                      {r.status === "Rejected" && (
                        <DoneIcon
                          className="text-green-700 cursor-pointer text-2xl font-bold hover:text-green-500 transition-colors"
                          onClick={() => handleApprove(r._id, "Active")}
                        />
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
