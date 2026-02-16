import { ImPhone, ImInfo, ImWarning } from "react-icons/im";
import React from "react";
const HelpPage = () => {
  return (
    <main className="space-y-5">

      {/* Header */}
      

      {/* Quick Help Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white border rounded-xl shadow-sm">
          <ImInfo className="text-2xl text-green-600 mb-2" />
          <h3 className="font-semibold mb-1">Using the App</h3>
          <p className="text-sm text-gray-600">
            Upload cattle images, view reports, and save health history.
          </p>
        </div>

        <div className="p-5 bg-white border rounded-xl shadow-sm">
          <ImWarning className="text-2xl text-amber-600 mb-2" />
          <h3 className="font-semibold mb-1">Health Disclaimer</h3>
          <p className="text-sm text-gray-600">
            AI results are advisory only. Consult a veterinarian for treatment.
          </p>
        </div>

        <div className="p-5 bg-white border rounded-xl shadow-sm">
          <ImPhone className="text-2xl text-blue-600 mb-2" />
          <h3 className="font-semibold mb-1">Contact Support</h3>
          <p className="text-sm text-gray-600">
            Reach out if reports fail to generate or data is missing.
          </p>
        </div>
      </section>

      {/* Emergency Advisory */}
      <section className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="font-semibold text-red-700 mb-2">
          Emergency Advisory
        </h2>
        <p className="text-sm text-red-700 leading-relaxed">
          If the system flags severe symptoms or your cattle shows sudden
          distress, immediately contact a certified veterinarian or local
          animal health center.
        </p>
      </section>

      {/* Accessibility */}
      <section className="bg-gray-50 border rounded-xl p-6">
        <h2 className="font-semibold text-gray-800 mb-2">
          Accessibility & Voice Assistance
        </h2>
        <p className="text-sm text-gray-600">
          Tap the 🔊 icon to listen to instructions. Designed for low-literacy
          and multilingual users.
        </p>
      </section>

    </main>
  );
}

export default HelpPage;
