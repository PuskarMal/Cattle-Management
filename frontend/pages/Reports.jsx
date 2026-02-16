import React, { useEffect, useState } from "react";
import axios from "axios";

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/reports").then(res => setReports(res.data));
  }, []);

  return (
    <div className="p-8 min-h-screen max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
        Reports
      </h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-center">Name</th>
              <th className="p-3">Breed</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-left">PDF</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r._id} className="border-t">
                <td className="p-3 text-center">{r.name}</td>
                <td className="p-3 text-center">{r.cattle_id.breed_name}</td>
                <td className="p-3 text-center">{r.owner_id.full_name}, {r.owner_id.user_id}</td>
                <td className="p-3 text-center">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <a
                    href={`http://localhost:3000/report/pdf/${r.pdf_file_id}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
